<?php
session_start();

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173"); // ou ton URL exacte
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function login_database() {
    require 'config.php';
    try {
        $conn = new PDO($dsn, $username, $mdp);
        return $conn;
    } catch (PDOException $e) {
        echo json_encode([
            "return" => -1,
            "message" => "Erreur base de données : " . $e->getMessage()
        ]);
        exit();
    }
}

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$email || !$password) {
    echo json_encode([
        "return" => -1,
        "message" => "Email et mot de passe requis"
    ]);
    exit();
}

$conn = login_database();

try {
    $sql = "SELECT id, password FROM users WHERE email = :email LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            "return" => -1,
            "message" => "Email ou mot de passe incorrect"
        ]);
        exit();
    }

    if (password_verify($password, $user['password'])) {
      
        $_SESSION["user"] = $user;

        echo json_encode([
            "return" => 0,
            "message" => "Connexion réussie",
            "user_id" => $user['id']
        ]);
    } else {
        echo json_encode([
            "return" => -1,
            "message" => "Email ou mot de passe incorrect"
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "return" => -1,
        "message" => "Erreur serveur, veuillez réessayer plus tard"
    ]);
}
