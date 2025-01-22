import axios from "../Api/axios";
const COMMANDE_API="commandes"

export const addCommande = async (commande, token) => {
    return await axios.post(COMMANDE_API, commande, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
export const listCommande=async(token)=> {
    return axios.get(COMMANDE_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
};

// export const getLastCommandeId = async (token) => {
//         return axios.get(`/commandes/last-id`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
// };



export const updateCommande = async (id, commande, token) => {
    return await axios.put(`${COMMANDE_API}/${id}`, commande, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
// const updateCommandeNum = async (id, num, token) => {
//     return axios.put(`${COMMANDE_API}/${id}`, { num }, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
// };

export const deleteCommande = async (id, token) => {
    return await axios.delete(`${COMMANDE_API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

const LIGNE_COMMANDE_API="lignescommandes"
export const addLigneCommande = async (ligne, token) => {
    return await axios.post(LIGNE_COMMANDE_API, ligne, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };