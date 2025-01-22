import axios from "../Api/axios";
const USER_API="users"
export const signup=async(user)=> {
    return await axios.post(USER_API + "/register",user);
}
export const signin=async(user)=> {
    return await axios.post(USER_API+"/login", user);
}
export const logout=async()=> {
    return await axios.post(USER_API+"/logout");
}
export const profile=async()=> {
    return await axios.get(USER_API+"/user-profile");
}
export const getAllUsers= async (token) => {
    return await axios.get('all-users', {
      headers: { Authorization: `Bearer ${token}` },
    });
  };