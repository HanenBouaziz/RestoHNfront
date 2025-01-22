import React, { useEffect,useState } from 'react'
import Menu from '../Menu'
import Footer from '../Footer'
import menu1 from "../../assets/menu1.png";
import menu2 from "../../assets/menu2.png";
import menu3 from "../../assets/menu3.png";
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const ListMenuClient = () => {
    const [showScroll, setShowScroll] = useState(false);


    const handleScroll = () => {
        setShowScroll(window.scrollY > 200);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    useEffect(() => {
    
            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }, []);
    return (
        <div>
            <Menu />
            <div className="p-5 text-center">

                <Row className='pl-4 pr-4'>
                    <Col sm="12" className="p-3">
                        <h2 className=""><b>La carte de H&N</b></h2>
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
    )
}

export default ListMenuClient
