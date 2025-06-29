<?php
  require_once 'config.php';
  require_once 'modele.php';
  require_once 'controller.php';

  // seule la vue peut envoyer des requêtes
  header("Access-Control-Allow-Origin: ".$url_of_view."*");
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");
  
  $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  $project_position = strpos($uri, 'index.php');
  $uri = substr($uri, $project_position);
  if ($uri == 'index.php' || $uri == "/") {
    // rediriger vers la page d'accueil
    header("Location: ".$url_of_view);
    exit();
  // traitement de l'inscription (POST)
  } else if ($uri == 'index.php/register') {
    action_register();
  //  traitement de la connexion (POST)
  } else if ($uri == 'index.php/login') {
    action_login();
  // traitement de la déconnexion
  } else if ($uri == 'index.php/logout') {
    action_logout();
  } else if($uri == "index.php/authors") {
    action_authors();
  } 

  /**
   * pages d'administrations
   */ 
  // retourne tous les utilisateurs à l'admin
  else if($uri == "index.php/admin/authors") {
    action_admin_authors();
  // ajout d'un auteur par un admin (POST)
  } else if($uri == "index.php/admin/authors/new") {
    action_admin_authors_new();
  // suppression d'un auteur par un admin (GET id)
  } else if($uri == "index.php/admin/authors/delete") {
    action_admin_authors_delete();

  // retourne tous les utlisateurs à l'admin
  } else if($uri == "index.php/admin/users") {
    action_admin_users();
  // suppression d'un utilisateur par un admin (GET id)
  } else if($uri == "index.php/admin/users/delete") {
    action_admin_users_delete();
  }
  // retourne toutes les questions (culture général) et leurs réponses(GET)
  // si nb_question est défini dans la requête, nb_questions de questions sont transmis
  else if($uri == "index.php/admin/questions") {
    action_admin_questions();
  // ajout d'une nouvelle question par un admin (POST)
  } else if($uri == "index.php/admin/questions/new") {
    action_admin_questions_new();
  // suppression d'une question par un admins (GET id)
  } else if($uri == "index.php/admin/questions/delete") {
    action_admin_questions_delete();
  }
?>