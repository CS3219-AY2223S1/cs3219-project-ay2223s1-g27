import { DataTypes } from 'sequelize';

let MatchModelSchema = new Object({
  id: {
    type: DataTypes.BIGINT(11),
    autoIncrement: true,
    primaryKey: true
  },
  socket_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  difficulty: {
    type: DataTypes.ENUM('BEGINNER', 'INTERMEDIATE', 'EXPERT'),
    allowNull: false
  }
});
const MatchModel = (sequelize) => sequelize.define('MatchModel', MatchModelSchema);

export default MatchModel;
