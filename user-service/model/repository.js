import UserModel from './user-model.js';
import PwdResetModel from './pwd-reset-model.js';
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
  return user
}

export async function deleteUser(username) {
  let deletedCountObject = await UserModel.deleteOne({username: username})
  const deletedCount = deletedCountObject.deletedCount
  return deletedCount == 1
}

export async function updatePassword(username, newPassword) {
  let updatedUser = await UserModel.findOneAndUpdate({username:username}, {password:newPassword})
  return updatedUser
}

export async function createUser(params) {
  //UserModel schema defines username to be unique, hence no duplicate usernames will exist.
  let userModelDocument = new UserModel(params)
  return userModelDocument
}

export async function createPwdResetRequest(params) {
  let pwdResetDocument = new PwdResetModel(params)
  return pwdResetDocument
}

export async function getPwdResetRequest(documentId) {
  let pwdResetRequest = await PwdResetModel.findOneAndDelete({_id: documentId}).exec()
  return pwdResetRequest
}
