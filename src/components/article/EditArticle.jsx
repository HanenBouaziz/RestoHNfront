import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Menu from '../Menu';
import { Row, Col, Alert, Form, Button } from 'react-bootstrap';
import { listCategorie } from '../../Services/categorieservice';
import { getArticleById, updateArticle } from '../../Services/articleservice';
import { FilePond,registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

// Enregistrement du plugin FilePond
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EditArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
    const [files, setFiles] = useState([]); // État pour gérer les fichiers avec FilePond
  const [article, setArticle] = useState({});
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
      const [errorMessage, setErrorMessage] = useState(""); // État pour gérer les erreurs
  
  const token = localStorage.getItem('CC_Token');

  // Charger les catégories
  const loadCategories = async () => {
    try {
      
      if (!token) throw new Error("Le token d'authentification est manquant.");
      const res = await listCategorie(token)
      setCategories(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des catégories :", err);
      setError("Erreur lors de la récupération des catégories.");
    }
  };

  // Charger l'article
  const loadArticle = async () => {
    try {
      if (!token) throw new Error("Le token d'authentification est manquant.");
      const res = await getArticleById(id,token)
      //console.log(res.data)
      setArticle(res.data);
      // Charger l'URL de l'image existante dans FilePond
      if (res.data.imagearticle) {
        setFiles([{
            source: res.data.imagearticle,
            options: {
                type: 'remote',
            }
        }]);
    }
    } catch (err) {
      console.error("Erreur lors du chargement de l'article :", err);
      setError("Impossible de charger l'article.");
    }
  };

  // Charger les données initiales
  useEffect(() => {
    loadCategories();
    loadArticle();
  }, [id]);

  // Gérer la sauvegarde de l'article
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (!token) throw new Error("Le token d'authentification est requis.");

      // Envoie les données mises à jour
      await updateArticle(id,article,token)

      // Redirige vers la liste des articles après la mise à jour
      navigate('/articles');
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'article :", err);
      setError("Échec de la mise à jour de l'article.");
    }
  };

  const isValidImage = (file) => {
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return acceptedTypes.includes(file.type);
};

const serverOptions = {
    process: (fieldName, file, metadata, load, error, progress, abort) => {
        if (!isValidImage(file)) {
            setErrorMessage("Veuillez télécharger une image valide.");
            error("Type de fichier non valide");
            abort();
            return;
        }

        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'ProjetRL');
        data.append('cloud_name', 'dxc5curxy');
    
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
               // console.log(result.url)
                setArticle({ ...article, imagearticle: result.url });
                
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
            <Link to="/articles">
              <button className="btn btn-outline" style={{ width: '100%' }}>
                <span className="textColor">Liste des Articles</span>
              </button>
            </Link>
          </Col>
          <Col xs={12} md={10}>
            <h4>Modifier un article</h4>
            {error ? (
              <Alert variant="danger">{error}</Alert>
            ) : (
              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3" as={Row}>
                  <Col sm="4">
                    <Form.Label><b>Nom</b></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nom article"
                      value={article.nomarticle}
                      onChange={(e) => setArticle({ ...article, nomarticle: e.target.value })}
                    />
                  </Col>
                  <Col sm="4">
                    <Form.Label><b>Catégorie</b></Form.Label>
                    <Form.Control
                      as="select"
                      value={article.categorieID}
                      onChange={(e) => setArticle({ ...article, categorieID: e.target.value })}
                    >
                      <option value="">-- Sélectionner une catégorie --</option>
                      {categories.map((cat) => (
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
                  <Col sm="8">
                    <Form.Label><b>Image</b></Form.Label>
                   <FilePond
                       files={files}
                       onupdatefiles={setFiles}
                       allowMultiple={false}
                       server={serverOptions}
                       labelIdle="Glissez et déposez votre image ou <span class='filepond--label-action'>Parcourir</span>"
                       //instantUpload={false} // Empêche le téléchargement automatique
                   />
                  </Col>
                </Form.Group>
                <br/>
                <Button type="submit" className="colorButton">
                  <i className="fa-solid fa-floppy-disk"></i> Enregistrer
                </Button>&ensp;
                <Link to="/articles">
                  <Button type="button" className="colorButtonCancel">
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Annuler
                  </Button>
                </Link>
              </Form>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default EditArticle;
