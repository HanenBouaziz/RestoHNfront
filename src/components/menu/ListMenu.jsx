import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Menu from '../Menu';
import { Row, Col, Modal, Button, Alert, Pagination, Spinner } from 'react-bootstrap';
import { deleteMenu, listLigneMenu, listMenu } from '../../Services/menuservice';

const ListMenu = () => {
  const [menus, setMenus] = useState([]);
  const [ligneMenus, setLigneMenus] = useState([]);
  const [articles, setArticles] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [menusPerPage] = useState(15);
  const[prixMenu,setPrixMenu]=useState({});
  const [loading, setLoading] = useState(true); // Indicateur de chargement

 const token = localStorage.getItem('CC_Token');
  const fetchMenus = async () => {
    try {
       
        if (token) {
            const res = await listMenu(token)
            setMenus(res.data);
        }
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
  };
  const fetchLigneMenus=async()=>{
    try {
      if (token) {
          const res = await listLigneMenu(token)
          setLigneMenus(res.data);
          console.log(ligneMenus)
      }
    } catch (error) {
        console.log(error);
    } 
  }
  
  const calculPrixMenu = async () => {
    const updatedPrixMenu = { ...prixMenu }; // Copie de l'état existant
    for (const m of menus) {
        let prix = 0; // Utiliser `let` pour permettre la réassignation
        for (const l of ligneMenus) {
            if (m.id === l.menuID) {
                prix +=parseFloat(l.article.prix,3);
            }
        }
        // Mettre à jour l'objet temporaire
        updatedPrixMenu[m.id] = parseFloat(prix,3);
    }
    // Mettre à jour l'état avec toutes les modifications à la fin
    setPrixMenu(updatedPrixMenu);
};

useEffect(() => {
  fetchMenus();
  fetchLigneMenus();
}, []);

useEffect(() => {
  if (menus.length > 0 && ligneMenus.length > 0) {
      calculPrixMenu();
  }
}, [menus, ligneMenus]);
  const handleShowModal = (id) => {
    setMenuToDelete(id);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setMenuToDelete(null);
  };

  const handleDelete = async () => {
    try {
        const res = await deleteMenu(menuToDelete,token);
        if (res.status === 200) {
             handleCloseModal(); // Fermer la modale après la suppression
                        setShowAlert(true); // Afficher l'alerte de succès
            
                        // Recharger la liste des catégories après suppression
                        const refreshedMenus = await listMenu(token); // Appeler l'API pour récupérer les catégories mises à jour
                        setMenus(refreshedMenus.data); // Mettre à jour l'état avec les nouvelles données
            
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        } else {
            alert('Échec de la suppression de menu');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de menu', error);
        alert('Une erreur est survenue lors de la suppression');
    }
};

  const indexOfLastMenu = currentPage * menusPerPage;
    const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
    const currentMenus = menus.slice(indexOfFirstMenu, indexOfLastMenu);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(menus.length / menusPerPage); i++) {
        pageNumbers.push(i);
    }

  return (
    <div>
            <Menu />
            <div className="p-3">
                <Row>
                    <Col xs={6} md={2}>
                        <h5>Actions</h5>
                        <Link to="/menus/add">
                            <button className="btn btn-outline" style={{ width: '100%' }}>
                                <span className="textColor">Ajouter Menu</span>
                            </button>
                        </Link>
                    </Col>
                    <Col xs={12} md={10}>
                        <h4>Liste des menus</h4>
                        {loading && (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </Spinner>
                    </div>
                )}
                        {showAlert && (
                            <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                                Menu a été supprimé avec succès !
                            </Alert>
                        )}
                        {!loading &&(
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Nom Menu</th>
                                        <th>Prix</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentMenus.map((menu) => (
                                        <tr key={menu.id}>
                                            <td>{menu.nommenu}</td>
                                            <td>{prixMenu[menu.id] ? prixMenu[menu.id] : 0} DT</td>
                                            <td>
                                                <Link to={`/menus/edit/${menu.id}`}>
                                                    <Button variant="outline-warning">
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </Button>
                                                </Link>
                                                &ensp;
                                                <Button
                                                    variant="outline-danger"
                                                    onClick={() => handleShowModal(menu.id)}
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </Button>
                                                &ensp;
                                                <Link to={`/menus/view/${menu.id}`}>
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
                    <div>Êtes-vous sûr de vouloir supprimer cet menu ?</div>
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
  )
}

export default ListMenu
