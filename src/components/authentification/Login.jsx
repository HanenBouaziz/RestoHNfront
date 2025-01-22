import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import logo from '../../assets/logoooo.png';
import { Link, useNavigate } from "react-router-dom";
import font from "../../assets/font0.png";
import axios from "axios";
import { signin } from "../../Services/authservice";
const Login = () => {
  const appStyle = {
    backgroundImage: `url(${font})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
  };
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const objetuser = {
      email: email,
      password: password
    };
    signin(objetuser).then((result) => {
      if (result.data.success) {
        if (result.data.user.isActive) {
          localStorage.setItem("CC_Token", result.data.token)
          localStorage.setItem("user", result.data.user)
          localStorage.setItem("role", result.data.user.role)
          localStorage.setItem("userID", result.data.user.id)
          localStorage.setItem("username", result.data.user.name)
          if (result.data.user.role === "admin") navigate('/menus')
          else navigate('/home')
        }
        else alert("Compte n'est pas encore activé")
      }
      else alert("Error")
    })
      .catch((error) => { alert("Error"); console.log(error) })
  };
  return (
    <div className="card-container" style={appStyle}>
      <Card className="cardLogin p-2">
        <Card.Body className="center">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Connexion</h2>
        </Card.Body>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label><b>Email</b> </Form.Label>
              <Form.Control type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label><b>Mot de passe</b></Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                placeholder="Mot de passe"
                onChange={(e) => setPassword(e.target.value)}
                required />
            </Form.Group>
            <div className="center pt-1">
              <Button className="colorButton" type="submit">
                Se connecter
              </Button>
            </div>
          </Form>
          <div className="center pt-1">Vous n'avez pas encore de compte ? <Link to="/register" className="textColor">Inscription</Link></div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
