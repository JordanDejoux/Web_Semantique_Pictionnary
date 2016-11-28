<?php
    session_start();
    if(isset($_SESSION['prenom'])) {
        echo "Bienvenue " . $_SESSION['prenom'];
        echo "<a href='logout.php'>Deconnexion</a>";
        echo $_SESSION['profilepic'];
}else{
        echo "<input type='text' name='login' id='login'
                required
                placeholder='login'/><label for=\"login\">Login :</label>";
        echo "<input type='text' name='password' id='password'
                required
                placeholder='password'/><label for=\"password\">Password :</label>";
        echo "<input type='submit' value='Soumettre Formulaire'>";
    }
?>