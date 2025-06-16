<?php
session_start();

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");

echo json_encode([
    "authenticated" => isset($_SESSION["user"]),
    "user" => $_SESSION["user"] ?? null
]);