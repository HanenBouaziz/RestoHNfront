import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Alert, Card, Button, DropdownButton, Dropdown, Modal } from 'react-bootstrap';
import Menu from '../Menu';
import Footer from '../Footer';
import { listCategorie } from '../../Services/categorieservice';
import { getMenuById } from '../../Services/menuservice';
import { listArticle } from '../../Services/articleservice';

const ViewMenu = () => {
  const { id } = useParams();

  const [menu, setMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menuArticles, setMenuArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const token = localStorage.getItem('CC_Token');
  const role = localStorage.getItem('role');

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      if (token) {
        const res = await listCategorie(token);
        setCategories(res.data);
      }
    } catch (error) {
      console.log(error);
      setError("Erreur lors du chargement des catégories");
    }
  };

  // Load menu details and its articles from API
  const loadMenu = async () => {
    try {
      // Charger les détails du menu
      const res = await getMenuById(id, token);
      const menuData = res.data;
      setMenu(menuData);

      // Charger tous les articles
      const res1 = await listArticle(token);
      const allArticles = res1.data;

      // Associer les articles aux lignes du menu
      const lignesWithArticles = menuData.lignes_menu.map((ligne) => {
        const articleDetails = allArticles.find((article) => article.id === ligne.articleID);
        return {
          ...ligne,
          id: articleDetails.id,
          nomarticle: articleDetails.nomarticle,
          imagearticle: articleDetails.imagearticle,
          prix: articleDetails.prix,
          categorieID: articleDetails.categorieID,
        };
      });

      setMenuArticles(lignesWithArticles);
      setFilteredArticles(lignesWithArticles); // Initialisation des articles filtrés
    } catch (err) {
      console.error("Erreur lors du chargement du menu :", err);
      setError("Impossible de charger les détails du menu.");
    } finally {
      setLoading(false);
    }
  };

  // Filter articles by category
  const handleCategoryFilter = (categoryId) => {
    if (categoryId) {
      const filtered = menuArticles.filter((article) => article.categorieID === categoryId);
      setFilteredArticles(filtered);
    } else {
      setFilteredArticles(menuArticles);
    }
  };

  useEffect(() => {
    fetchCategories();
    loadMenu();
  }, []);

  const handleShowModal = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
  };

  return (
    <div>
      <Menu />
      <div className="p-3">
        <Row>
          {role === "admin" ? (
            <Col xs={6} md={2}>
              <h5>Actions</h5>
              <Link to="/menus">
                <button className="btn btn-outline" style={{ width: '100%' }}>
                  <span className="textColor">Liste Des Menus</span>
                </button>
              </Link>
            </Col>
          ) :  <Col xs={6} md={1}></Col>}

          <Col xs={12} md={10}>
            <h4>Détails Du Menu</h4>
            {loading ? (
              <p>Chargement du menu...</p>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : (
              <><Row>
                <Col md={11}>
                <h5>
                  <b><span className='text-costum'>{menu.nommenu}</span></b>
                </h5>
                </Col>
                <Col md={1}>
                
                {/* Category Filter Dropdown */}
                <DropdownButton id="category-filter" title="Filtrer" variant="secondary">
                  <Dropdown.Item onClick={() => handleCategoryFilter(null)}>Toutes les Catégories</Dropdown.Item>
                  {categories.map((cat, index) => (
                    <Dropdown.Item key={index} onClick={() => handleCategoryFilter(cat.id)}>
                      {cat.nomcategorie}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
                </Col>
                
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Nom de l'Article</th>
                      <th>Image</th>
                      <th>Prix</th>
                      <th>Catégorie</th>
                    </tr>
                  </thead>
                  <tbody>
                   
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((article, index) => (
                      <tr key={index}>
                      <td>{article.nomarticle}</td>
                      <td>
                        <img src={article.imagearticle} alt={article.nomarticle} style={{ width: '50px' }} />
                      </td>
                      <td>{parseFloat(article.prix).toFixed(3)} DT</td>
                      <td>{categories.find(cat => cat.id === article.categorieID)?.nomcategorie}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">Aucun article dans ce menu</td>
                  </tr>
                )}
                  
                  </tbody>
                </table>
                </Row>
              </>
            )}
          </Col>
        </Row>
      </div>

      {/* Modal for article details */}
      {selectedArticle && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedArticle.nomarticle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={selectedArticle.imagearticle} alt={selectedArticle.nomarticle} style={{ width: '100%' }} />
            <p><strong>Prix:</strong> {parseFloat(selectedArticle.prix).toFixed(3)} DT</p>
            <p><strong>Catégorie:</strong> {categories.find(cat => cat.id === selectedArticle.categorieID)?.nomcategorie}</p>
            <p><strong>Description:</strong> {selectedArticle.description || "Pas de description disponible."}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Fermer</Button>
          </Modal.Footer>
        </Modal>
      )}

      {role === "admin" ? null : <Footer />}
    </div>
  );
};

export default ViewMenu;
