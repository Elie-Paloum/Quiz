<?php 

  function action_register() {
    /**
     * Récupérer les données du formulaire en format json
     */
    header('Content-Type: application/json');

    // Lire le JSON brut
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // enregistrer les données dans la base
    $json = register($data);

    // envoyer le résultat
    echo $json;
  }

  function action_login() {
    /**
     * Récupérer les données du formulaire en format json
     */
    header('Content-Type: application/json');

    // Lire le JSON brut
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

?>