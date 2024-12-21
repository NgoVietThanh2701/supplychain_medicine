import { Sequelize } from "sequelize";

const database: Sequelize = new Sequelize(process.env.DATABASE_NAME || '', 'root', '', {
   host: 'localhost',
   dialect: 'mysql',
});

export default database;