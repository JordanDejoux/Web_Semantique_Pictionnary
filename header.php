<?php
    session_start();
    if(isset($_SESSION['email'])) {
        echo "Bienvenue " . $_SESSION['email'];
        echo "<a href='logout.php'>Deconnexion</a>";
        echo $_SESSION['profilepic'];
}else{
        echo '<div id="header">
            <form id="search" action="req_login.php" method="post">
                <label>Email <input type="text" name="email" id="email"></label>
                <label>Mot de passe<input type="password" name="password" id="password"></label>
                <input type="submit" class="submit" value="Login">
                <a href="inscription.php">Inscription</a>
            </form>
        </div>';
    }
?>