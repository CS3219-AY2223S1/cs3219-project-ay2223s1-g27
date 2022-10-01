const URI_USER_SVC = process.env.REACT_APP_URI_USER_SVC || "http://localhost:8000";

const PREFIX_USER_SVC = "/api/user";
const PREFIX_CREATEUSER = "/createuser";
const PREFIX_LOGIN = "/login"
const PREFIX_LOGOUT = "/logout"
const PREFIX_REFRESH_TOKEN = "/renewtokens"
const PREFIX_RESETPASSWORD = "/resetpassword"
const PREFIX_RESETLINK = "/sendresetlink"
const PREFIX_UPDATEPASSWORD = "/updatepassword"

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;
export const URL_USER_SVC_CREATEUSER = URL_USER_SVC + PREFIX_CREATEUSER;
export const URL_USER_SVC_LOGIN = URL_USER_SVC + PREFIX_LOGIN;
export const URL_USER_SVC_UPDATEPASSWORD = URL_USER_SVC + PREFIX_UPDATEPASSWORD;
export const URL_USER_SVC_RESETPASSWORD = URL_USER_SVC + PREFIX_RESETPASSWORD;
export const URL_USER_SVC_RESETLINK = URL_USER_SVC + PREFIX_RESETLINK;
export const URL_USER_SVC_LOGOUT = URL_USER_SVC + PREFIX_LOGOUT;
export const URL_USER_SVC_REFRESH_TOKEN = URL_USER_SVC + PREFIX_REFRESH_TOKEN;

const URI_MATCHING_SVC = process.env.REACT_APP_URI_MATCHING_SVC || "http://localhost:8001";
export const PREFIX_MATCHING_SVC = "/api/matching";
export const URL_MATCHING_SVC = URI_MATCHING_SVC;

const PREFIX_QUESTION = "/question";
const PREFIX_QUESTIONS = "/questions";

const URI_QUESTION_SVC = process.env.REACT_APP_URI_QUESTION_SVC || "http://localhost:8002";
export const PREFIX_QUESTION_SVC = "/api/question";
export const URL_QUESTION_SVC = URI_QUESTION_SVC + PREFIX_QUESTION_SVC;
export const URL_QUESTION_SVC_QUESTION = URL_QUESTION_SVC + PREFIX_QUESTION;
export const URL_QUESTION_SVC_QUESTIONS = URL_QUESTION_SVC + PREFIX_QUESTIONS;

const URI_COLLAB_SVC = process.env.REACT_APP_URI_COLLAB_SVC || "http://localhost:8003";
export const PREFIX_COLLAB_SVC = "/api/collab";
export const URL_COLLAB_SVC = URI_COLLAB_SVC;

export const PREFIX_FRONTEND_ROOT = "/";
export const PREFIX_FRONTEND_SIGNUP = "/signup";
export const PREFIX_FRONTEND_LOGIN = "/login";
export const PREFIX_FRONTEND_LANDING = "/landing";
export const PREFIX_FRONTEND_MATCHING = "/matching";
export const PREFIX_FRONTEND_ROOM = "/room";
export const PREFIX_FRONTEND_RESETPWD = "/resetpassword";

