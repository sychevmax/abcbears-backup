<?php
if (count($_POST)==0) {
 exit;
}
$email = $name = $item = $message = $address = "";
$email = $_POST["email"];
$name = test_input($_POST["name"]);
$item = test_input($_POST["item"]);
$message = test_input($_POST["message"]);
$address = test_input($_POST["address"]);

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
$to      = 'sychevmax@gmail.com';
$subject = 'Заказ ' . $item;
$message = $message . "\r\n Адрес: " . $address;
$headers = 'From: ' . $email . "\r\n" .
	'Reply-To: ' . $email . "\r\n" .
	'X-Mailer: PHP/' . phpversion();

mail($to, $subject, $message, $headers);
echo "Message sent to" . $to . " from " . $email . " with subject " . $subject . " and message " . $message;
?>
