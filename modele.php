<?php
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
    // Extraire les valeurs
    $last_name = $data['last_name'] ?? null;
    $first_name = $data['first_name'] ?? null;
    $email = $data['email'] ?? null;
    $birth_date = $data['birth_date'] ?? null;
    $password = password_hash($data['password'] ?? '', PASSWORD_DEFAULT);
    $gender = $data['gender'] ?? null;
    $address = $data['address'] ?? null;
    $city = $data['city'] ?? null;
    $postal_code = $data['postal_code'] ?? null;
    $country = $data['country'] ?? null;
    $phone = $data['phone'] ?? null;
    $conn = login_database();

    try {
      $sql = "INSERT INTO users 
        (last_name, first_name, email, birth_date, password, gender, address, city, postal_code, country, phone)
        VALUES 
        (:last_name, :first_name, :email, :birth_date, :password, :gender, :address, :city, :postal_code, :country, :phone)";
              
      $stmt = $conn->prepare($sql);        
      $stmt->bindParam(':last_name', $last_name);
      $stmt->bindParam(':first_name', $first_name);
      $stmt->bindParam(':email', $email);
      $stmt->bindParam(':birth_date', $birth_date);
      $stmt->bindParam(':password', $password);
      $stmt->bindParam(':gender', $gender);
      $stmt->bindParam(':address', $address);
      $stmt->bindParam(':city', $city);
      $stmt->bindParam(':postal_code', $postal_code);
      $stmt->bindParam(':country', $country);
      $stmt->bindParam(':phone', $phone);
      
      $stmt->execute();
      // Succès: on envoie un json
      return json_encode([
          "return" => 0,
          "message" => "Inscription réussie"
      ]);
    } catch (PDOException $e) {
      // Echec -> envoyer un JSON
      return json_encode([
          "return" => -1,
          "message" => "Inscription échouée, Veillez réessayer plutard"
      ]);
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
                "user_id" => $user['id'] // tu peux renvoyer plus d'infos si besoin
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

function logout() {
  session_destroy();
}

?>