<?php
require_once 'functions.php';
require_once 'auth.php';

ensure_logged_in();

$me   = (int)$_SESSION['user_id'];
$user = get_user($me);

$erro = '';
$ok   = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // atualizar dados básicos
  if (isset($_POST['atualizar'])) {
    $nome     = sanitize($_POST['nome'] ?? '');
    $username = sanitize($_POST['username'] ?? '');
    $emailRaw = trim($_POST['email'] ?? '');
    $email    = filter_var($emailRaw, FILTER_SANITIZE_EMAIL);

    if ($nome === '' || $username === '' || $email === '') {
      $erro = "Preencha nome, username e e-mail.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $erro = "E-mail inválido.";
    } else {
      // checar conflitos com outros usuários
      if ($username !== $user['username'] && username_exists($username)) {
        $erro = "Este username já está em uso.";
      } elseif ($email !== $user['email'] && email_exists($email)) {
        $erro = "Este e-mail já está cadastrado.";
      } else {
        update_user_basic($me, $nome, $username, $email);
        $ok   = "Dados atualizados com sucesso.";
        $user = get_user($me);
      }
    }
  }

  // upload de foto
  if (isset($_POST['upload_foto']) && isset($_FILES['foto'])) {
    if ($_FILES['foto']['error'] === UPLOAD_ERR_OK) {
      $ext = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));
      if (!in_array($ext, ['jpg','jpeg','png','webp'])) {
        $erro = "Formato de imagem inválido. Use jpg, png ou webp.";
      } else {
        if (!is_dir('uploads')) {
          mkdir('uploads', 0775, true);
        }
        $dest = 'uploads/foto_' . $me . '_' . time() . '.' . $ext;
        if (move_uploaded_file($_FILES['foto']['tmp_name'], $dest)) {
          update_user_foto($me, $dest);
          $ok   = "Foto atualizada!";
          $user = get_user($me);
        } else {
          $erro = "Falha ao salvar a imagem.";
        }
      }
    } else {
      $erro = "Erro no upload da imagem.";
    }
  }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Perfil - Snapface</title>
  <link rel="stylesheet" href="Css/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
<div class="container">
  <nav class="sidebar">
    <a href="feed.php" title="Feed"><i class="fas fa-home"></i></a>
    <a href="pesquisa.php" title="Pesquisar"><i class="fas fa-search"></i></a>
    <a href="feed.php" title="Nova postagem"><i class="fas fa-plus"></i></a>
    <a href="perfil.php" title="Perfil" aria-current="page"><i class="fas fa-user"></i></a>
  </nav>

  <main class="main-content">
    <header class="profile-header">
      <img src="<?= $user['foto_perfil'] ? htmlspecialchars($user['foto_perfil']) : 'Imagens/Foto Perfil.jpg' ?>" alt="Foto de perfil">
      <div>
        <label class="name"><?= htmlspecialchars($user['nome']) ?></label><br>
        <label class="username">@<?= htmlspecialchars($user['username']) ?></label>
      </div>
      <a class="btn-logout" href="logout.php">
        <i class="fas fa-right-from-bracket"></i> Sair
      </a>
    </header>

    <?php if ($erro): ?><div class="alert alert-error"><?= htmlspecialchars($erro) ?></div><?php endif; ?>
    <?php if ($ok):   ?><div class="alert"><?= htmlspecialchars($ok) ?></div><?php endif; ?>

    <section class="profile-big-card">
      <img class="profile-big-photo" src="<?= $user['foto_perfil'] ? htmlspecialchars($user['foto_perfil']) : 'Imagens/Foto Perfil.jpg' ?>" alt="Foto grande">
      <h2 class="profile-big-name"><?= htmlspecialchars($user['nome']) ?></h2>
    </section>

    <div class="cadastro-box" style="margin-top:16px;">
      <h3>Alterar informações</h3>
      <form method="POST">
        <input type="text" name="nome" value="<?= htmlspecialchars($user['nome']) ?>" placeholder="Nome completo" required>
        <input type="text" name="username" value="<?= htmlspecialchars($user['username']) ?>" placeholder="Username" required>
        <input type="email" name="email" value="<?= htmlspecialchars($user['email']) ?>" placeholder="E-mail" required>
        <button type="submit" name="atualizar" class="btn-primary">Salvar</button>
      </form>
    </div>

    <div class="cadastro-box" style="margin-top:16px;">
      <h3>Foto de perfil</h3>
      <form method="POST" enctype="multipart/form-data">
        <input type="file" name="foto" accept=".jpg,.jpeg,.png,.webp" required>
        <button type="submit" name="upload_foto" class="btn-primary">Enviar</button>
      </form>
    </div>
  </main>
</div>
</body>
</html>