import MatchModel from './match-model.js';
import 'dotenv/config'

import { Sequelize } from 'sequelize';

let sqliteDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;
const sequelize = new Sequelize(sqliteDB, {
  logging: console.log
})

const Match = MatchModel(sequelize);
sequelize.sync();
export async function createMatch(params) {
  return Match.create(params);
}
