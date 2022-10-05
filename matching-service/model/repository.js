import MatchModel from './match-model.js';
import 'dotenv/config'

import { Sequelize } from 'sequelize';

let sqliteDB = process.env.SQLITE_URI ? process.env.SQLITE_URI : 'sqlite::memory:';
const sequelize = new Sequelize(sqliteDB, {
  logging: console.log
})

const Match = MatchModel(sequelize);
sequelize.sync();

async function createMatch(params) {
  return Match.create(params);
}

async function findOneMatch(condition) {
  return Match.findOne(condition);
}

async function deleteMatch(condition) {
  return Match.destroy(condition);
}

export {
  Match,
  createMatch,
  deleteMatch,
  findOneMatch
}
