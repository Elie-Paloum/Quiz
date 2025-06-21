<?php
require_once 'cors-config.php';

// Set session name
session_name('QUIZ_SESSID');

// Set session cookie parameters before starting the session
session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'domain' => $is_production ? 'logicalquiz.free.nf' : '',
    'secure' => $is_production,
    'httponly' => true,
    'samesite' => $is_production ? 'None' : 'Lax'
]);

// Set additional session configuration
ini_set('session.use_only_cookies', 1);
ini_set('session.gc_maxlifetime', 86400); // 24 hours

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
} 