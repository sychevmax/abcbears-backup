<?php
    $email = $fio = $country = $city = $street = $house = $index = $code = $comment = "";
    $email = test_input($_POST["email"]);
    $fio = test_input($_POST["fio"]);
    $country = test_input($_POST["country"]);
    $city = test_input($_POST["city"]);
    $street = test_input($_POST["street"]);
    $house = test_input($_POST["house"]);
    $index = test_input($_POST["index"]);
    $code = test_input($_POST["code"]);
    $comment = trim(preg_replace('/\s+/', ' ', test_input($_POST["comment"])));
    $message = $email.";".$fio.";".$country.";".$city.";".$street.";".$house.";".$index.";".$code.";".$comment."\r\n";

    function test_input($data) {
      $data = trim($data);
      $data = stripslashes($data);
      $data = htmlspecialchars($data);
      return $data;
    }

    $file = fopen('../data/thankyou.csv','a+');
    $res = fwrite($file, $message);
    fclose($file);
?>
