<?php
require_once 'functions.php';

$erro = '';
$nome = $username = $email = $data = $genero = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $nome      = sanitize($_POST['nome']    ?? '');
  $username  = sanitize($_POST['usuario'] ?? '');
  $email_raw = trim($_POST['email'] ?? '');
  $email     = filter_var($email_raw, FILTER_SANITIZE_EMAIL);
  $senha     = $_POST['senha']     ?? '';
  $confirmar = $_POST['confirmar'] ?? '';
  $data      = $_POST['data']      ?? '';
  $genero    = $_POST['genero']    ?? '';

  if ($nome === '' || $username === '' || $email === '' || $senha === '' || $confirmar === '' || $data === '' || $genero === '') {
    $erro = "Preencha todos os campos.";
  } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erro = "E-mail inválido.";
  } elseif (email_exists($email)) {
    $erro = "Este e-mail já está cadastrado.";
  } elseif (username_exists($username)) {
    $erro = "Este username já está em uso.";
  } elseif ($senha !== $confirmar) {
    $erro = "As senhas não coincidem.";
  } elseif (strlen($senha) < 6 || !preg_match('/[A-Z]/', $senha) || !preg_match('/\d/', $senha)) {
    $erro = "A senha deve ter pelo menos 6 caracteres, 1 letra maiúscula e 1 número.";
  } elseif (!in_array($genero, ['Feminino', 'Masculino', 'Outro'], true)) {
    $erro = "Gênero inválido.";
  } else {
    $d = DateTime::createFromFormat('Y-m-d', $data);
    $errs = DateTime::getLastErrors();
    if (!$d || ($errs['warning_count'] + $errs['error_count'] > 0)) {
      $erro = "Data de nascimento inválida.";
    } else {
      create_user($nome, $username, $email, $senha, $data, $genero);
      header('Location: index.php?cad=ok');
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
  <title>Cadastro - Snapface</title>
  <link rel="stylesheet" href="Css/styles.css">
</head>
<body>
  <main class="cadastro-container">
    <div class="cadastro-box">
      <h2>Criar conta</h2>

      <?php if ($erro): ?>
        <p class="form-messages error"><?= htmlspecialchars($erro) ?></p>
      <?php endif; ?>

      <form method="POST" novalidate>
        <input type="text" name="nome" placeholder="Nome completo" value="<?= htmlspecialchars($nome) ?>" required>
        <input type="text" name="usuario" placeholder="Username" value="<?= htmlspecialchars($username) ?>" required>
        <input type="email" name="email" placeholder="E-mail" value="<?= htmlspecialchars($email) ?>" required>
        <input type="password" name="senha" placeholder="Senha" required>
        <input type="password" name="confirmar" placeholder="Confirmar senha" required>
        <input type="date" name="data" value="<?= htmlspecialchars($data) ?>" required>
        <select name="genero" required>
          <option value="">Gênero</option>
          <option value="Masculino" <?= $genero==='Masculino'?'selected':'' ?>>Masculino</option>
          <option value="Feminino"  <?= $genero==='Feminino'?'selected':'' ?>>Feminino</option>
          <option value="Outro"     <?= $genero==='Outro'?'selected':'' ?>>Outro</option>
        </select>
        <button type="submit" class="btn-primary">Cadastrar</button>
      </form>

      <p>Já tem conta? <a href="index.php">Entrar</a></p>
    </div>
  </main>
</body>
</html>