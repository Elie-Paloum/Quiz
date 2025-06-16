<?php 

  function action_register() {
    header('Content-Type: application/json');
    // Récupérer les données du formulaire en format json
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // enregistrer les données dans la base
    $json = register($data);
    
    // envoyer le résultat
    echo $json;
  }

  function action_login() {
    header('Content-Type: application/json');
    // Récupérer les données du formulaire en format json
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // vérification des données de la connexion
    $json = login($data);
    
    // envoyer le résultat
    echo $json;
  }

  function action_logout() {
    logout();
    header("Location: http://localhost:5173");
    exit();
  }


  // retourne les informations de tous les auteurs
  function action_authors() {
    header('Content-Type: application/json');

    $json = get_authors();
    
    // envoyer le résultat de la requête
    echo $json;
  }

  // Administration

  /**
   * envoie les auteurs au client (admin)
   */
  function action_admin_authors() {
    header('Content-Type: application/json');
    $json = get_authors();
    // envoyer le résultat de la requête
    echo $json;
  }

  /**
   * ajout d'un utilisateur par un administrateur
   */
  function action_admin_authors_new() {
    header('Content-Type: application/json');
    // Récupérer les données du formulaire en format json
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // enregistrer les données dans la base
    $json = authors_new($data);
    
    // envoyer le résultat
    echo $json;
  }

  /**
   * Supression d'un utilisateur par un administrateur
   */
  function action_admin_authors_delete() {
    header('Content-Type: application/json');
    
    // supprimer dans la base
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;

    $json = authors_delete($id);
    
    // envoyer le résultat
    echo $json;
  }

  // USERS

  /**
   * envoie les utilisateurs au client (admin)
   */
  function action_admin_users() {
    header('Content-Type: application/json');
    $json = get_users();
    // envoyer le résultat de la requête
    echo $json;
  }

  /**
   * supprime un utilisateur (admin)
   */
  function action_admin_users_delete() {
    header('Content-Type: application/json');
    
    // supprimer dans la base
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;

    $json = users_delete($id);
    
    // envoyer le résultat
    echo $json;
  }

?>