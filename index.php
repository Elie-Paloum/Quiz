<?php
  require_once 'modele.php';
  require_once 'controller.php';

  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");
  
  $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  $project_position = strpos($uri, 'index.php');
  $uri = substr($uri, $project_position);
  if ($uri == 'index.php' || $uri == "/") {
    // rediriger vers la page d'accueil
    header("Location: http://localhost:5173");
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
  // suppression d'un auteur par un admin (GET)
  } else if($uri == "index.php/admin/authors/delete") {
    action_admin_authors_delete();
  // retourne tous les utlisateurs à l'admin
  } else if($uri == "index.php/admin/users") {
    action_admin_users();
  // suppression d'un utilisateur par un admin (GET)
  } else if($uri == "index.php/admin/users/delete") {
    action_admin_users_delete();
  }
?>