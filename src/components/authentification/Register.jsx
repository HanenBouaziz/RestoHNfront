import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import logo from '../../assets/logoooo.png';
import { Link, useNavigate } from "react-router-dom";
import font from "../../assets/font0.png";
import { signup } from "../../Services/authservice";


const Register = () => {
  const appStyle = {
    backgroundImage: `url(${font})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
  };
  const navigate = useNavigate();

  const [name, setName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== password2) {
      alert('Passwords do not match')

    } else {
      const userData = {
        name: name,
        email: email,
        password: password,
        password_confirmation: password2,
        role: 'user',
        avatar: avatar
      }
      signup(userData).then((res) => {
        console.log(res)
        if (res) navigate('/')
        else alert("Register with errors");
      })
        .catch((err) => { alert("Register with errors"); console.log(err) })
    }
  };

  return (
    <div className="card-container" style={appStyle}>
      <Card className="cardRegister p-2">
        <Card.Body className="center">
          <img src={logo} alt="Logo" className="logoRegister" />
          <h2>Inscription</h2>
        </Card.Body>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            
      <Row className="mb-3">
      <Form.Group  as={Col}>
              <Form.Label><b>Nom d'utilisateur</b> </Form.Label>
              <Form.Control
                type="text"
                name="userName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom d'utilisateur"
                required />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label><b>Avatar</b></Form.Label>
              <Form.Control
                type="text"
                name="avatar"
                placeholder="Avatar"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)} />
            </Form.Group>
      </Row>
          
            <Form.Group className="mb-3">
              <Form.Label><b>Email</b> </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required />
            </Form.Group>
          
      <Row className="mb-3">
      <Form.Group as={Col}>
              <Form.Label><b>Mot de passe</b></Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label><b>Confirmer mot de passe</b></Form.Label>
              <Form.Control
                type="password"
                name="password2"
                placeholder="Confirmer mot de passe"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required />
            </Form.Group>
      </Row>
            
           
            <div className="center pt-1">
              <Button className="colorButton" type="submit">
                S'inscrire
              </Button>
            </div>
          </Form>
          <div className="center pt-1">Vous avez déja une compte ? <Link to="/" className="textColor">Connexion</Link></div>
        </Card.Body>
      </Card>

    </div>
  );
};

export default Register;
