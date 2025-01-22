import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Menu from '../Menu';
import { Row, Col, Modal, Button, Alert, Pagination, Spinner } from 'react-bootstrap';
import { deleteArticle, listArticle } from '../../Services/articleservice';

const ListArticle = () => {
    const [articles, setArticles] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesPerPage] = useState(5);
    const [loading, setLoading] = useState(true); // Indicateur de chargement

    const token = localStorage.getItem("CC_Token"); 
    const fetchArticles = async () => {
        try {          
            if (token) {
               const res=await listArticle(token)
                setArticles(res.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleShowModal = (id) => {
        setArticleToDelete(id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setArticleToDelete(null);
    };

    const handleDelete = async () => {
        try {
            const res = await deleteArticle(articleToDelete,token)

            if (res.status === 200) {
                setArticles(articles.filter((art) => art.id !== articleToDelete));
                handleCloseModal();
                setShowAlert(true);
                 // Recharger la liste des catégories après suppression
                            const refreshedArticles = await listArticle(token); // Appeler l'API pour récupérer les catégories mises à jour
                            setArticles(refreshedArticles.data); // Mettre à jour l'état avec les nouvelles données
                

                setTimeout(() => {
                    setShowAlert(false);
                }, 3000);
            } else {
                alert('Échec de la suppression de l\'article');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'article', error);
            alert('Une erreur est survenue lors de la suppression');
        }
    };

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(articles.length / articlesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            <Menu />
            <div className="p-3">
                <Row>
                    <Col xs={6} md={2}>
                        <h5>Actions</h5>
                        <Link to="/articles/add">
                            <button className="btn btn-outline" style={{ width: '100%' }}>
                                <span className="textColor">Ajouter Article</span>
                            </button>
                        </Link>
                    </Col>
                    <Col xs={12} md={10}>
                        <h4>Liste des articles</h4>
                        {loading && (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </Spinner>
                    </div>
                )}
                        {showAlert && (
                            <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                                L'article a été supprimé avec succès !
                            </Alert>
                        )}
                        {!loading && (
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
                                    {currentArticles.map((art) => (
                                        <tr key={art.id}>
                                            <td>{art.nomarticle}</td>
                                            <td>
                                                <img src={art.imagearticle} width={100} height={100} alt="Article" />
                                            </td>
                                            <td>{parseFloat(art.prix).toFixed(3)} DT</td>
                                            <td>{art.categorie?.nomcategorie || 'Non spécifiée'}</td>
                                            <td>
                                                <Link to={`/articles/edit/${art.id}`}>
                                                    <Button variant="outline-warning">
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </Button>
                                                </Link>
                                                &ensp;
                                                <Button
                                                    variant="outline-danger"
                                                    onClick={() => handleShowModal(art.id)}
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </Button>
                                                &ensp;
                                                <Link to={`/articles/view/${art.id}`}>
                                                    <Button variant="outline-secondary">
                                                        <i className="fa-solid fa-circle-info"></i>
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <Pagination className="d-flex justify-content-end mt-4 custom-pagination">
                            <Pagination.First />
                            <Pagination.Prev />
                            {pageNumbers.map((number) => (
                                <Pagination.Item
                                    key={number}
                                    active={number === currentPage}
                                    onClick={() => paginate(number)}
                                >
                                    {number}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next />
                            <Pagination.Last />
                        </Pagination>
                    </Col>
                </Row>
            </div>
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation de suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>Êtes-vous sûr de vouloir supprimer cet article ?</div>
                    <br />
                    <div className="text-right">
                        <Button className="colorButton" onClick={handleDelete}>
                            Confirmer
                        </Button>
                        &ensp;
                        <Button className="colorButtonCancel" onClick={handleCloseModal}>
                            Annuler
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ListArticle;
