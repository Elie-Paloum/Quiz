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
}

function login($data) {
    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;

    if (!$email || !$password) {
        echo json_encode([
            "return" => -1,
            "message" => "Email et mot de passe requis"
        ]);
        return;
    }

    $conn = login_database();

    try {
        // Chercher l'utilisateur par email
        $sql = "SELECT id, password FROM users WHERE email = :email LIMIT 1";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            // Pas d'utilisateur trouvé
            return json_encode([
                "return" => -1,
                "message" => "Email ou mot de passe incorrect"
            ]);
        }

        // Vérifier le mot de passe
        if (password_verify($password, $user['password'])) {
            // Mot de passe correct alors on démarre une session
            session_start();
            $_SESSION["user"] = $user;

            return json_encode([
                "return" => 0,
                "message" => "Connexion réussie",
                "user_id" => [$user['id'], $user["first_name"], $user["last_name"], $user["role"]] 
            ]);
        } else {
            // Mauvais mot de passe
            return json_encode([
                "return" => -1,
                "message" => "Email ou mot de passe incorrect"
            ]);
        }
    } catch (PDOException $e) {
        return json_encode([
            "return" => -1,
            "message" => "Erreur serveur, veuillez réessayer plus tard"
        ]);
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
    return json_encode(["return" => 404, "message" => "Bad request"]);
  }

  $pdo = login_database();

  try {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE id = ?");
    $stmt->execute([$id]);
    $count = $stmt->fetchColumn();

    if ($count == 0) {
        echo json_encode(["return" => -1, "message" => "User not found."]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(["return" => 0, "message" => "User deleted successfully."]);

  } catch (PDOException $e) {
      echo json_encode(["return" => -1, "message" => "Database error."]);
  }
}


// AUTHORS

/**
 * retourne tous les auteurs et leurs informations
 */

function get_authors() {
  $conn = login_database();
  $stmt = $conn->prepare("SELECT * FROM authors");
  $stmt->execute();

  $authors = $stmt->fetchAll(PDO::FETCH_ASSOC);

  foreach ($authors as &$author) {
        // Encoder la photo en base64 uniquement si elle existe
        if (!empty($author['photo'])) {
            $author['photo'] = base64_encode($author['photo']);
        } else {
            $author['photo'] = null;
        }

        // Encodage des autres champs en UTF-8
        foreach ($author as $key => $value) {
            if (!is_null($value)) {
                $author[$key] = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
            }
        }
  }

  return json_encode([
      "return" => 0,
      "authors" => $authors
  ]);
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
 * suppression d'un auteur par un admin
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


?>
