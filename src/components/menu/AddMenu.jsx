import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Menu from '../Menu';
import { Container, Row, Col, Alert, Form, Button } from 'react-bootstrap';
import { listCategorie } from '../../Services/categorieservice';
import { listArticle } from '../../Services/articleservice';
import { addLigneMenu, addMenu } from '../../Services/menuservice';

const AddMenu = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState({});

  const [categories, setCategories] = useState([]); 
  const [articles, setArticles] = useState([]); 
  const [filteredArticles, setFilteredArticles] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [selectedArticle, setSelectedArticle] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuArticles, setMenuArticles] = useState([]); 
const token = localStorage.getItem('CC_Token');
  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      if (token) {
        const res1 = await listCategorie(token)
        setCategories(res1.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      if (token) {
        const res =await listArticle(token)
        setArticles(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchArticles();
  }, []);

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

  const handleAddArticle = () => {
    const articleToAdd = articles.find(article => article.id === parseInt(selectedArticle));
    if (articleToAdd) {
      setMenuArticles([...menuArticles, articleToAdd]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification du token
    if (!token) {
        setError('Token de session non trouvé.');
        return;
    }

    try {
        // Étape 1: Créer le menu
        const res = await addMenu(menu,token);

        // Vérification de la réponse de l'API
        if (!res || !res.data.id) {
            throw new Error('La création du menu a échoué. ID du menu non reçu.');
        }

        const menuID = res.data.id;
        console.log(menuID)
        
        // Étape 2: Ajouter les articles dans la table LigneMenu
        const articlePromises = menuArticles.map(async (article) => {
          const ligneMenuData = {
              menuID: menuID,
              articleID: article.id,
          };
      
          try {
              const response = await addLigneMenu(ligneMenuData, token);
              console.log('Réponse API addLigneMenu:', response.data);
          } catch (err) {
              console.error('Erreur lors de l’ajout de ligne de menu:', err);
          }
      });
      


        // Attendre que toutes les promesses d'ajout d'articles soient résolues
        await Promise.all(articlePromises);

        // Rediriger vers la liste des menus après l'ajout des articles
        navigate('/menus');
    } catch (error) {
        // Gestion améliorée des erreurs avec plus d'informations
        console.error('Erreur lors de la création du menu:', error);
        setError(`Une erreur est survenue lors de la création du menu : ${error.message}`);
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
            <h4>Ajouter un menu</h4>
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
                      {menuArticles.map((article, index) => (
                        <tr key={index}>
                          <td>{article.nomarticle}</td>
                          <td>
                            <img src={article.imagearticle} alt={article.nomarticle} style={{ width: '50px' }} />
                          </td>
                          <td>{article.prix}</td>
                          <td>{article.categorie.nomcategorie}</td>
                          <td>
                            <Button
                              variant="outline-danger"
                              onClick={() => setMenuArticles(menuArticles.filter((_, i) => i !== index))}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
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

export default AddMenu;
