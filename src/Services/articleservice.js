import axios from "../Api/axios";
const ARTICLE_API="articles"
export const addArticle = async (article, token) => {
    return await axios.post(ARTICLE_API, article, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
export const listArticle=async(token)=> {
    return axios.get(ARTICLE_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
}
export const getArticleById = async (id, token) => {
    return await axios.get(`${ARTICLE_API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
export const updateArticle = async (id, article, token) => {
    return await axios.put(`${ARTICLE_API}/${id}`, article, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
export const deleteArticle = async (id, token) => {
    return await axios.delete(`${ARTICLE_API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
