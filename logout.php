<?php
   session_start();
   unset($_SESSION["username"]);
   unset($_SESSION["password"]);
   
   echo 'Ora non sei piu loggato';
   header('Refresh: 2; URL = index.php');
?>