<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function login_database(){
    require 'config.php';
    try {
      $conn = new PDO($dsn, $username, $mdp);
      return $conn;
    }
    catch(PDOException $e) {
      exit('Erreur : '.$e->getMessage());
      return null;
    }
  }

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$email = $data['email'] ?? '';

try {
    $pdo = login_database();
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $count = $stmt->fetchColumn();

    echo json_encode(["exists" => $count > 0]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error"]);
}
?>
