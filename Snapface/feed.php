<?php
require_once 'functions.php';
require_once 'auth.php';

ensure_logged_in();

$me   = (int)$_SESSION['user_id'];
$user = get_user($me);

$erro = '';

// novo post
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if (isset($_POST['novoPost'])) {
    $txt = trim($_POST['novoPost']);
    if ($txt === '') {
      $erro = "O post não pode estar vazio.";
    } else {
      create_post($me, $txt);
      header('Location: feed.php');
      exit;
    }
  }

  if (isset($_POST['curtir'])) {
    $post_id = (int)$_POST['curtir'];
    toggle_like($me, $post_id);
    header('Location: feed.php');
    exit;
  }
}

$posts = get_feed_posts($me);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Feed - Snapface</title>
  <link rel="stylesheet" href="Css/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
<div class="container">
  <nav class="sidebar">
    <a href="feed.php" title="Feed" aria-current="page"><i class="fas fa-home"></i></a>
    <a href="pesquisa.php" title="Pesquisar"><i class="fas fa-search"></i></a>
    <a href="feed.php" title="Nova postagem"><i class="fas fa-plus"></i></a>
    <a href="perfil.php" title="Perfil"><i class="fas fa-user"></i></a>
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

    <?php if ($erro): ?>
      <div class="alert alert-error"><?= htmlspecialchars($erro) ?></div>
    <?php endif; ?>

    <form method="POST" class="post-form">
      <textarea name="novoPost" placeholder="O que você está pensando?" required></textarea>
      <button type="submit" class="btn-primary">Postar</button>
    </form>

    <?php if (empty($posts)): ?>
      <div class="alert">Seu feed está vazio. Siga alguém ou faça uma postagem!</div>
    <?php else: ?>
      <?php foreach ($posts as $p): ?>
        <div class="post">
          <img src="<?= $p['foto_perfil'] ? htmlspecialchars($p['foto_perfil']) : 'Imagens/Foto Perfil.jpg' ?>" alt="Perfil">
          <div class="post-body">
            <div class="post-header-line">
              <label class="name"><?= htmlspecialchars($p['nome']) ?></label>
              <label class="username">@<?= htmlspecialchars($p['username']) ?></label>
              <span class="muted" style="margin-left:auto;font-size:12px;">
                <?= date('d/m/Y H:i', strtotime($p['created_at'])) ?>
              </span>
            </div>
            <p class="post-content"><?= htmlspecialchars($p['conteudo']) ?></p>
            <div class="interactions">
              <form method="POST">
                <button type="submit" name="curtir" value="<?= (int)$p['id'] ?>" class="btn-like">
                  <i class="fas fa-heart"></i>
                </button>
                <span class="like-count"><?= (int)$p['likes'] ?> curtidas</span>
              </form>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    <?php endif; ?>
  </main>
</div>
</body>
</html>