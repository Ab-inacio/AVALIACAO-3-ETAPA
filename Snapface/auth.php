<?php

ini_set('session.use_strict_mode', 1);
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.gc_maxlifetime', 3600);

$sessionPath = __DIR__ . '/sessions';

if (!is_dir($sessionPath)) {
    mkdir($sessionPath, 0777, true);
}

session_save_path($sessionPath);

session_start();

if (isset($_SESSION['ultimo_acesso']) && (time() - $_SESSION['ultimo_acesso'] > 900)) {
  session_unset();
  session_destroy();
  header('Location: index.php?timeout=1');
  exit;
}
$_SESSION['ultimo_acesso'] = time();

function ensure_logged_in() {
  if (empty($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
  }

}
