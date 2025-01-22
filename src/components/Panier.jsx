import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Menu from './Menu';
import { addCommande, addLigneCommande, listCommande } from '../Services/commandeservice';

const Panier = () => {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userID'); // Remplacez par l'ID utilisateur réel

    // Charger le panier depuis le localStorage
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, []);

    // Mettre à jour le panier dans le localStorage et l'état
    const updateCart = (updatedCart) => {
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    // Incrémenter la quantité d'un article
    const incrementQuantity = (id) => {
        const updatedCart = cart.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateCart(updatedCart);
    };

    // Décrémenter la quantité d'un article
    const decrementQuantity = (id) => {
        const updatedCart = cart
            .map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
                    : item
            )
            .filter((item) => item.quantity > 0);
        updateCart(updatedCart);
    };

    // Supprimer un article du panier
    const removeFromCart = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        updateCart(updatedCart);
    };

    // Calculer le total
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.quantity * parseFloat(item.prix), 0).toFixed(3);
    };



    // Fonction pour passer la commande
    const placeOrder = async () => {
        if (cart.length === 0) {
            alert("Votre panier est vide !");
            return;
        }
    
        const token = localStorage.getItem('CC_Token');
        if (!token) {
            alert('Token de session non trouvé.');
            return;
        }
    
        const prixTotal = calculateTotal();
    
        try {
            // Générer le numéro de commande et attendre la réponse
           // const numCommande = await generateNextOrderNumber(token); // Utiliser await
            const res = await listCommande(token); 
                const maxId = Math.max(...res.data.map(commande => commande.id), 0);
                console.log(maxId);     
               const numCommande=(maxId + 1).toString().padStart(10, '0'); 
            // Construire la commande
            const commande = {
                num: numCommande,
                prixTotal: parseFloat(prixTotal),
                etat: "En attente",
                userID: userId,
            };
    
            // Insérer la commande et récupérer son ID
            const commandeResponse = await addCommande(commande, token);
            const newCommandeID = commandeResponse.data.id;
    
            // Insérer les lignes de commande
            const lignesCommandes = cart.map((item) => {
                const ligne = {
                    commandeID: newCommandeID,
                    articleID: item.id,
                    quantite: item.quantity,
                    montant: (item.quantity * parseFloat(item.prix)).toFixed(3),
                };
                return addLigneCommande(ligne, token);
            });
    
            await Promise.all(lignesCommandes);
    
            // Vider le panier et rediriger
            updateCart([]);
            navigate('/commandes');
        } catch (error) {
            console.error("Erreur lors de la commande :", error);
            alert("Une erreur s'est produite lors de la commande. Veuillez réessayer.");
        }
    };
    

    return (
        <div>
            <Menu />
            <div className="container mt-5">
                <h2 className="mb-4">Mon Panier</h2>
                {cart.length > 0 ? (
                    <>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Article</th>
                                    <th>Prix Unitaire</th>
                                    <th>Quantité</th>
                                    <th>Total</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <img src={item.imagearticle} alt={item.nomarticle} width={50} height={50} />
                                        </td>
                                        <td>{item.nomarticle}</td>
                                        <td>{parseFloat(item.prix).toFixed(3)} DT</td>
                                        <td>
                                            <Button
                                                variant="light"
                                                onClick={() => decrementQuantity(item.id)}
                                            >
                                                -
                                            </Button>
                                            <span className="mx-2">{item.quantity}</span>
                                            <Button
                                                variant="light"
                                                onClick={() => incrementQuantity(item.id)}
                                            >
                                                +
                                            </Button>
                                        </td>
                                        <td>{(item.quantity * parseFloat(item.prix)).toFixed(3)} DT</td>
                                        <td>
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="4" className="text-right"><strong>Total :</strong></td>
                                    <td colSpan="2"><strong>{calculateTotal()} DT</strong></td>
                                </tr>
                            </tfoot>
                        </Table>
                        <div className="text-right mt-4">
                            <Button className="btn colorButton text-white" onClick={placeOrder}>
                                Passer la commande
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <h5>Votre panier est vide...</h5>
                        <Button onClick={() => navigate('/carte')} className="btn colorButton text-white">
                            Retour aux articles
                        </Button>
                    </div>
                )}
                <br />
            </div>
            <Footer />
        </div>
    );
};

export default Panier;
