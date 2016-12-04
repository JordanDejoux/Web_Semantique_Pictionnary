<?php

// récupérer les éléments du formulaire
// et se protéger contre l'injection MySQL (plus de détails ici: http://us.php.net/mysql_real_escape_string)
$email=stripslashes($_POST['email']);
$password=stripslashes($_POST['password']);
$nom=stripslashes($_POST['nom']);
$prenom=stripslashes($_POST['prenom']);
$tel=stripslashes($_POST['tel']);
$website=stripslashes($_POST['website']);
$sexe='';
if (array_key_exists('sexe',$_POST)) {
    $sexe=stripslashes($_POST['sexe']);
}
$birthdate=stripslashes($_POST['birthdate']);
$ville=stripslashes($_POST['ville']);
$taille=stripslashes($_POST['taille']);
$couleur=stripslashes($_POST['couleur']);
$profilepic=stripslashes($_POST['profilepic']);

try {
    // Connect to server and select database.
    $dbh = new PDO('mysql:host=localhost;dbname=pictionnary', 'test', 'test');

    // Vérifier si un utilisateur avec cette adresse email existe dans la table.
    // En SQL: sélectionner tous les tuples de la table USERS tels que l'email est égal à $email.
    $sql = $dbh->query("SELECT * FROM USERS WHERE email ='".$email."'");
    if ($sql->rowCount()>= 1 ) {
        header("Location: main.php?erreur=".urlencode("un problème est survenu"));
        $temp = urlencode("un utilisateur avec cette adresse email existe déjà");
        foreach ($_POST as $key => $value) {
            $temp = $temp."&".$key."=".$value;
        }
        header("Location: inscription.php?erreur=".$temp);
        // rediriger l'utilisateur ici, avec tous les paramètres du formulaire plus le message d'erreur
        // utiliser à bon escient la méthode htmlspecialchars http://www.php.net/manual/fr/function.htmlspecialchars.php          // et/ou la méthode urlencode http://php.net/manual/fr/function.urlencode.php
    }
    else {
        // Tenter d'inscrire l'utilisateur dans la base
        $sql = $dbh->prepare("INSERT INTO users (email, password, nom, prenom, tel, website, sexe, birthdate, ville, taille, couleur, profilepic) "
            . "VALUES (:email, :password, :nom, :prenom, :tel, :website, :sexe, :birthdate, :ville, :taille, :couleur, :profilepic)");
        $sql->bindValue(":email", $email);
        $sql->bindValue(":password", $password);
        if($nom == null)
            $sql->bindValue(":nom", null);
        else
            $sql->bindValue(":nom", $nom);
        if($prenom == null)
            $sql->bindValue(":prenom", null);
        else
            $sql->bindValue(":prenom", $prenom);
        if($tel== null)
            $sql->bindValue(":tel", null);
        else
            $sql->bindValue(":tel", $tel);
        if($website== null)
            $sql->bindValue(":website", null);
        else
            $sql->bindValue(":website", $website);
        if($birthdate== null)
            $sql->bindValue(":birthdate", null);
        else
            $sql->bindValue(":birthdate", $birthdate);
        if($ville== null)
            $sql->bindValue(":ville", null);
        else
            $sql->bindValue(":ville", $ville);
        if($taille== null)
            $sql->bindValue(":taille", null);
        else
            $sql->bindValue(":taille", $taille);
        if($profilepic== null)
            $sql->bindValue(":profilepic", null);
        else
            $sql->bindValue(":profilepic", $profilepic);

        $sql->bindValue(":couleur", substr($couleur,1));
        if($sexe == 'H' || $sexe =='F')
            $sql->bindValue(":sexe", $sexe);
        else
            $sql->bindValue(":sexe", null);
        }

        // on tente d'exécuter la requête SQL, si la méthode renvoie faux alors une erreur a été rencontrée.
        if (!$sql->execute()) {
            echo "PDO::errorInfo():<br/>";
            $err = $sql->errorInfo();
            print_r($err);
        } else {

            session_start();

            // ensuite on requête à nouveau la base pour l'utilisateur qui vient d'être inscrit, et
            $sql = $dbh->query("SELECT u.id, u.email, u.nom, u.prenom, u.couleur, u.profilepic FROM USERS u WHERE u.email='".$email."'");
            if ($sql->rowCount()<1) {
                header("Location: main.php?erreur=".urlencode("un problème est survenu"));
            }
            else {
                $sql->fetch();
                $_SESSION['id'] = $sql->id;
                $_SESSION['email'] = $sql->email;
                $_SESSION['nom'] = $sql->nom;
                $_SESSION['prenom'] = $sql->prenom;
                $_SESSION['couleur'] = $sql->couleur;
                $_SESSION['profilepic'] = $sql->profilepic;
            }

            header("Location: main.php");
        }
        $dbh = null;
    }
    catch (PDOException $e) {
        print "Erreur !: " . $e->getMessage() . "<br/>";
        $dbh = null;
        die();
    }
?>