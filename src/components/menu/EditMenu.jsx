import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Menu from '../Menu';
import { Row, Col, Alert, Form, Button } from 'react-bootstrap';
import { listCategorie } from '../../Services/categorieservice';
import { listArticle } from '../../Services/articleservice';
import { addLigneMenu, deleteLigneMenu, getMenuById, listLigneMenu, updateMenu } from '../../Services/menuservice';

const EditMenu = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [menu, setMenu] = useState({
    name: ''
  });

  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArticle, setSelectedArticle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuArticles, setMenuArticles] = useState([]);
  const token = localStorage.getItem('CC_Token');

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      if (token) {
        const res1 = await listCategorie(token) ;
        setCategories(res1.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch articles from API
  const fetchArticles = async () => {
    try {
      setLoading(true);
      if (token) {
        const res = await listArticle(token);
        setArticles(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMenu = async () => {
    try {
      setLoading(true); // Activer l'état de chargement
  
      // Charger les détails du menu
      const menuResponse = await getMenuById(id, token);
      if (!menuResponse || !menuResponse.data) {
        throw new Error("Les détails du menu n'ont pas pu être récupérés.");
      }
      const menuData = menuResponse.data;
      setMenu(menuData);
  
      // Charger tous les articles
      const articlesResponse = await listArticle(token);
      if (!articlesResponse || !articlesResponse.data) {
        throw new Error("La liste des articles n'a pas pu être récupérée.");
      }
      const allArticles = articlesResponse.data;
  
      // Associer les articles aux lignes du menu
      const lignesWithArticles = (menuData.lignes_menu || []).map((ligne) => {
        const articleDetails = allArticles.find(
          (article) => article.id === ligne.articleID
        );
        return {
          ...ligne,
          id:articleDetails.id,
          nomarticle:articleDetails.nomarticle,
          imagearticle:articleDetails.imagearticle,
          prix:articleDetails.prix,
          categorieID:articleDetails.categorieID,
          };
      });
  
      setMenuArticles(lignesWithArticles);
    } catch (err) {
      console.error("Erreur lors du chargement du menu :", err);
      setError("Impossible de charger les détails du menu. Veuillez réessayer.");
    } finally {
      setLoading(false); // Désactiver l'état de chargement
    }
  };
  

  // Load categories and articles on component mount
  useEffect(() => {
    fetchCategories();
    fetchArticles();
  }, []);

  // Load menu after categories and articles are loaded
  useEffect(() => {
      loadMenu();
  }, []);

  // Update filtered articles when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      const filtered = articles.filter(
        (article) => article.categorieID === parseInt(selectedCategory)
      );
      setFilteredArticles(filtered);
    } else {
      setFilteredArticles(articles);
    }
  }, [selectedCategory, articles]);

  // Add article to the menu
  const handleAddArticle = () => {
    if (selectedArticle) {
      const articleToAdd = articles.find(article => article.id === parseInt(selectedArticle));
      if (articleToAdd) {
        setMenuArticles(prevArticles => [...prevArticles, articleToAdd]);  // Add to menuArticles
        setSelectedArticle('');  // Clear selected article after adding
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) throw new Error("Le token d'authentification est manquant.");
  
      // Étape 1 : Mise à jour du menu
      const newMenu = { ...menu };
      await updateMenu(id, token, newMenu);
  
      // Étape 2 : Récupérer les lignes existantes du menu
      const res1 = await listLigneMenu(token);
      const lignesExistantes = res1.data.filter((lg) => lg.menuID === parseInt(id));
  
      // Étape 3 : Création de deux listes : pour suppression et pour ajout
      const articlesExistants = lignesExistantes.map((lg) => lg.articleID);
      const articlesNouveaux = menuArticles.map((art) => art.id);
  
      // Articles à supprimer
      const articlesToRemove = lignesExistantes.filter(
        (ligne) => !articlesNouveaux.includes(ligne.articleID)
      );
  
      // Articles à ajouter
      const articlesToAdd = articlesNouveaux.filter(
        (articleID) => !articlesExistants.includes(articleID)
      );
  
      // Étape 4 : Suppression des lignes inutiles
      if (articlesToRemove.length > 0) {
        const deletePromises = articlesToRemove.map((ligne) =>
          deleteLigneMenu(ligne.id, token)
        );
        await Promise.all(deletePromises); // Attendre que toutes les suppressions soient terminées
      }
  
      // Étape 5 : Ajout des nouvelles lignes
      if (articlesToAdd.length > 0) {
        const addPromises = articlesToAdd.map((articleID) =>
          addLigneMenu({ menuID: parseInt(id), articleID }, token)
        );
        await Promise.all(addPromises); // Attendre que tous les ajouts soient terminés
      }
  
      // Étape 6 : Redirection ou confirmation
      navigate('/menus');
    } catch (err) {
      console.error("Erreur lors de la mise à jour du menu :", err);
      setError("Une erreur s'est produite lors de la mise à jour du menu.");
    }
  };
  
  
  return (
    <div>
      <Menu />
      <div className="p-3">
        <Row>
          <Col xs={6} md={2}>
            <h5>Actions</h5>
            <Link to="/menus">
              <button className="btn btn-outline" style={{ width: '100%' }}>
                <span className="textColor">Liste Des Menus</span>
              </button>
            </Link>
          </Col>
          <Col xs={12} md={10}>
            <h4>Modifier Menu</h4>
            {loading ? (
              <p>Chargement des catégories et articles...</p>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : null}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" as={Row}>
                <Col sm="4">
                  <Form.Label><b>Nom</b></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nom Menu"
                    value={menu.nommenu}
                    onChange={(e) => setMenu({ ...menu, nommenu: e.target.value })}
                  />
                </Col>
                <Col sm="4">
                  <Form.Label><b>Catégorie</b></Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Choisir une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nomcategorie}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
                <Col sm="4">
                  <Form.Label><b>Article</b></Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedArticle}
                    onChange={(e) => setSelectedArticle(e.target.value)}
                  >
                    <option value="">Choisir un article</option>
                    {filteredArticles.map((article) => (
                      <option key={article.id} value={article.id}>
                        {article.nomarticle}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </Form.Group>
              <Form.Group className="mb-3" as={Row}>
                <Col sm="11">
                  <Form.Label><b>Liste des articles ajoutés</b></Form.Label>
                </Col>
                <Col sm="1" className="text-right">
                  <Button type="button" className="btn-secondary" onClick={handleAddArticle}>
                    <i className="fa-solid fa-plus"></i>
                  </Button>
                </Col>
                <Col sm="12">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Nom Article</th>
                        <th>Image</th>
                        <th>Prix</th>
                        <th>Catégorie</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuArticles.length > 0 ? (
                        menuArticles.map((article, index) => (
                          <tr key={index}>
                            <td>{article.nomarticle}</td>
                            <td>
                              <img src={article.imagearticle} alt={article.nomarticle} style={{ width: '50px' }} />
                            </td>
                            <td>{article.prix}</td>
                            <td>{categories.find(cat => cat.id === article.categorieID)?.nomcategorie}</td>
                            <td>
                              <Button
                                variant="outline-danger"
                                onClick={() => setMenuArticles(menuArticles.filter((_, i) => i !== index))}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">Aucun article ajouté</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Col>
              </Form.Group>

              <Button type="submit" className="colorButton">
                <i className="fa-solid fa-floppy-disk"></i> Enregistrer
              </Button>&ensp;
              <Link to="/menus">
                <Button type="button" className="colorButtonCancel">
                  <i className="fa-solid fa-arrow-right-from-bracket"></i> Annuler
                </Button>
              </Link>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default EditMenu;
