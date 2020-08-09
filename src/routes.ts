import express, { request, response } from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';

const routes = express.Router();

//Classes criadas para os controllers
//TODO: Estas classes manipulam direto o DB, implementar MVC e DAO usado neste cenário.
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();

//definição de recursos ex. /users o que vem depois da / na rota ex. localhost:3333/users

// métodos por recurso
//GET: buscar dados
//POST: inserir dados
//PUT: atualizar dados
//DELETE: excluir dados

// No request há as seguintes infos
//Corpo (Request.Body): Dados para uma determinada entidade
//Request.Route: Identificacação da entidade
//Request.query: Parametros de paginação, ordenação, filtro etc

routes.get('/classes', classesController.index);
routes.post('/classes', classesController.create);

routes.get('/connections', connectionsController.index);
routes.post('/connections', connectionsController.create);

export default routes;