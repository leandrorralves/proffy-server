import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('connections', table => {
        table.increments('id').primary();
        //criacao de chave estrangeira
        table.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            // apaga todos os filhos caso o pai seja excluido
            .onDelete('CASCADE')
            // atualiza o id de pai e filhos
            .onUpdate('CASCADE');
        table.timestamp('created_at')
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            .notNullable();
    });
}

//roolback em caso de erro
export async function down(knex: Knex) {
    return knex.schema.dropTable('connections');
}