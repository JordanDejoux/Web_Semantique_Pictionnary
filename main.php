<?php
if (isset($_GET["erreur"])) {
    echo "<div><span>".$_GET["erreur"]."</span></div>";
}
include("header.php");
echo "<a href='paint.php'>Dessiner</a>";
?>