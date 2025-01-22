import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Menu from '../Menu';
import { Row, Col, Alert } from 'react-bootstrap';
import Footer from '../Footer';
import { getArticleById } from '../../Services/articleservice';

const ViewArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  
  const role=localStorage.getItem("role");


  // Charger l'article
  const loadArticle = async () => {
    try {
      const token = localStorage.getItem('CC_Token');
      if (!token) throw new Error("Le token d'authentification est manquant.");
      const res = await getArticleById(id,token)
      console.log(res.data)
      setArticle(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement de l'article :", err);
      setError("Impossible de charger l'article.");
    }
  };

  // Charger les données initiales
  useEffect(() => {
    loadArticle();
  }, [id]);

  if (!article) return <p>Chargement...</p>;

  return (
    <div>

      <Menu />
      {role == "admin" ?

        <div className="p-3">
          <Row>
            <Col xs={6} md={2}>
              <h5>Actions</h5>
              <Link to="/articles">
                <button className="btn btn-outline" style={{ width: '100%' }}>
                  <span className="textColor">Liste des Articles</span>
                </button>
              </Link>
            </Col>
            <Col xs={12} md={10}>
              <h4>Détails De L'article</h4>
              {error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <div className='pl-3 pt-2'>
                  <Row>
                    <Col sm={4}>
                      <img src={article.imagearticle} alt={article.nomarticle} width="100%" />
                    </Col>
                    <Col sm={4} className='text-left'>
                      <span style={{ 'font-size': '50px' }}><b>{article.nomarticle}</b></span><br />
                      <span style={{ 'font-size': '20px' }}><b>{article.categorie.nomcategorie}</b></span><br />
                      <span style={{ 'font-size': '20px' }}><strong>Prix :</strong> <b className='text-danger'>{parseFloat(article.prix).toFixed(3)} DT</b></span>
                    </Col>
                  </Row>
                </div>
              )}
            </Col>
          </Row>
        </div>
        :
        <>
        <div className="p-3">
          {error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <div className='pl-3 pt-2 d-flex justify-content-center align-items-center flex-wrap'>
              <Row>
                <Col sm={4}>
                  <img src={article.imagearticle} alt={article.nomarticle} width="100%" />
                </Col>
                <Col sm={4} className='text-left'>
                  <span style={{ 'font-size': '50px' }}><b>{article.nomarticle}</b></span><br />
                  <span style={{ 'font-size': '20px' }}><b>{article.categorie.nomcategorie}</b></span><br />
                  <span style={{ 'font-size': '20px' }}><strong>Prix :</strong> <b className='text-danger'>{parseFloat(article.prix).toFixed(3)} DT</b></span><br/>

                </Col>
              </Row>
            </div>
          )}
        </div>
        <Footer/>
        </>
      }
    </div>
  );
};

export default ViewArticle;
