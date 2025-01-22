import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Menu from '../Menu';
import { FilePond,registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { addCategorie } from '../../Services/categorieservice';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const AddCategorie = () => {
    const navigate = useNavigate();
    const [categorie, setCategorie] = useState({});
    const [files, setFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState(""); // État pour gérer les erreurs
    const token = localStorage.getItem("CC_Token");
  
    // Fonction pour enregistrer la catégorie
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        addCategorie(categorie,token);
        navigate('/categories');
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la catégorie:', error);
        setErrorMessage("Erreur lors de l'ajout de la catégorie, veuillez réessayer.");
      }
    };
  
    const serverOptions = {
      process: (fieldName, file, metadata, load, error, progress, abort) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'ProjetRL');  // Assurez-vous que le preset existe dans Cloudinary
        data.append('cloud_name', 'dxc5curxy');
    
          // Utilisation de fetch pour l'upload
          fetch('https://api.cloudinary.com/v1_1/dxc5curxy/image/upload', {
            method: 'POST',
            body: data,
          })
          .then(async (res) => {
            if (!res.ok) {
              throw new Error("Échec de l'upload");
            }
            const result = await res.json();
            if (result && result.url) {
              setCategorie({ ...categorie, imagecategorie: result.url });
              load(result.url); // Informer FilePond que l'upload est terminé
            } else {
              throw new Error('Réponse Cloudinary invalide');
            }
          })
          .catch((err) => {
            console.error("Erreur lors du téléchargement de l'image:", err);
            setErrorMessage("Erreur lors du téléchargement de l'image, veuillez réessayer.");
            error("Échec du téléchargement");
            abort();
          });
      },
    };
    

  return (
    <div>
      <Menu />
      <div className="p-3">
        <Row>
          <Col xs={6} md={2}>
            <h5>Actions</h5>
            <Link to="/categories">
              <button className="btn btn-outline" style={{ width: '100%' }}>
                <span className="textColor">Liste Des Catégories</span>
              </button>
            </Link>
          </Col>
          <Col xs={12} md={10}>
            <h4>Ajouter une catégorie</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" as={Row}>
                <Col sm="6">
                  <Form.Label>
                    <b>Désignation</b>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Désignation"
                    value={categorie.nomcategorie}
                    onChange={(e) => setCategorie({ ...categorie, nomcategorie: e.target.value })}
                    required
                  />
                </Col>
                <Col sm="6"></Col>
                <Col sm="6">
                  <Form.Label>
                    <b>Image</b>
                  </Form.Label>
                  <div>
                    <FilePond
                      files={files}
                      onupdatefiles={setFiles}
                      allowMultiple={false}
                      server={serverOptions}
                      name="file"
                      labelIdle='Glissez et déposez vos fichiers ou <span class="filepond--label-action">Parcourir</span>'
                    />
                  </div>
                </Col>
              </Form.Group>
              <Button type="submit" className="colorButton">
                <i className="fa-solid fa-floppy-disk"></i> Enregistrer
              </Button>
              &ensp;
              <Link to="/categories">
                <Button type="button" className="colorButtonCancel">
                  <i className="fa-solid fa-arrow-right-from-bracket"></i> Annuler
                </Button>
              </Link>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AddCategorie;
