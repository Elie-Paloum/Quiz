<?php
// Get the origin from the request
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// List of allowed origins
$allowed_origins = [
    'http://localhost:5173',
    'http://172.20.10.3:5173',
    'https://logicalquiz.free.nf'
];

// Set default content type for API responses
header('Content-Type: application/json');

// Check if the origin is allowed and set CORS headers
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Determine if we're in production
$is_production;
 $is_production = strpos($origin, 'logicalquiz.free.nf') !== false;

// Function to set proper cookie parameters
function set_secure_cookie() {
    global $is_production;
    $params = [
        'expires' => time() + 86400, // 24 hours
        'path' => '/',
        'domain' => $is_production ? 'logicalquiz.free.nf' : '',
        'secure' => $is_production,
        'httponly' => true,
        'samesite' => $is_production ? 'None' : 'Lax'
    ];
    
    setcookie(
        session_name(),
        session_id(),
        $params
    );
} 