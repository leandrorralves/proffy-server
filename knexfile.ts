import path from 'path';

module.exports = {
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname,'src','database','database.sqlite')
    },
    // usado para controlar as versões em banco
    migrations: {
        directory: path.resolve(__dirname,'src','database','migrations')
    },
    useNullAsDefault: true,
};