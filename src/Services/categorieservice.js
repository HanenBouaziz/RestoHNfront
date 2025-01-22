import axios from "../Api/axios";
const CATEGORIE_API="categories"
export const addCategorie = async (categorie, token) => {
    return await axios.post(CATEGORIE_API, categorie, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
export const listCategorie=async(token)=> {
    return axios.get(CATEGORIE_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
}
export const getCategorieById = async (id, token) => {
    return await axios.get(`${CATEGORIE_API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
// Fonction pour mettre à jour une catégorie
export const updateCategorie = async (id, categorie, token) => {
    return await axios.put(`${CATEGORIE_API}/${id}`, categorie, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
export const deleteCategorie = async (id, token) => {
    return await axios.delete(`${CATEGORIE_API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
