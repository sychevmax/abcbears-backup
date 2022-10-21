<?php
if (count($_POST)==0) {
 exit;
}
$email = $name = $item = $message = $address = "";
$email = test_input($_POST["email"]);
$name = test_input($_POST["name"]);
$item = test_input($_POST["item"]);
$message = "От: " . $name . "\r\n" . test_input($_POST["message"]) . "\r\n";
//$address = test_input($_POST["address"]);

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
$to      = 'hello.abcbears@gmail.com';
$subject = 'Заказ ' . $item;
//$message = $message . "\r\n Адрес: " . $address;
$headers = 'From: ' . $email . "\r\n" .
	'Reply-To: ' . $email . "\r\n" .
	'X-Mailer: PHP/' . phpversion();

$file = fopen('../data/orders.txt','a+');
$res = fwrite($file, date("d.m.Y H:i") . " " . $subject . " " . $email . " " . $message);
fclose($file);
mail($to, $subject, $message, $headers);
echo "Message sent"
?>
