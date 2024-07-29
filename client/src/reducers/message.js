import { SET_MESSAGE, CLEAR_MESSAGE } from "../types/types";

const initialState = {};

export default function (state = initialState, action) {// eslint-disable-line
  const { type, payload } = action;

  switch (type) {
    case SET_MESSAGE:
      return { message: payload };

    case CLEAR_MESSAGE:
      return { message: "" };

    default:
      return state;
  }
}
