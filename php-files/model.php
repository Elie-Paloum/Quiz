<?php
// LOGIN, REGISTER AND LOGOUT

/**
   *une fonction pour se connecter à la base de donnée
 */
  function login_database(){
    require 'config.php';
    try {
      $connexion = new PDO($dsn, $username, $mdp);
      return $connexion;
    }
    catch(PDOException $e) {
      exit('Erreur : '.$e->getMessage());
      return null;
    }
  }

  function register($data) {
    if (!$data) {
    echo json_encode(["return" => -1, "message" => "Input Error"]);
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
}

function login($data) {
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['message' => 'Email and password are required.']);
        exit;
    }
    
    $conn = login_database();
    
    // Prepare and execute the query to find the user
    $stmt = $conn->prepare('SELECT id, email, password, first_name,role FROM users WHERE email = :email');
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($password, $user['password'])) {
        // On successful login, regenerate the session ID for security
        session_regenerate_id(true);
    
        // Store essential, non-sensitive user info in the session
        $_SESSION['user'] = [
            'id' => $user['id'],
            'email' => $user['email'],
            'first_name' => $user['first_name'],
            'role' => $user['role']
        ];
    
        // Send a success response that includes the user data
        return json_encode([
            'return' => 0, // Use return code for consistency
            'success' => true,
            'message' => 'Login successful.',
            'user' => $_SESSION['user'] // Pass user data back to the frontend
        ]);
    
    } else {
        // If credentials are bad, send a 401 Unauthorized response
        http_response_code(401);
        echo json_encode(['message' => 'Invalid email or password.']);
    }
}

// USERS

/**
 * retournes les utilisateurs
 */
function get_users() {
  $conn = login_database();
  $stmt = $conn->prepare("SELECT * FROM users");
  $stmt->execute();

  $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

  array_walk_recursive($users, function(&$value) {
      $value = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
  });

  return json_encode([
      "return" => 0,
      "users" => $users
  ]);
}

/**
 * Suppression d'un utilisateur
 */
function users_delete($id) {
  if($id == null) {
    http_response_code(404);
    return json_encode(["return" => -1, "message" => "Bad request"]);
  }

  $pdo = login_database();

  try {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE id = ?");
    $stmt->execute([$id]);
    $count = $stmt->fetchColumn();

    if ($count == 0) {
        http_response_code(404);
        return json_encode(["return" => -1, "message" => "Bad request"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(["return" => 0, "message" => "User deleted successfully."]);

  } catch (PDOException $e) {
      echo json_encode(["return" => -1, "message" => "Database error."]);
  }
}

function users_make_admin($id) {
  if ($id == null) {
    http_response_code(404);
    return json_encode(["return" => -1, "message" => "Bad request"]);
  }

  $pdo = login_database();

  try {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("UPDATE users SET role = 'admin' WHERE id = ?");
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
      return json_encode(["return" => -1, "message" => "User not found or already admin."]);
    }

    return json_encode(["return" => 0, "message" => "User promoted to admin."]);
  } catch (PDOException $e) {
    return json_encode(["return" => -1, "message" => "Database error."]);
  }
}

function users_toggle_role($id) {
  if ($id == null) {
    http_response_code(404);
    return json_encode(["return" => -1, "message" => "Bad request"]);
  }

  $pdo = login_database();

  try {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // First, get the current role
    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
      return json_encode(["return" => -1, "message" => "User not found."]);
    }

    // Toggle the role
    $newRole = $user['role'] === 'admin' ? 'user' : 'admin';
    $action = $newRole === 'admin' ? 'promoted to admin' : 'demoted to user';

    $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
    $stmt->execute([$newRole, $id]);

    return json_encode([
      "return" => 0, 
      "message" => "User $action successfully.",
      "newRole" => $newRole
    ]);
  } catch (PDOException $e) {
    return json_encode(["return" => -1, "message" => "Database error."]);
  }
}


// AUTHORS

/**
 * retourne tous les auteurs et leurs informations
 */

function get_authors() {
  $pdo = login_database();
  $stmt = $pdo->query("SELECT * FROM historians");
  $historians = [];

  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      // Fetch related achievements for each historian
      $achStmt = $pdo->prepare("SELECT text FROM achievements WHERE historian_id = ?");
      $achStmt->execute([$row['id']]);
      $achievements = $achStmt->fetchAll(PDO::FETCH_COLUMN);

      $historians[] = [
          "id" => (int) $row['id'],
          "name" => $row['name'],
          "image" => $row['image'],
          "role" => $row['role'],
          "description" => $row['description'],
          "birthDeath" => $row['birth_death'],
          "achievements" => $achievements,
      ];
  }

  return json_encode($historians);
}

/**
 * ajout d'un auteur par un administrateur
 */
function authors_new($data) {
    if (!$data) {
        echo json_encode(["return" => -1, "message" => "Input Error"]);
        exit;
    }

    $firstName = htmlspecialchars($data['firstName']);
    $lastName = htmlspecialchars($data['lastName']);
    $birthYear = intval($data['birthYear']);
    $deathYear = isset($data['deathYear']) ? intval($data['deathYear']) : null;
    $activities = htmlspecialchars($data['activities']);
    $notableWorks = htmlspecialchars($data['notableWorks']);

    $photo = null;
    if (!empty($data['photo'])) {
        $photo = base64_decode($data['photo']);
        if ($photo === false) {
            echo json_encode(["return" => -1, "message" => "Invalid photo data."]);
            exit;
        }
    }
    $conn = login_database();

    try {
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $stmt = $conn->prepare("INSERT INTO authors 
        (last_name, first_name, birth_year, death_year, activities, notable_works, photo) 
        VALUES (?, ?, ?, ?, ?, ?, ?)");

        $stmt->execute([
            $lastName, $firstName, $birthYear, $deathYear, $activities, $notableWorks, $photo
        ]);

        echo json_encode(["return" => 0, "message" => "Author inserted successfully."]);
    } catch (PDOException $e) {
        echo json_encode(["return" => -1, "message" => "Database error."]);
    }
}

/**
 * suppression d'un auteur par un administrateur
 */
function authors_delete($id) {
  if($id == null) {
    return json_encode(["return" => 404, "message" => "Bad request"]);
  }

  $pdo = login_database();

  try {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM authors WHERE id = ?");
    $stmt->execute([$id]);
    $count = $stmt->fetchColumn();

    if ($count == 0) {
        echo json_encode(["return" => -1, "message" => "Author not found."]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM authors WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(["return" => 0, "message" => "Author deleted successfully."]);
  } catch (PDOException $e) {
      echo json_encode(["return" => -1, "message" => "Database error."]);
  }
}

/**
 * retourne en json les question et leur réponses correspondante
 */
function get_questions() {
    $conn = login_database();

    $stmt = $conn->prepare("SELECT * FROM questions");
    $stmt->execute();

    $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($questions as &$q) {
        foreach ($q as $key => $value) {
            if (!is_null($value)) {
                $q[$key] = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
            }
        }
    }

    return json_encode([
        "return" => 0,
        "questions" => $questions
    ]);
}

/**
 * returne nb_questions aléatoirement dans la base de données
 */
function get_n_questions($nb_questions) {
    $conn = login_database();

    // On force l'entier positif pour éviter les injections ou erreurs
    $nb_questions = intval($nb_questions);
    if ($nb_questions <= 0) {
        return json_encode([
            "return" => -1,
            "message" => "Nombre de questions invalide."
        ]);
    }

    $stmt = $conn->prepare("SELECT * FROM questions ORDER BY RAND() LIMIT ?");
    $stmt->bindValue(1, $nb_questions, PDO::PARAM_INT);
    $stmt->execute();

    $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($questions as &$q) {
        foreach ($q as $key => $value) {
            if (!is_null($value)) {
                $q[$key] = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
            }
        }
    }

    return json_encode([
        "return" => 0,
        "questions" => $questions
    ]);
}



/**
 * ajoute data dans la base de données (table questions)
 */
function questions_new($data) {
    if (!$data || !isset($data['question']) || !isset($data['true'])) {
        echo json_encode(["return" => -1, "message" => "Input Error"]);
        exit;
    }

    $question = htmlspecialchars($data['question']);
    $true = filter_var($data['true'], FILTER_VALIDATE_BOOLEAN);

    $conn = login_database();

    try {
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $conn->prepare("INSERT INTO questions (question, `true`) VALUES (?, ?)");
        $stmt->execute([$question, $true ? 1: 0]);

        echo json_encode(["return" => 0, "message" => "Question added successfully."]);
    } catch (PDOException $e) {
        echo json_encode(["return" => -1, "message" => "Database error."]);
    }
}


/**
 * Supprime la question d'identifiant $id dans la base de donné(table questions)
 */
function questions_delete($id) {
    if ($id == null) {
        return json_encode(["return" => 404, "message" => "Bad request"]);
    }

    $pdo = login_database();

    try {
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $pdo->prepare("SELECT COUNT(*) FROM questions WHERE id = ?");
        $stmt->execute([$id]);
        $count = $stmt->fetchColumn();

        if ($count == 0) {
            echo json_encode(["return" => -1, "message" => "Question not found."]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM questions WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(["return" => 0, "message" => "Question deleted successfully."]);
    } catch (PDOException $e) {
        echo json_encode(["return" => -1, "message" => "Database error."]);
    }
}



function check_session() {
    $isAuthenticated = isset($_SESSION['user']);
    $user = $isAuthenticated ? $_SESSION['user'] : null;
    
    // Return the current authentication status
    header('Content-Type: application/json');
    echo json_encode([
        'authenticated' => $isAuthenticated,
        'user' => $user
    ]);



}


function check_email() {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $email = $data['email'] ?? '';

    if (empty($email)) {
        echo json_encode(['exists' => false, 'message' => 'Email not provided.']);
        exit;
    }
    $pdo = login_database();
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $exists = $stmt->fetchColumn() > 0;
    echo json_encode(['exists' => $exists]);
}

/**
 * Delete the current user's account
 */
function delete_account() {
    // Check if user is logged in
    if (!isset($_SESSION['user']) || !isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['return' => -1, 'message' => 'User not authenticated']);
        exit;
    }

    $userId = $_SESSION['user']['id'];
    $pdo = login_database();

    try {
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // First, verify the user exists
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $count = $stmt->fetchColumn();

        if ($count == 0) {
            echo json_encode(['return' => -1, 'message' => 'User not found']);
            exit;
        }

        // Delete the user's account
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$userId]);

        // Clear the session
        $_SESSION = array();
        
        // Destroy the session
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_destroy();
        }

        // Delete the session cookie
        if (isset($_COOKIE[session_name()])) {
            setcookie(session_name(), '', time() - 3600, '/');
        }

        echo json_encode(['return' => 0, 'message' => 'Account deleted successfully']);

    } catch (PDOException $e) {
        echo json_encode(['return' => -1, 'message' => 'Database error occurred']);
    }
}

/**
 * Change the current user's password
 */
function change_password($data) {
    // Check if user is logged in
    if (!isset($_SESSION['user']) || !isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['return' => -1, 'message' => 'User not authenticated']);
        exit;
    }

    // Validate input data
    $currentPassword = $data['currentPassword'] ?? '';
    $newPassword = $data['newPassword'] ?? '';
    $confirmPassword = $data['confirmPassword'] ?? '';

    if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
        echo json_encode(['return' => -1, 'message' => 'All password fields are required']);
        exit;
    }

    // Check if new password and confirm password match
    if ($newPassword !== $confirmPassword) {
        echo json_encode(['return' => -1, 'message' => 'New password and confirm password do not match']);
        exit;
    }

    // Validate new password strength (minimum 6 characters)
    if (strlen($newPassword) < 6) {
        echo json_encode(['return' => -1, 'message' => 'New password must be at least 6 characters long']);
        exit;
    }

    $userId = $_SESSION['user']['id'];
    $pdo = login_database();

    try {
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Get current user's password hash
        $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            echo json_encode(['return' => -1, 'message' => 'User not found']);
            exit;
        }

        // Verify current password
        if (!password_verify($currentPassword, $user['password'])) {
            echo json_encode(['return' => -1, 'message' => 'Current password is incorrect']);
            exit;
        }

        // Hash the new password
        $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);

        // Update the password in the database
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmt->execute([$newPasswordHash, $userId]);

        echo json_encode(['return' => 0, 'message' => 'Password changed successfully']);

    } catch (PDOException $e) {
        echo json_encode(['return' => -1, 'message' => 'Database error occurred']);
    }
}

/**
 * Verify the current user's password
 */
function verify_current_password($data) {
    // Check if user is logged in
    if (!isset($_SESSION['user']) || !isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['return' => -1, 'message' => 'User not authenticated']);
        exit;
    }

    // Validate input data
    $currentPassword = $data['currentPassword'] ?? '';

    if (empty($currentPassword)) {
        echo json_encode(['return' => -1, 'message' => 'Current password is required']);
        exit;
    }

    $userId = $_SESSION['user']['id'];
    $pdo = login_database();

    try {
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Get current user's password hash
        $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            echo json_encode(['return' => -1, 'message' => 'User not found']);
            exit;
        }

        // Verify current password
        $isCorrect = password_verify($currentPassword, $user['password']);
        
        echo json_encode([
            'return' => 0, 
            'isCorrect' => $isCorrect,
            'message' => $isCorrect ? 'Password is correct' : 'Password is incorrect'
        ]);

    } catch (PDOException $e) {
        echo json_encode(['return' => -1, 'message' => 'Database error occurred']);
    }
}

?>
