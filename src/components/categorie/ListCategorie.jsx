import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Menu from '../Menu'
import { Container, Row, Col, Modal, Button,Alert, Pagination, Spinner } from 'react-bootstrap'
import { deleteCategorie, listCategorie } from '../../Services/categorieservice'

const ListCategorie = () => {
    const [categories, setCategories] = useState([])
    const [showModal, setShowModal] = useState(false) // État pour afficher/masquer la modale
    const [categoryToDelete, setCategoryToDelete] = useState(null) // Catégorie à supprimer
    const [showAlert, setShowAlert] = useState(false) 
    const [currentPage, setCurrentPage] = useState(1);
    const [menusPerPage] = useState(5);
        const [loading, setLoading] = useState(true); // Indicateur de chargement
    

    // Fonction pour récupérer les catégories depuis l'API
    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("CC_Token");
            if (token) {
                const res = await listCategorie(token);
                setCategories(res.data);
            }
        } catch (error) {
            console.log(error)
        }finally {
            setLoading(false);
        }
    }

    // Effect pour charger les catégories au premier rendu
    useEffect(() => {
        fetchCategories()
    }, [])

    // Fonction pour afficher la modale de confirmation de suppression
    const handleShowModal = (id) => {
        setCategoryToDelete(id);  // Définir la catégorie à supprimer
        setShowModal(true); // Afficher la modale
    }

    // Fonction pour cacher la modale
    const handleCloseModal = () => {
        setShowModal(false); // Cacher la modale
        setCategoryToDelete(null); // Réinitialiser l'ID de la catégorie à supprimer
    }

    // Fonction pour supprimer une catégorie

const handleDelete = async () => {
    try {
        const token = localStorage.getItem("token"); // Récupérer le token stocké dans le localStorage
        const res = await deleteCategorie(categoryToDelete, token); // Appeler la fonction utilitaire pour supprimer la catégorie

        // Vérification de la réussite de la suppression
        if (res.status === 200) {
            handleCloseModal(); // Fermer la modale après la suppression
            setShowAlert(true); // Afficher l'alerte de succès

            // Recharger la liste des catégories après suppression
            const refreshedCategories = await listCategorie(token); // Appeler l'API pour récupérer les catégories mises à jour
            setCategories(refreshedCategories.data); // Mettre à jour l'état avec les nouvelles données

            // Masquer l'alerte après 3 secondes
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        } else {
            alert("Échec de la suppression de la catégorie");
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de la catégorie", error);
        alert("Une erreur est survenue lors de la suppression");
    }
};

    const indexOfLastMenu = currentPage * menusPerPage;
    const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
    const currentMenus = categories.slice(indexOfFirstMenu, indexOfLastMenu);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(categories.length / menusPerPage); i++) {
        pageNumbers.push(i);
    }



    return (
        <div>
            <Menu />
            <div className="p-3">
                <Row>
                    <Col xs={6} md={2}>
                        <h5>Actions</h5>
                        <Link to="/categories/add">
                            <button className='btn btn-outline' style={{ "width": '100%' }}><span className='textColor'>Ajouter Catégorie</span></button>
                        </Link>
                    </Col>
                    <Col xs={12} md={10}>
                        <h4>Liste des catégories</h4>
                        {loading && (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </Spinner>
                    </div>
                )}
                        {showAlert && (
                <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                    La catégorie a été supprimée avec succès !
                </Alert>
            )}
             {!loading && (
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>Nom catégorie</th>
                                    <th>Image </th>
                                    <th>Date de création</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    currentMenus.map((cat, index) =>
                                        <tr key={index}>
                                            <td>{cat.nomcategorie}</td>
                                            <td><img src={cat.imagecategorie} width={110} height={80}/></td>
                                            <td>{new Date(cat.created_at).toLocaleString()}</td>
                                            <td>
                                                <Link to={`/categories/edit/${cat.id}`}>
                                                    <Button variant="outline-warning">
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </Button>
                                                </Link>&ensp;
                                                <Button variant="outline-danger" onClick={() => handleShowModal(cat.id)}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                }
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
            {/* Modale de confirmation de suppression */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation de suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>Êtes-vous sûr de vouloir supprimer cette catégorie ?</div>
                    <br/>
                    <div className='text-right'>
                    <Button className='colorButton' onClick={handleDelete}>
                        Confirmer
                    </Button>&ensp;
                    <Button className='colorButtonCancel' onClick={handleCloseModal}>
                        Annuler
                    </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ListCategorie
