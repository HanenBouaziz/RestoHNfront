import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import Menu from './Menu';
import font from "../assets/presentation.png";
import logo from "../assets/logo222.png";
import menu from "../assets/menu-menu.svg";
import menu1 from "../assets/menu1.png";
import menu2 from "../assets/menu2.png";
import menu3 from "../assets/menu3.png";
import dessert from "../assets/menu-desserts.svg";
import entree from "../assets/menu-entrees.svg";
import pizza from "../assets/menu-pizzas.svg";
import salade from "../assets/menu-salades.svg";
import Footer from './Footer';
import { listArticle } from '../Services/articleservice';
import { listCategorie } from '../Services/categorieservice';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showScroll, setShowScroll] = useState(false); // État pour la flèche
    const navigate = useNavigate();
            const token = localStorage.getItem('CC_Token');

    const fetchArticles = async () => {
        try {
            if (token) {
                const res = await listArticle(token)
                setArticles(res.data.slice(0, 10));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCategories = async () => {
        try {
            if (token) {
                const res = await listCategorie(token)
                setCategories(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const renderRows = () => {
        const rows = [];
        for (let i = 0; i < articles.length; i += 5) {
            rows.push(articles.slice(i, i + 5));
        }

        return rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
                {row.map((art, index) => (
                    <td key={index} className="text-center p-3">
                        <div className="d-flex flex-column align-items-center">
                            <img src={art.imagearticle} width={200} height={200} alt={art.nomarticle} />
                            <div className="text-center mt-2">
                                <b>{art.nomarticle}</b>
                                <div className="mt-2">
                                    <span className='bg-warning p-1'>
                                        &ensp;à partir de <b>{parseFloat(art.prix)} DT&ensp;</b>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </td>
                ))}
            </tr>
        ));
    };

    const handleScroll = () => {
        setShowScroll(window.scrollY > 200); // Afficher la flèche si défilement > 200px
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Retour en haut avec animation
    };

    useEffect(() => {
        fetchArticles();
        fetchCategories();
        window.addEventListener('scroll', handleScroll); // Écouter le défilement
        return () => {
            window.removeEventListener('scroll', handleScroll); // Nettoyer l'écouteur
        };
    }, []);
    return (
        <>
            <div className="bg-body-tertiary">
                <Menu />
                <div className="p-5">
                    <Row className='p-2'>
                        <Col sm="6" className='p-5'>
                            <div className='text-center p-4'>
                                <h3>Bienvenue Chez,</h3>
                                <img src={logo} width={180} className='mt-3'/>
                                <p className='p-4'>Découvrez l'art de la cuisine raffinée chez <strong><b>H&N</b> Restaurant</strong>,<br/> un lieu où chaque repas est une expérience unique !</p>
                                <Button className="colorButton" type="submit">
                                    Voir plus
                                </Button>
                            </div>
                        </Col>
                        <Col sm="6">
                            <img src={font} width="70%" />
                        </Col>
                    </Row>
                </div>
            </div>
            <div>
                <div className="p-5 text-center">
                    <Row>
                        <Col sm="12" className="p-3">
                            <h3 className="text-costum">Nos Catégories</h3>
                        </Col>
                        <Col sm="12" className="d-flex justify-content-center align-items-center flex-wrap">
                            <button
                                className="btn-category text-center"
                                onClick={() => navigate(`/carte`)}
                            >
                                <img src={menu} width={110} alt="Menu" /><br />
                                <h6>LA CARTE</h6>
                            </button>
                            <button
                                className="btn-category text-center"
                                onClick={() => navigate(`/carte/Entrées`)}
                            >
                                <img src={entree} width={110} alt="Entrées" /><br />
                                <h6>ENTREES</h6>
                            </button>
                            <button
                                className="btn-category text-center"
                                onClick={() => navigate(`/carte/Pizzas`)}
                            >
                                <img src={pizza} width={110} alt="Pizzas" /><br />
                                <h6>PIZZAS</h6>
                            </button>
                            <button
                                className="btn-category text-center"
                                onClick={() => navigate(`/carte/Salades`)}
                            >
                                <img src={salade} width={110} alt="Salades" /><br />
                                <h6>SALADES</h6>
                            </button>
                            <button
                                className="btn-category text-center"
                                onClick={() => navigate(`/carte/Desserts`)}
                            >
                                <img src={dessert} width={110} alt="Desserts" /><br />
                                <h6>DESSERTS</h6>
                            </button>

                        </Col>
                    </Row><br />
                </div>
            </div>
            <div>
                <div className="p-5 bg-body-tertiary text-center">
                    <Row>
                        <Col sm="12" className="p-3">
                            <h3 className="text-costum">Nos Articles</h3>
                        </Col>
                        <Col sm="12" className="d-flex justify-content-center align-items-center flex-wrap">
                            <table className="w-80">
                                <tbody>
                                    {renderRows()}
                                </tbody>
                            </table>
                        </Col>
                    </Row><br />
                </div>
            </div>
            <div>
                <div className="p-5 text-center">
                    <Row className='pl-4 pr-4'>
                        <Col sm="12" className="p-3">
                            <h3 className="text-costum">Nos Menus</h3>
                        </Col>
                        <Col sm="4">
                                                                        
                                                
                                            <Link to={`/menus/view/1`}>
                                                <img src={menu1} width="100%" alt="Menu" />
                                                </Link>
                                            </Col>
                                            <Col sm="4">
                                            <Link to={`/menus/view/2`}>
                                                <img src={menu3} width="100%" alt="Menu" />
                                                </Link>
                                            </Col>
                                            <Col sm="4">
                                            <Link to={`/menus/view/3`}>
                                                <img src={menu2} width="100%" alt="Menu" />
                                                </Link>
                                            </Col>
                    </Row><br />
                </div>
            </div>
            <Footer/>
            <div>
                {/* Flèche de retour en haut */}
                {showScroll && (
                    <button
                        className="scroll-to-top fleche-btn"
                        onClick={scrollToTop}
                    >
                        <i class="fa-solid fa-arrow-up"></i>
                    </button>
                )}
            </div>
        </>
    )
}

export default Home
