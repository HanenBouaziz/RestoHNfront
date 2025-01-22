import React, { useState, useEffect } from 'react';
import { Nav, Navbar,NavDropdown, Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logooo.png';

const Menu = () => {
    const navigate = useNavigate();
    const role=localStorage.getItem("role");
    const username=localStorage.getItem("username");


    useEffect(() => {
    }, []); // Exécute fetchUser une seule fois au montage du composant

    return (
        <Navbar className='bg-body-tertiary'>
            
                
                { role=="admin"? 
                <Container className='p-2'>
                    <Navbar.Brand className='pl-3'><img src={logo} className='logoNav' alt="logo" /></Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/menus">Menus</Nav.Link>
                        <Nav.Link as={Link} to="/categories">Catégories</Nav.Link>
                        <Nav.Link as={Link} to="/articles">Articles</Nav.Link>
                        <Nav.Link as={Link} to="/clients">Clients</Nav.Link>
                        <Nav.Link as={Link} to="/commandes-client">Commandes</Nav.Link>
                    </Nav>
                </Container>
                    :
                    <Container className='p-2'>
                    <Navbar.Brand className='pl-5'><img src={logo} className='logoNav' alt="logo" /></Navbar.Brand>
                    <Nav className="me-auto">
                    <Nav.Link as={Link} to="/home">Accueil</Nav.Link> &ensp;
                    <NavDropdown 
                        drop="down" 
                        align="start"
                        title="Carte"
                        className="d-flex pr-4 dropdown-centered">
                        <NavDropdown.Item onClick={() => navigate(`/carte/Entrées`)}>
                            Entrées
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => navigate(`/carte/Pizzas`)}>
                           Pizzas
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => navigate(`/carte/Salades`)}>
                           Salades
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => navigate(`/carte/Desserts`)}>
                           Desserts
                        </NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link as={Link} to="/listmenus">Menus</Nav.Link>&ensp;
                    <Nav.Link as={Link} to="/commandes">Commandes</Nav.Link>
                    
                </Nav></Container>  
            }
            { role=="admin"? 
                    <NavDropdown 
                    drop="down" 
                    align="end"
                    title={username ? (
                        <span className='flex'>
                                <i class="fa-solid fa-user"></i>
                            &ensp;<span className='p-1'>{username}</span>
                        </span>
                    ) : (
                        <span>Utilisateur non connecté</span>
                    )}
                    className="d-flex pr-4 dropdown-centered">
                    <NavDropdown.Item href="#action4">
                        <i class="fa-solid fa-circle-info"></i>
                        &ensp;<span className='p-1'>Votre Compte</span>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>
                        <i class="fa-solid fa-right-from-bracket"></i>
                        &ensp;<span className='p-1'><Link to="/logout">Déconnexion</Link></span>
                    </NavDropdown.Item>
                </NavDropdown>
                    : 
                <>
                   <Nav className="d-flex align-items-center">
                        <Nav.Link as={Link} to="/panier" className="d-flex align-items-center">
                            <i className="fa-solid fa-cart-shopping me-1"></i>
                            <span>Panier</span>
                        </Nav.Link>
                    </Nav>&ensp;&ensp;
                    <NavDropdown 
                        drop="down" 
                        align="end"
                        title={username ? (
                            <span className='flex'>
                                    <i class="fa-solid fa-user"></i>
                                &ensp;<span className='p-1'>{username}</span>
                            </span>
                        ) : (
                            <span>Utilisateur non connecté</span>
                        )}
                        className="d-flex pr-4 dropdown-centered">
                        <NavDropdown.Item href="#action4">
                            <i class="fa-solid fa-circle-info"></i>
                            &ensp;<span className='p-1'>Votre Compte</span>
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item >
                            <i class="fa-solid fa-right-from-bracket"></i>
                            &ensp;<span className='p-1'><Link to="/logout">Déconnexion</Link></span>
                        </NavDropdown.Item>
                    </NavDropdown> &ensp;
                    </>  
                }
            &ensp;
        </Navbar>
    );
};

export default Menu;
