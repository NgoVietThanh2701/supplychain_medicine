import { DataTypes } from "sequelize";
import database from "../config/database";

const Statistical = database.define('statistical', {
   idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   },
   revenue: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
      validate: {
         notEmpty: false
      }
   },
   spend: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
      validate: {
         notEmpty: false
      }
   },
   dateOfWeek: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   }
}, {
   freezeTableName: true
});

// (async () => {
//    await database.sync();
// })();

export default Statistical;
