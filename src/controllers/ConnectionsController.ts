import { Request, Response } from 'express';
import db from '../database/connection';

// nome em maisculo por ser classe
export default class ConnectionsController {

    // listar
    async index(request: Request, response: Response) {
        const totalConnections = await db('connections').count('* as total');

        const { total } = totalConnections[0];

        //{} para retornar dentro de um objeto
        return response.json({ total });
    };

    // insert
    async create(request: Request, response: Response) {
        const { user_id } = request.body;

        await db('connections').insert({
            user_id,
        });

        return response.status(201).send();
    }
}