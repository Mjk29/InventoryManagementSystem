<?php
// var_dump(phpinfo());

ini_set ("display_errors", "1");
error_reporting(E_ALL);
echo "before\n";

oracle_connect();
echo "\nafter";

function oracle_connect(){
  $user='mjk29';
  $pwd='QkMxUxqbJ';
  $server='prophet.njit.edu'; // or ip
  $port='1521';
  $sid='course'; // service name
  $charset='WE8ISO8859P1'; // change to whatever is needed

  $conn=oci_connect($user,$pwd,'//'.$server.':'.$port.'/'.$sid,$charset);

  if (!$conn){
    $e=oci_error();
    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
    echo $e;
    return FALSE;
  }
  else
    return $conn;
}
?>