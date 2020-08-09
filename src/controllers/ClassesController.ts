import {Request, Response} from 'express';
import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

// criada interface para mapear campo que se repete no request.body JSON
interface ScheduleItem {
    week_day: number,
    from: string,
    to: string
};

// nome em maisculo por ser classe
export default class ClassesController {

    // listar
    async index(request: Request, response: Response){
        const filters = request.query;

        const week_day = filters.week_day as string;
        const subject = filters.subject as string;
        const time = filters.time as string;
        
        // retorna erro se houver algum filtro não informado no request
        if(!week_day || !subject || !time){
            return response.status(400).json({
                error: 'Missing filters to search classes'
            })
        }

        const timeInMinutes = convertHourToMinutes(time);

        const classes = await db('classes')
        .whereExists(function(){
            this.select('class_schedule.*')
            .from('class_schedule')
            .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
            .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
            .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
            .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
        })
        .where('classes.subject', '=', subject)
        .join('users', 'classes.user_id', '=', 'users.id')
        .select(['classes.*','users.*']);           

        return response.json(classes);
    };
    
    // insert
    async create(request: Request, response: Response) {
    const {
        name,
        avatar,
        whatsapp,
        bio,
        subject,
        cost,
        schedule
    } = request.body;

    // variavel utilizada para controlar transação (todos os inserts na mesma transação), 
    //case de erro faz rollback de toda a operação
    // substituir o db por trx e executar commit ao final
    const trx = await db.transaction();

    try {

        //antes da criação de trx
        //const insertedUsersIds = await db('users').insert({
        const insertedUsersIds = await trx('users').insert({
            name,
            avatar,
            whatsapp,
            bio,
        });

        const user_id = insertedUsersIds[0];

        const insertedClassesIds = await trx('classes').insert({
            subject,
            cost,
            user_id
        });

        const class_id = insertedClassesIds[0];

        const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
            return {
                class_id,
                week_day: scheduleItem.week_day,
                from: convertHourToMinutes(scheduleItem.from),
                to: convertHourToMinutes(scheduleItem.to)
            }
        });

        await trx('class_schedule').insert(classSchedule);

        await trx.commit();

        // 201 significa inserido com sucesso
        return response.status(201).send();
    }
    catch (err) {
        // Se retornar erro, fazer o rollback de tudo que foi feito.
        await trx.rollback();

        // numero do status pode ser definido assim como a msg
        // ver codigos padrao response, 404, 504 etc...
        return response.status(400).json({
            error: 'Unexpected error while creating new class'
        });
    }
}
}