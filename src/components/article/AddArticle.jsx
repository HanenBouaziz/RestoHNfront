import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Menu from '../Menu';
import { Row, Col, Alert, Form, Button } from 'react-bootstrap';
import { listCategorie } from '../../Services/categorieservice';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { addArticle } from '../../Services/articleservice';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const AddArticle = () => {
  const navigate = useNavigate();

  const [categorie, setCategorie] = useState([]);
  const [article, setArticle] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Charger les catégories depuis l'API
  const loadcategories = async () => {
    try {
      const token = localStorage.getItem('CC_Token');
      if (token) {
        const res = await listCategorie(token);
        setCategorie(res.data);
      }
    } catch (error) {
      setError('Erreur lors de la récupération des catégories');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadcategories();
  }, []);

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
            //console.log(result.url);
            setArticle({ ...article, imagearticle: result.url });
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

  // Sauvegarder l'article
  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('CC_Token');
      try {
        if (!article.imagearticle) {
          setErrorMessage('L\'image de l\'article est obligatoire');
          return;
        }
        addArticle(article, token);
        navigate('/articles');
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'article :', error);
        setErrorMessage('Erreur lors de l\'ajout de l\'article');
      }
    
  };

  return (
    <div>
      <Menu />
      <div className="p-3">
        <Row>
          <Col xs={6} md={2}>
            <h5>Actions</h5>
            <Link to="/articles">
              <button className="btn btn-outline" style={{ width: '100%' }}>
                <span className="textColor">Liste Des Articles</span>
              </button>
            </Link>
          </Col>
          <Col xs={12} md={10}>
            <h4>Ajouter un article</h4>
            {error && <Alert variant="danger">{error}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form onSubmit={handleSave}>
              <Form.Group className="mb-3" as={Row}>
                {/* Nom */}
                <Col sm="4">
                  <Form.Label><b>Nom</b></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nom article"
                    value={article.nomarticle}
                    onChange={(e) => setArticle({ ...article, nomarticle: e.target.value })}
                  />
                </Col>

                {/* Catégorie */}
                <Col sm="4">
                  <Form.Label><b>Catégorie</b></Form.Label>
                  <Form.Control
                    as="select"
                    value={article.categorieID}
                    onChange={(e) => {
                      const selectedCategory = categorie.find(cat => cat.id === parseInt(e.target.value, 10));
                      setArticle({
                        ...article,
                        categorieID: e.target.value,
                        categorie: selectedCategory, // Ajout de l'objet catégorie
                      });
                    }}
                  >
                    <option value="">Choisir une catégorie</option>
                    {categorie.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nomcategorie}
                      </option>
                    ))}
                  </Form.Control>
                </Col>

                <Col sm="4">
                  <Form.Label><b>Prix</b></Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Prix"
                    value={article.prix}
                    onChange={(e) => setArticle({ ...article, prix: e.target.value })}
                  />
                </Col>

                {/* Image */}
                <Col sm="8">
                  <Form.Label><b>Image</b></Form.Label>
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
              <br />
              {/* Boutons */}
              <Button type="submit" className="colorButton">
                <i className="fa-solid fa-floppy-disk"></i> Enregistrer
              </Button>&ensp;
              <Link to="/articles">
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

export default AddArticle;
