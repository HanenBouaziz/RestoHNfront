import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import logo2 from "../assets/logooo.png";
import axios from 'axios';
import { listCategorie } from '../Services/categorieservice';
const Footer = () => {
    const [categories, setCategories] = useState([]);
            const token = localStorage.getItem('CC_Token');


    const fetchCategories = async () => {
        try {
            if (token) {
                const res = await listCategorie(token);
                setCategories(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);
  return (
    <div className="footer bg-body-tertiary p-4">
                <Row className='p-4'>
                    <Col sm="4" className='pl-3'>
                        <img src={logo2} className='logoNav' alt="logo" /><br /><br />
                        <div className='p-2'>
                            <p><i className="fas fa-map-marker-alt"></i>&ensp;Route Tunis km 10, Sfax</p>
                            <p><i className="fas fa-envelope"></i>&ensp;bouazizhanen750@gmail.com<br />
                                <span className='pl-5'>nourabdelhedi41@gmail.com</span></p>
                            <p><i className="fas fa-phone"></i>&ensp;+216 21 406 770, +216 92 732 925</p>
                        </div>
                    </Col>
                    <Col sm="3">
                        <h5>Liens Utiles</h5>
                        <div>
                            <ul className="list-unstyled">
                                <li className=''><Link to="/home" className="text-secondary" style={{ textDecoration: 'none' }}>
                                    Accueil
                                </Link></li>
                                <li className='pt-2'><Link to="/about" className="text-secondary" style={{ textDecoration: 'none' }}>
                                    Menus
                                </Link></li>
                                {categories.map((cat) =>
                                    <li className='pt-2'><Link to={`/carte/${cat.nomcategorie}`} className="text-secondary" style={{ textDecoration: 'none' }}>
                                        {cat.nomcategorie}
                                    </Link></li>

                                )}
                            </ul>
                        </div>

                    </Col>
                    <Col sm="5" className='pr-3'>
                        <h5>Newsletters</h5>
                        <p>Inscrivez-vous dans notre newsletters</p>
                        <div className="d-flex">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Adresse email"
                                aria-label="Adresse email"
                            />&ensp;
                            <button className="btn btn-outline text-costum" type="button">
                                <i class="fa-solid fa-envelope"></i>
                            </button>
                        </div>
                        <br />

                        <h5>Suivez-Nous</h5>
                        <div>
                            <button
                                className="btn colorButton text-white"
                                type="button"
                                onClick={() => window.open("https://facebook.com", "_blank")}
                            >
                                <i className="fa-brands fa-facebook-f"></i>
                            </button>
                            &ensp;
                            <button
                                className="btn colorButton text-white"
                                type="button"
                                onClick={() => window.open("https://instagram.com", "_blank")}
                            >
                                <i className="fa-brands fa-instagram"></i>
                            </button>
                            &ensp;
                            <button
                                className="btn colorButton text-white"
                                type="button"
                                onClick={() => window.open("https://twitter.com", "_blank")}
                            >
                                <i className="fa-brands fa-twitter"></i>
                            </button>

                        </div>
                    </Col>

                </Row>
                <div className='pr-3 pl-3'>
                <hr />
                </div>
                <div className="mt-1 text-center">
                    <p>&copy; {new Date().getFullYear()} <b>H&N Resto</b>. Tous droits réservés.</p>
                </div>
            </div>
  )
}

export default Footer
