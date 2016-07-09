<?php
ob_start();
session_start();

$giorno = date('w');
$it_giorni = array(
  '1' => 'Lunedi',
  '2' => 'Martedi',
  '3' => 'Mercoledi',
  '4' => 'Giovedi',
  '5' => 'Venerdi',
  '6' => 'Sabato',
  '7' => 'Domenica',
);
?>
<!DOCTYPE html>
<html lang = "it">

    <head>
        <title>Pamar cleaning</title>
        <link href = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel = "stylesheet">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
        <link href = "css/style.css" rel = "stylesheet">
    </head>

    <body>
        <div class = "container">
            <div class='row'>
                <div class="col-lg-12"> 
                    <h2>Pamar cleaning</h2>
                    <h4 class="text-center">Societa cooperativa</h4>
                    <?php
                    if (isset($_POST['login']) && !empty($_POST['username']) && !empty($_POST['password'])) {

                        if ($_POST['username'] == 'pamar' &&
                            $_POST['password'] == 'paki1965') {
                            $_SESSION['valid'] = true;
                            $_SESSION['timeout'] = time();
                            $_SESSION['username'] = 'tutorialspoint';
                            ?>

                            <a href="logout.php" class="btn btn-danger" role="button">Esci</a>
                            <h4 class="text-center">Lista Lavori</h4>
                            <h3 class="text-center"><?= $it_giorni[$giorno]; ?></h3>
                            <div class="well">
                                <ul id="check-list-box" class="list-group checked-list-box">
                                    <?php
                                    //CARICA LA LISTA
                                    //legge tutto il file e lo salva in $file
                                    $file = file_get_contents("lista-condomini.txt") or exit("Impossibile aprire il file!");
                                    $file_arr = explode(":", $file);
                                    $lavoro_giorno = $file_arr[$giorno];
                                    $lista = explode("\n", $lavoro_giorno);


                                    /* SCRIVE LA NUOVA LISTA E LA APPENDE AGLI ELEMENTI
                                     * AVANZATI SE VI SONO
                                     * controllare che ci sia almeno un elemento con 0[y\n]:
                                     * y: leggi solo quelli con 0 e appendi la lista del giorno
                                     * n: cancella e scrivi la nuova lista del giorno
                                     */

                                    $f = filesize('lista-giornaliera.txt');
                                    $lista_permanente_giorno = [];

                                    if ($f > 0):
                                        $file = file_get_contents("lista-giornaliera.txt") or exit("Impossibile aprire il file!");
                                        $file_arr = explode(PHP_EOL, $file);
                                        $riga_arr = explode(":",current($file_arr));
                                        var_dump($riga_arr);
                                        die();
                                    endif;


                                    for ($i = 1; $i < count($lista) - 1; $i++):
                                        $riga = $lista[$i];
                                        $array_da_riga = explode(";", $riga);
                                        $lista_permanente_giorno[$array_da_riga[0]] = 0;
                                        file_put_contents('lista-giornaliera.txt', $i . ":" . key($lista_permanente_giorno) . ":" . $lista_permanente_giorno[$array_da_riga[0]] . PHP_EOL, FILE_APPEND | LOCK_EX);
                                        next($lista_permanente_giorno); //passa all'elemento succ nell'array
                                        echo "<li class='list-group-item' data-color='success'>" . $array_da_riga[0] . "</li>";
                                    endfor;
                                    ?>
                                </ul>
                                <br>
                                <div> 
                                    <button class="btn btn-primary col-xs-12" id="get-checked-data">Prendi i dati selezionati</button>
                                </div>
                                <pre id="display-json"></pre>
                            </div>
                            <?php
                        }
                    } else {
                        ?>
                        <form class = "form-signin" 
                              role = "form" 
                              action = "<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method = "post">
                            <label for="username">Username</label>
                            <input type = "text" class = "form-control" 
                                   name = "username"
                                   required autofocus>
                            <br>
                            <label for="password">Password</label>
                            <input type = "password" class = "form-control"
                                   name = "password" required>
                            <button class = "btn btn-lg btn-primary btn-block" type = "submit" 
                                    name = "login">Entra</button>
                        </form>                  
                        <?php
                    }
                    ?>
                </div>
            </div>
        </div>
        <script src="js/js.js"></script>
    </body>
</html>