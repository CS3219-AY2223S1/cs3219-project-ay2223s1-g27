import UserModel from './user-model.js';
import 'dotenv/config'

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function createUser(params) {
  let userModelDocument = new UserModel(params)
  console.log(params)
  let user = await UserModel.findOne(params).exec()
  // query.then(function (err, result) {
  //   if (result == null) {
  //     console.log("NONE")
  //   } else {
  //     console.log(result)
  //   }
  // })
  console.log(user)
  if (user == null) {
    return userModelDocument
  } else {
    throw "User already exists"
  }
}

