<?php
/**
 * Created by PhpStorm.
 * User: Jordan Dejoux
 * Date: 29/11/2016
 * Time: 13:44
 */
session_start();

if (!isset($_SESSION['email'])) {

    header("Location: main.php");
}

$picture = stripslashes($_POST["picture"]);
$drawingCommands = $_POST["drawingCommands"];
$email = $_SESSION["email"];

// Connect to server and select database.
$dbh = new PDO('mysql:host=localhost;dbname=pictionnary', 'test', 'test');

$sql = $dbh->prepare("INSERT INTO DRAWINGS (EMAIL, COMMANDES, DESSIN) VALUES (:email, :commandes, :dessin)");
$sql->bindValue(":email", $email);
$sql->bindValue(":commandes", $drawingCommands);
$sql->bindValue(":dessin", $picture);
if (!$sql->execute()) {

    echo "PDO::errorInfo():<br/>";
    $err = $sql->errorInfo();
    print_r($err);
} else {

    echo "<a href='main.php'>Retour</a>";
}
?>
