import axios from "../Api/axios";
const MENU_API="menus"
export const addMenu = async (menu, token) => {
    return await axios.post(MENU_API, menu, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
export const listMenu=async(token)=> {
    return axios.get(MENU_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
}
export const getMenuPaginate = async (token,pagesize,page) => {
  return await axios.get(`${MENU_API}/menuspaginate?pageSize=${pagesize}&page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getMenuById = async (id, token) => {
    return await axios.get(`${MENU_API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
export const updateMenu = async (id, menu, token) => {
    return await axios.put(`${MENU_API}/${id}`, menu, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
export const deleteMenu = async (id, token) => {
    return await axios.delete(`${MENU_API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
const LIGNE_MENU_API="lignesmenus"
export const addLigneMenu = async (ligne, token) => {
    return await axios.post(LIGNE_MENU_API, ligne, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  export const listLigneMenu=async(token)=> {
    return axios.get(LIGNE_MENU_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
};
export const getLigneMenuById = async (id, token) => {
  return await axios.get(`${LIGNE_MENU_API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const deleteLigneMenu=async(id,token)=> {
  return axios.delete(`${LIGNE_MENU_API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
});
};
