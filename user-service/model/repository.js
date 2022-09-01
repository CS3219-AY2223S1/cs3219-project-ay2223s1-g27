import UserModel from './user-model.js';
import 'dotenv/config'

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Returns the user document, if username does not exist, throws an error
export async function getUser(username) {
  let user = await UserModel.findOne({username: username}).exec()
  console.log("Hello" + user)
  return user
}

export async function createUser(params) {
  let userModelDocument = new UserModel(params)
  return userModelDocument
}

