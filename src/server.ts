import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

//ouvir requisições http em uma porta, alterado para localhost:3333 (padrão 80) 
app.listen(3333);
