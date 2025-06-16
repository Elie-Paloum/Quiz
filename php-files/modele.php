<?php
header("Access-Control-Allow-Origin: *");

// Allow expected headers
header("Access-Control-Allow-Headers: Content-Type");

// Allow methods React might use
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
/**
   *une fonction pour se connecter à la base de donnée
   */
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




$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!$data) {
  echo json_encode(["error" => "Invalid JSON"]);
  exit;
}

// Extract fields
$firstName = htmlspecialchars($data['firstName']);
$lastName = htmlspecialchars($data['lastName']);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$dob = date('Y-m-d', strtotime($data['dob'])); // Format for MySQL
$gender = $data['gender'];
$address = htmlspecialchars($data['address']);
$termsAccepted = $data['acceptTerms'];

// Structured address
$structured = $data['structuredAddress'];
$street_number = htmlspecialchars($structured['street_number']);
$street_name = htmlspecialchars($structured['street_name']);
$postal_code = htmlspecialchars($structured['postal_code']);
$city = htmlspecialchars($structured['city']);
$state = htmlspecialchars($structured['state']);
$country = htmlspecialchars($structured['country']);
$pdo = login_database();

file_put_contents('debug.log', json_encode($data), FILE_APPEND);

$stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = :email");
$stmt->execute(['email' => $email]);
$count = $stmt->fetchColumn();

if ($count > 0) {
 
  echo json_encode(["return" => -1 ,"message" => "Email already exists"]);
  exit();
}

try {
 
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $stmt = $pdo->prepare("INSERT INTO users 
    (first_name, last_name, email, password, dob, gender, full_address, street_number, street_name, postal_code, city, state, country, accept_terms) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

  $stmt->execute([
    $firstName, $lastName, $email, $password, $dob, $gender, $address,
    $street_number, $street_name, $postal_code, $city, $state, $country, $termsAccepted ? 1 : 0
  ]);

  echo json_encode(["return" => 0, "message" => "User registered successfully."]);
} catch (PDOException $e) {
  echo json_encode(["return" => -1,"message" => "Database error."]);
}


?>