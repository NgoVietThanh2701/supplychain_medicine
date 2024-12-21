import { DataTypes } from "sequelize";
import database from "../config/database";

const Category = database.define('category', {
   code: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   },
   name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   },
}, {
   freezeTableName: true
});

// (async () => {
//    await database.sync();
// })();

export default Category;
