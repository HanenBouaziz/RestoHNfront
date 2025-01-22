import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api/";

// Simple request sans header
export function getAxiosInstance() {
  if (!axios) {
    return axios.create({
      baseURL: axios.defaults.baseURL,
    });
  }
  return axios;
}

// Ajouter un intercepteur de requêtes
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      console.log("Token:", token);
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Ajouter un intercepteur de réponses
axios.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  async (error) => {
    console.error("Error response:", error.response);

    // Vérification si error.response est défini
    if (error.response) {
      const originalRequest = error.config;

      // Vérification du code de statut pour 401 et tentative de rafraîchir le token
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const res = await axios.post("users/refreshToken/");
          console.log("Token refreshed:", res);

          if (res.status === 200) {
            // Stocker le nouveau token
            const newToken = res.data.access_token;
            localStorage.setItem("CC_Token", newToken);

            // Mettre à jour l'en-tête Authorization
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            // Relancer la requête originale
            return axios(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh error:", refreshError);
          return Promise.reject(refreshError);
        }
      }
    }

    // Si aucune réponse ou autre erreur, rejeter l'erreur
    return Promise.reject(error);
  }
);

export default axios;
