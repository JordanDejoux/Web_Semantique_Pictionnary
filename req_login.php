<?php
/**
 * Created by PhpStorm.
 * User: Jordan Dejoux
 * Date: 29/11/2016
 * Time: 13:20
 */
$email=stripslashes($_POST['email']);
$password=stripslashes($_POST['password']);

// Connect to server and select database.
$dbh = new PDO('mysql:host=localhost;dbname=pictionnary', 'test', 'test');

session_start();

// ensuite on requête à nouveau la base pour l'utilisateur qui vient d'être inscrit, et
$sql = $dbh->query("SELECT u.id, u.email, u.nom, u.prenom, u.couleur, u.profilepic FROM USERS u WHERE u.email='".$email."' AND u.password='".$password."'");
if ($sql->rowCount()<1) {
    header("Location: main.php?erreur=".urlencode("un problème est survenu"));
}
else {
    // on récupère la ligne qui nous intéresse avec $sql->fetch(),
    // et on enregistre les données dans la session avec $_SESSION["..."]=...
    $result = $sql->fetch(PDO::FETCH_ASSOC);

    $_SESSION["email"] = $result["email"];
    $_SESSION["nom"] = $result["nom"];
    $_SESSION["prenom"] = $result["prenom"];
    $_SESSION["couleur"] = $result["couleur"];
    $_SESSION["profilepic"] = $result["profilepic"];
    header("Location: main.php?rowCount=" . $sql->rowCount());
}