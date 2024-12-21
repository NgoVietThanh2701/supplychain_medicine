import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import initRoutes from './routes';
import database from './config/database';
import checkToken from './authentication/auth';

declare global {
   namespace Express {
      interface Request {
         user: any
      }
   }
}

const port = process.env.PORT || 8000;
const app: Express = express();

app.use(cors({
   origin: ['http://localhost:3000', 'http://localhost:3001'],
   methods: ['POST', 'DELETE', 'GET', 'PATCH']
}));

app.use(checkToken);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

initRoutes(app);
// app.use(express.static('./public'));

/* create table to database */
// (async () => {
//    await database.sync();
// })();

app.listen(port, () => { console.log(`Server running at http://localhost:${port}`) });