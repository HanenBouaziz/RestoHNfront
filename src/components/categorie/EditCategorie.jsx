import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCategorieById, updateCategorie } from '../../Services/categorieservice';
import Menu from '../Menu';
import { Row, Col, Button, Alert, Form } from 'react-bootstrap';
import { FilePond,registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

// Enregistrement du plugin FilePond
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EditCategorie = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [categorie, setCategorie] = useState({ nomcategorie: "", imagecategorie: "" });
    const [files, setFiles] = useState([]); // État pour gérer les fichiers avec FilePond
    const [error, setError] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // État pour gérer les erreurs
    

    // Charger la catégorie à modifier
    const loadCategorie = async () => {
        const token = localStorage.getItem("CC_Token");
        if (token) {
            try {
                const res = await getCategorieById(id, token);
                setCategorie(res.data);
    
                // Charger l'URL de l'image existante dans FilePond
                if (res.data.imagecategorie) {
                    setFiles([{
                        source: res.data.imagecategorie,
                        options: {
                            type: 'remote',
                        }
                    }]);
                }
            } catch (error) {
                console.error("Erreur lors du chargement de la catégorie :", error);
               // setError("Impossible de charger la catégorie.");
            }
        } else {
            setError("Le token d'authentification est manquant.");
        }
    };
    

    // Fonction pour sauvegarder les modifications
    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("CC_Token");
        if (token) {
            try {
                await updateCategorie(id, categorie, token);
                navigate("/categories");
            } catch (error) {
                console.error("Erreur lors de la mise à jour de la catégorie :", error);
                setError("Une erreur est survenue lors de la mise à jour.");
            }
        } else {
            setError("Le token d'authentification est manquant.");
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
                    setCategorie({ ...categorie, imagecategorie: result.url });
                    
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
    
    

    useEffect(() => {
        loadCategorie();
    }, [id]);

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
                        <h4>Modifier une catégorie</h4>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSave}>
                            <Form.Group className="mb-3" as={Row}>
                                <Col sm="6">
                                    <Form.Label><b>Désignation</b></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Désignation"
                                        value={categorie.nomcategorie}
                                        onChange={(e) => setCategorie({ ...categorie, nomcategorie: e.target.value })}
                                    />
                                </Col>
                                <Col sm="6"></Col>
                                <Col sm="6">
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
                            <Button type="submit" className="colorButton">
                                <i className="fa-solid fa-floppy-disk"></i> Enregistrer
                            </Button>&ensp;
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

export default EditCategorie;
