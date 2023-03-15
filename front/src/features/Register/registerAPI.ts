import { MY_SERVER } from "../../env";
import axios from "axios";
import IRegisterUser from "../../models/register";

export const registerUser = async (usr: IRegisterUser) => {
  const res = await axios.post(`${MY_SERVER}register/`, usr)
  return res.data
}