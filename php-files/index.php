<?php
$servername = "mariadb"; // Service name from docker-compose.yml
$username = "root";
$password = "adminmariadb";
$dbname = "basetest";
?>

<!DOCTYPE html>
<html>
<head>
  <title>Test Docker PHP/MariaDB</title>
</head>
<body>
  <h1>Test PHP / MariaDB</h1>
  <table>
    <tr>
      <th>Id</th>
      <th>Nom</th>
      <th>Prix</th>
      <th>Image</th>
    </tr>

<?php

// Create connection
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$link = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($link->connect_errno) {
    echo "Connection to mysql failed: " . $link->connect_error;
    exit();
}
echo "Connected to MariaDB successfully!<br>";

$sql = "select * from products";
$result = $link -> query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {

        echo "<tr>"
	     ."<td>". $row["id"]. "</td>"
             ."<td>". $row["name"]. "</td>"
             ."<td>". $row["price"]. "</td>"
             ."<td>". $row["imageurl"]. "</td>"
	     ."</tr>";
    }
} else {
    echo "0 results";
}

$link->close();
?>

  </table>
</body>
</html>
