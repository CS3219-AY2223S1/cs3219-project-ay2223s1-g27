const URI_USER_SVC = process.env.REACT_APP_URI_USER_SVC || "http://localhost:8000";

const PREFIX_USER_SVC = "/api/user";
const PREFIX_CREATEUSER = "/createuser";
const PREFIX_LOGIN = "/login"
const PREFIX_RESETPASSWORD = "/resetpassword"

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;
export const URL_USER_SVC_CREATEUSER = URL_USER_SVC + PREFIX_CREATEUSER;
export const URL_USER_SVC_LOGIN = URL_USER_SVC + PREFIX_LOGIN;
export const URL_USER_SVC_RESETPASSWORD = URL_USER_SVC + PREFIX_RESETPASSWORD;

const URI_MATCHING_SVC = process.env.REACT_APP_URI_MATCHING_SVC || "http://localhost:8001";

export const URL_MATCHING_SVC = URI_MATCHING_SVC;
