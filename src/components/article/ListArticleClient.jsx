import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import Menu from '../Menu';
import Footer from '../Footer';
import logo from "../../assets/logo222.png";
import entree from "../../assets/menu-entrees.svg";
import pizza from "../../assets/menu-pizzas.svg";
import salade from "../../assets/menu-salades.svg";
import dessert from "../../assets/menu-desserts.svg";
import axios from 'axios';
import { listArticle } from '../../Services/articleservice';
import { listCategorie } from '../../Services/categorieservice';

const ListArticleClient = () => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cart, setCart] = useState([]);
    const [showScroll, setShowScroll] = useState(false);
    const navigate = useNavigate();
            const token = localStorage.getItem('CC_Token');

    const fetchArticles = async () => {
        try {
            if (token) {
                const res = await listArticle(token);
                setArticles(res.data);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des articles :", error);
        }
    };

    const fetchCategories = async () => {
        try {
            if (token) {
                const res = await listCategorie(token)
                setCategories(res.data);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des catégories :", error);
        }
    };

    const addToCart = (article) => {
        const existingItem = cart.find((item) => item.id === article.id);
        if (existingItem) {
            const updatedCart = cart.map((item) =>
                item.id === article.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        } else {
            const updatedCart = [...cart, { ...article, quantity: 1 }];
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const renderRows = (cat) => {
        const filteredArticles = cat 
            ? articles.filter((art) => art.categorie.nomcategorie === cat).slice(0, 5) 
            : articles.slice(0, 5);
    
        return (
            <tr>
                {filteredArticles.map((art, index) => (
                    <td key={index} className="text-center p-3">
                        <div className="d-flex flex-column align-items-center">
                            <img src={art.imagearticle} width={200} height={200} alt={art.nomarticle} />
                            <div className="text-center mt-2">
                                <b>{art.nomarticle}</b>
                                <div className="mt-2">
                                    <span className='bg-warning p-1'>
                                        &ensp;à partir de <b>{parseFloat(art.prix).toFixed(3)} DT&ensp;</b>
                                    </span>
                                </div>
                                <div className="mt-3">
                                    <Button variant="outline-warning" onClick={() => addToCart(art)}>
                                        <i className="fa-solid fa-cart-plus"></i>
                                    </Button>&ensp;
                                    <Button variant="outline-secondary" onClick={() => navigate(`/articles/view/${art.id}`)}>
                                        <i className="fa-solid fa-circle-info"></i>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </td>
                ))}
            </tr>
        );
    };

    const handleScroll = () => {
        setShowScroll(window.scrollY > 200);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        fetchArticles();
        fetchCategories();
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div>
            <Menu />
            <div className="p-5 text-center">
                <Row>
                    <Col sm="12" className="p-3">
                        <h2 className=""><b>La carte de H&N</b></h2>
                    </Col>
                    <Col sm="12" className="d-flex justify-content-center align-items-center flex-wrap">
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
            {["Entrées", "Pizzas", "Salades", "Desserts"].map((cat, idx) => (
                <div key={idx} className={`p-5 ${idx % 2 === 0 ? 'bg-body-tertiary' : ''}`}>
                    <Row className='pl-4 pr-4'>
                        <Col sm="12" className="p-3">
                            <Row>
                                <Col sm="6">
                                    <h3 className="text-costum">{cat}</h3>
                                </Col>
                                <Col sm="6" className="text-right">
                                    <Button className="colorButton" onClick={() => navigate(`/carte/${cat}`)}>
                                        Voir les {cat.toLowerCase()}
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm="12" className="d-flex justify-content-center align-items-center flex-wrap">
                            <table className="w-80">
                                <tbody>
                                    {renderRows(cat)}
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </div>
            ))}
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

export default ListArticleClient;
