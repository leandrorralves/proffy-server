import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('class_schedule', table => {
        table.increments('id').primary();
        table.integer('week_day').notNullable();
        table.integer('from').notNullable();
        table.integer('to').notNullable();
        //criacao de chave estrangeira
        table.integer('class_id')
            .notNullable()
            .references('id')
            .inTable('classes')
            // apaga todos os filhos caso o pai seja excluido
            .onDelete('CASCADE')
            // atualiza o id de pai e filhos
            .onUpdate('CASCADE');
    });
}

//roolback em caso de erro
export async function down(knex: Knex) {
    return knex.schema.dropTable('class_schedule');
}