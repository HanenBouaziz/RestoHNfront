import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Menu from '../Menu'
import { Container, Row, Col, Modal, Button, Alert, Pagination, Badge, Spinner } from 'react-bootstrap'
import { getAllUsers } from '../../Services/authservice'

const ListClient = () => {
    const [clients, setClients] = useState([])
    const [showAlert, setShowAlert] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [menusPerPage] = useState(15);
    const [loading, setLoading] = useState(true); // Indicateur de chargement
    

    // Fonction pour récupérer les catégories depuis l'API
    const fetchClients = async () => {
        try {
            const token = localStorage.getItem("CC_Token");
            if (token) {
                const res = await getAllUsers(token);
                setClients(res.data);
            }
        } catch (error) {
            console.log(error)
        }finally {
            setLoading(false);
        }
    }

    // Effect pour charger les catégories au premier rendu
    useEffect(() => {
        fetchClients()
    }, [])



    const indexOfLastMenu = currentPage * menusPerPage;
    const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
    const currentMenus = clients.slice(indexOfFirstMenu, indexOfLastMenu);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(clients.length / menusPerPage); i++) {
        pageNumbers.push(i);
    }



    return (
        <div>
            <Menu />
            <div className="p-3">
                <Row>
                    <Col xs={6} md={2}>
                    </Col>
                    <Col xs={12} md={10}>
                        <h4>Liste Des Clients</h4>
                        {loading && (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </Spinner>
                    </div>
                )}
                 {!loading && (
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>Nom Utilisateur</th>
                                    <th>E-mail</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    currentMenus.map((cl, index) =>
                                        <tr key={index}>
                                            <td>{cl.name}</td>
                                            <td>{cl.email}</td>
                                            <td>
                                            {cl.isActive === 0 ? (
                                                    <Badge bg="secondary">Désactivé</Badge>
                                                ) : (
                                                    <Badge bg="success">Activé</Badge>
                                                )}
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
        </div>
    )
}

export default ListClient
