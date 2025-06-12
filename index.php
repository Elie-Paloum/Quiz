<?php
  session_start();
  require_once 'modele.php';
  require_once 'controller.php';
  
  $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  $project_position = strpos($uri, 'index.php');
  $uri = substr($uri, $project_position);
  if ($uri == 'index.php' || $uri == "/") {
    // rediriger vers la page d'accueil
    header("Location: http://localhost:5173");
    exit();
  // traitement de formulaire
  } else if ($uri == 'index.php/register') {
    action_register();
  //  traitement de la connexion
  } else if ($uri == 'index.php/login') {
    action_login();
  // traitement de la déconnexion
  } else if ($uri == 'index.php/logout') {
    action_logout();
  }
?>