import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import quiz from "./quiz";
import user from "./user";

export default combineReducers({
  auth,
  user,
  message,
  quiz,
});
