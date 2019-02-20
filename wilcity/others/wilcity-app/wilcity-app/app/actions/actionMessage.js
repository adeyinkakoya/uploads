import { GET_MESSAGE_LIST } from "../constants/actionTypes";
import axios from "axios";

export const getMessageList = _ => dispatch => {
  return axios
    .get("get-author-messages")
    .then(({ data }) => {
      console.log(data);
      // if (data.status === 'success') {
      //   dispatch({
      //     type: GET_MESSAGE_LIST,
      //   })
      // }
    })
    .catch(err => console.log(err));
};
