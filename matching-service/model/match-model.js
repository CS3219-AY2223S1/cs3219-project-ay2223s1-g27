import { Model, DataTypes } from 'sequelize';

let MatchModelSchema = new Object ({
  id: {
    type: DataTypes.BIGINT(11),
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  difficulty: {
    type: DataTypes.STRING,
    allowNull:false
  }
}); 
const MatchModel = (sequelize) => sequelize.define('MatchModel', MatchModelSchema);

export default MatchModel;
