import UserModel from './user-model.js';
import PwdResetModel from './pwd-reset-model.js';
import MatchHistoryModel from './match-history.js';
import QuestionHistoryModel from './question-history.js';
import MessageHistoryModel from './message-history.js';
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

export async function getMatchHistory(room_id) {
  let session = await MatchHistoryModel.findOne({room_id : room_id});
  return session;
}

export async function createMatchHistory(room_id, user_id, difficulty_level) {
  let session = new MatchHistoryModel({room_id: room_id, users: [ user_id ], difficulty_level: difficulty_level});
  await session.save();
  return session;
}

export async function updateMatchHistory(room_id, users) {
  let session = await MatchHistoryModel.findOneAndUpdate({room_id: room_id}, {users: users}, {new: true});
  return session;
}

export async function getQuestionHistory(room_id) {
  let questionHistory = await QuestionHistoryModel.findOne({ room_id: room_id });
  return questionHistory;
}

export async function createQuestionHistory(room_id, titleSlug, codeSegment, language) {
  let questionHistory = new QuestionHistoryModel({
    room_id: room_id,
    questions: [{
      titleSlug: titleSlug, 
      codeSegment: codeSegment,
      language: language
    }]
  });
  await questionHistory.save();
  return questionHistory;
}

export async function updateQuestionHistory(room_id, questions) {
  let session = await QuestionHistoryModel.findOneAndUpdate({ room_id: room_id }, { questions: questions }, { new: true });
  return session;
}

export async function getRoomsFromUserID(uid, limit, offset) {
  let matches = await MatchHistoryModel.find({ users: uid }, undefined, {skip: offset, limit: limit}).sort({ createdAt: -1, updatedAt: -1 });
  return matches;
}

export async function createMessageHistory(room_id, messages) {
  let message = await MessageHistoryModel.findOneAndUpdate(
    { room_id: room_id }, 
    { messages: messages }, 
    { upsert: true, new: true });
  return message;
}

export async function getMessageHistory(room_id) {
  let message = await MessageHistoryModel.findOne({room_id: room_id});
  return message;
}
