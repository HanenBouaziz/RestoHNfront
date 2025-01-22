import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Badge, Button, Modal, Row, Col } from 'react-bootstrap';
import Menu from '../Menu';
import Footer from '../Footer';
import { Link } from 'react-router-dom';
import { deleteCommande, listCommande } from '../../Services/commandeservice';

const ListCommandeClient = () => {
    const [commandes, setCommandes] = useState([]); // Liste des commandes
    const [loading, setLoading] = useState(true); // Indicateur de chargement
    const [error, setError] = useState(null); // Message d'erreur
    const [showAlert, setShowAlert] = useState(false);
    const [showModal, setShowModal] = useState(false);
const token = localStorage.getItem('CC_Token'); // Récupérer le token d'authentification

    // Charger les commandes depuis l'API
    const fetchCommandes = async () => {
        try {
            // const userId = localStorage.getItem('UserID');
            if (!token) throw new Error('Token manquant. Veuillez vous connecter.');

            const response = await listCommande(token);
            const sortedCommandes = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            // const filteredCommandes = sortedCommandes.filter(
            //     (commande) => commande.userId === userId
            // );

            setCommandes(sortedCommandes);
        } catch (err) {
            console.error('Erreur lors du chargement des commandes:', err);
            setError('Impossible de charger les commandes. Veuillez réessayer plus tard.');
        } finally {
            setLoading(false);
        }
    };
    const [commandeToDelete, setCommandeToDelete] = useState(null);

    const handleShowModal = (id) => {
        setCommandeToDelete(id);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setCommandeToDelete(null);
    };
    const handleDelete = async () => {
        try {
            const res = await deleteCommande(commandeToDelete,token);

            setCommandes(commandes.filter((cmd) => cmd.id !== commandeToDelete));
            handleCloseModal();
            setShowAlert(true);

            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        } catch (error) {
            console.error('Erreur lors de la suppression de commande', error);
            alert('Une erreur est survenue lors de la suppression');
        }
    };

    const [showScroll, setShowScroll] = useState(false);


    const handleScroll = () => {
        setShowScroll(window.scrollY > 200);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    useEffect(() => {
        fetchCommandes();

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    const formatCommandeID = (id) => {
        return id.toString().padStart(10, '0'); // Ajouter des zéros pour atteindre 10 caractères
    };

    return (
        <div>
            <Menu />
            <div className="p-5">
                <h3>Liste des Commandes</h3>
                {loading && (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </Spinner>
                    </div>
                )}
                {error && <Alert variant="danger">{error}</Alert>}
                {!loading && !error && (
                    <Table>
                        <thead>
                            <tr>
                                <th>Numéro</th>
                                <th>Date</th>
                                <th>Montant</th>
                                <th>État</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commandes.map((commande) => (
                                <tr key={commande.id}>
                                    <td>N°{commande.num}</td>
                                    <td>{new Date(commande.created_at).toLocaleString()}</td>
                                    <td>{commande.prixTotal} DT</td>
                                    <td>
                                        {commande.etat === 'En cours' ? (
                                            <Badge bg="warning">En cours</Badge>
                                        ) : commande.etat === 'Livrée' ? (
                                            <Badge bg="success">Livrée</Badge>
                                        ) : (
                                            <Badge bg="secondary">{commande.etat}</Badge>
                                        )}
                                    </td>
                                    <td>
                                        <Button
                                            variant="outline-danger"
                                            disabled={commande.etat === 'Livrée' || commande.etat === 'En cours'}
                                            onClick={() => handleShowModal(commande.id)}
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation de annulation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>Êtes-vous sûr de vouloir annuler cette commande ?</div>
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
            <Footer />
            {showScroll && (
                <button
                    className="scroll-to-top fleche-btn"
                    onClick={scrollToTop}
                >
                    <i className="fa-solid fa-arrow-up"></i>
                </button>
            )}
        </div>
    );
};

export default ListCommandeClient;