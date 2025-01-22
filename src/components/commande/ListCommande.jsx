import React, { useEffect, useState } from 'react';
import Menu from '../Menu';
import { Alert, Badge, ButtonGroup, Col, Dropdown, DropdownButton, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';
import { listCommande, updateCommande } from '../../Services/commandeservice';

const ListCommande = () => {
    const [commandes, setCommandes] = useState([]); // Liste des commandes
    const [loading, setLoading] = useState(true); // Indicateur de chargement
    const [error, setError] = useState(null); // Message d'erreur
    const [success, setSuccess] = useState(null); // Message de succès
            const token = localStorage.getItem('CC_Token'); // Récupérer le token d'authentification

    // Charger les commandes depuis l'API
    const fetchCommandes = async () => {
        try {
            if (!token) throw new Error('Token manquant. Veuillez vous connecter.');

            const response = await listCommande(token);
setCommandes(response.data);
            const sortedCommandes = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            console.log(sortedCommandes)
            
        } catch (err) {
            console.error('Erreur lors du chargement des commandes:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour mettre à jour une commande
    const updateCommandee = async (updatedCommande) => {
        try {
            if (!token) throw new Error('Token manquant. Veuillez vous connecter.');

            await updateCommande(updatedCommande.id,updatedCommande,token);

            // Mettre à jour la liste locale des commandes
            setCommandes((prevCommandes) =>
                prevCommandes.map((commande) =>
                    commande.id === updatedCommande.id ? updatedCommande : commande
                )
            );

        } catch (err) {
            console.error('Erreur lors de la mise à jour de la commande:', err);
        }
    };

    useEffect(() => {
        fetchCommandes();
    }, []);

    const formatCommandeID = (id) => {
        return id.toString().padStart(10, '0'); // Ajouter des zéros pour atteindre 10 caractères
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [menusPerPage] = useState(10);
    const indexOfLastMenu = currentPage * menusPerPage;
    const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
    const currentMenus = commandes.slice(indexOfFirstMenu, indexOfLastMenu);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(commandes.length / menusPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            <Menu />
            <div className="p-3">
                <Row>
                    <Col xs={6} md={2}></Col>
                    <Col xs={12} md={10}>
                        <h3>Liste des Commandes</h3>
                        {loading && (
                            <div className="text-center">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Chargement...</span>
                                </Spinner>
                            </div>
                        )}
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}
                        {!loading && !error && (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Numéro</th>
                                        <th>Client</th>
                                        <th>Date</th>
                                        <th>Montant</th>
                                        <th>État</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentMenus.map((commande) => (
                                        <tr key={commande.id}>
                                            <td>N°{formatCommandeID(commande.num)}</td>
                                            <td>{commande.user.name}</td>
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
                                                <DropdownButton
                                                    as={ButtonGroup}
                                                    variant='outline-secondary'
                                                    title="État"
                                                    id={`dropdown-${commande.id}`}
                                                    disabled={commande.etat === 'Livrée'}
                                                    onSelect={(newEtat) =>
                                                        updateCommandee({ 
                                                            ...commande, 
                                                            etat: newEtat 
                                                        })
                                                    }
                                                >
                                                    <Dropdown.Item eventKey="En cours">En cours</Dropdown.Item>
                                                    <Dropdown.Item eventKey="Livrée">Livrée</Dropdown.Item>
                                                </DropdownButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
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
        </div>
    );
};

export default ListCommande;