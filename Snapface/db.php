<?php

$host = "sql100.infinityfree.com";
$user = "if0_40621127";
$pass = "Pc8WVf27qd3m"; 
$db   = "if0_40621127_snapface";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erro ao conectar ao banco: " . $e->getMessage());
}