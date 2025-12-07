<?php
require_once 'functions.php';
require_once 'auth.php';

if (!empty($_SESSION['user_id'])) {
  header('Location: feed.php');
  exit;
}

$erro = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $email = trim($_POST['email'] ?? '');
  $senha = $_POST['senha'] ?? '';

  if ($email === '' || $senha === '') {
    $erro = "Preencha e-mail e senha.";
  } else {
    $user = get_user_by_email($email);
    if (!$user || !password_verify($senha, $user['senha_hash'])) {
      $erro = "E-mail ou senha inválidos.";
    } else {
      $_SESSION['user_id'] = $user['id'];
      header('Location: feed.php');
      exit;
    }
  }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - Snapface</title>
  <link rel="stylesheet" href="Css/styles.css">
</head>
<body>
  <main class="cadastro-container">
    <div class="cadastro-box">
      <h2>Entrar</h2>

      <?php if (isset($_GET['cad'])): ?>
        <p class="form-messages success">Cadastro concluído! Faça login.</p>
      <?php endif; ?>

      <?php if (isset($_GET['timeout'])): ?>
        <p class="form-messages error">Sessão expirada. Entre novamente.</p>
      <?php endif; ?>

      <?php if ($erro): ?>
        <p class="form-messages error"><?= htmlspecialchars($erro) ?></p>
      <?php endif; ?>

      <form method="POST">
        <input type="email" name="email" placeholder="E-mail" required>
        <input type="password" name="senha" placeholder="Senha" required>
        <button type="submit" class="btn-primary">Entrar</button>
      </form>

      <p>Não tem conta? <a href="cadastro.php">Cadastre-se</a></p>
    </div>
  </main>
</body>

</html>
