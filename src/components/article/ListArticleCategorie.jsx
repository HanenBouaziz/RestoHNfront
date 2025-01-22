import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import Menu from '../Menu';
import Footer from '../Footer';
import logo from "../../assets/logo222.png";
import entree from "../../assets/menu-entrees.svg";
import pizza from "../../assets/menu-pizzas.svg";
import salade from "../../assets/menu-salades.svg";
import dessert from "../../assets/menu-desserts.svg";
import menu from "../../assets/menu-menu.svg";
import axios from 'axios';
import { listArticle } from '../../Services/articleservice';

const ListArticleCategorie = () => {
    const { categorie } = useParams();
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();
    const [showScroll, setShowScroll] = useState(false);
    
            const token = localStorage.getItem('CC_Token');

    // Charger les articles pour une catégorie donnée
    const fetchArticles = async (categorie) => {
        try {
            if (token) {
                const res = await listArticle(token)

                // Filtrer les articles par catégorie
                const filteredArticles = res.data.filter(article => article.categorie.nomcategorie === categorie);
                setArticles(filteredArticles);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des articles de la catégorie :", error);
        }
    };

    const handleScroll = () => {
        setShowScroll(window.scrollY > 200);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Ajouter un article au panier
    const addToCart = (article) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find((item) => item.id === article.id);

        if (existingItem) {
            // Si l'article existe déjà dans le panier, augmenter la quantité
            existingItem.quantity += 1;
        } else {
            // Ajouter un nouvel article avec une quantité de 1
            cart.push({ ...article, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart)); // Sauvegarder le panier dans localStorage
    };

    useEffect(() => {
        fetchArticles(categorie);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [categorie]);

    return (
        <div>
            <Menu />
            <div className="p-5 text-center">
                <Row>
                    <Col sm="12" className="d-flex justify-content-center align-items-center flex-wrap">
                        <button
                            className="btn-category text-center"
                            onClick={() => navigate(`/carte`)}
                        >
                            <img src={menu} width={110} alt="Menu" /><br />
                            <h6>LA CARTE</h6>
                        </button>
                        {[
                            { img: entree, label: "ENTRÉES", cat: "Entrées" },
                            { img: pizza, label: "PIZZAS", cat: "Pizzas" },
                            { img: salade, label: "SALADES", cat: "Salades" },
                            { img: dessert, label: "DESSERTS", cat: "Desserts" },
                        ].map((item, idx) => (
                            <button
                                key={idx}
                                className="btn-category text-center"
                                onClick={() => navigate(`/carte/${item.cat}`)}
                            >
                                <img src={item.img} width={110} alt={item.label} /><br />
                                <h6>{item.label}</h6>
                            </button>
                        ))}
                    </Col>
                </Row><br />
            </div>
            <div className="p-1 text-center">
                <h2><b>La carte des {categorie.toLowerCase()}</b></h2>
            </div>
            <Row className="pl-4 pr-4">
                <Col sm="12" className="d-flex justify-content-center align-items-center flex-wrap">
                    {articles.length === 0 ? (
                        <p>Aucun article trouvé pour cette catégorie.</p>
                    ) : (
                        articles.map((art) => (
                            <div key={art.id} className="d-flex flex-column align-items-center p-4">
                                <img src={art.imagearticle} width={200} height={200} alt={art.nomarticle} />
                                <div className="text-center mt-2">
                                    <b>{art.nomarticle}</b>
                                    <div className="mt-2">
                                        <span className='bg-warning p-1'>
                                            &ensp;à partir de <b>{parseFloat(art.prix).toFixed(3)} DT&ensp;</b>
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        {/* Bouton Ajouter au panier avec icône */}
                                        <Button variant="outline-warning" onClick={() => addToCart(art)}>
                                            <i className="fa-solid fa-cart-plus"></i>
                                        </Button>&ensp;
                                        {/* Bouton Voir plus avec icône */}
                                        <Button variant="outline-secondary" onClick={() => navigate(`/articles/view/${art.id}`)}>
                                            <i className="fa-solid fa-circle-info"></i>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </Col>
            </Row>
            <br/>
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

export default ListArticleCategorie;
