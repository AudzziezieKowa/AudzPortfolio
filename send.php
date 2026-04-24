<?php
if(isset($_POST['name'])){
$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];


$to = "piol.audney15@gmail.com";
$subject = "Portfolio Contact Form";
$body = "Name: $name\nEmail: $email\nMessage: $message";


mail($to, $subject, $body);
echo "<script>alert('Message sent successfully!');window.location='contact.html';</script>";
}
?>