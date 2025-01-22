import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/authentification/Register";
import Login from "./components/authentification/Login";
import ListCategorie from "./components/categorie/ListCategorie";
import AddCategorie from "./components/categorie/AddCategorie";
import EditCategorie from "./components/categorie/EditCategorie";
import ListArticle from "./components/article/ListArticle";
import AddArticle from "./components/article/AddArticle";
import EditArticle from "./components/article/EditArticle";
import ViewArticle from "./components/article/ViewArticle";
import ListMenu from "./components/menu/ListMenu";
import AddMenu from "./components/menu/AddMenu";
import EditMenu from "./components/menu/EditMenu";
import ViewMenu from "./components/menu/ViewMenu";
import ListClient from "./components/client/ListClient";
import Home from "./components/Home";
import ListArticleClient from "./components/article/ListArticleClient";
import ListArticleCategorie from "./components/article/ListArticleCategorie";
import Panier from "./components/Panier";
import ListCommandeClient from "./components/commande/ListCommandeClient";
import ListMenuClient from "./components/menu/ListMenuClient";
import ListCommande from "./components/commande/ListCommande";
import ProtectedRoute from "./ProtectedRoute";
import Logout from "./components/authentification/Logout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />

        {/* Routes protégées */}
        <Route element={<ProtectedRoute />}>
          <Route path="/categories" element={<ListCategorie />} />
          <Route path="/categories/add" element={<AddCategorie />} />
          <Route path="/categories/edit/:id" element={<EditCategorie />} />
          <Route path="/articles" element={<ListArticle />} />
          <Route path="/articles/add" element={<AddArticle />} />
          <Route path="/articles/edit/:id" element={<EditArticle />} />
          <Route path="/articles/view/:id" element={<ViewArticle />} />
          <Route path="/menus" element={<ListMenu />} />
          <Route path="/menus/add" element={<AddMenu />} />
          <Route path="/menus/edit/:id" element={<EditMenu />} />
          <Route path="/menus/view/:id" element={<ViewMenu />} />
          <Route path="/clients" element={<ListClient />} />
          <Route path="/home" element={<Home />} />
          <Route path="/carte" element={<ListArticleClient />} />
          <Route path="/carte/:categorie" element={<ListArticleCategorie />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/commandes" element={<ListCommandeClient />} />
          <Route path="/commandes-client" element={<ListCommande />} />
          <Route path="/listmenus" element={<ListMenuClient />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
