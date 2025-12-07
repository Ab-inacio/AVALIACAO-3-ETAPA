<?php
require_once 'functions.php';
require_once 'auth.php';

ensure_logged_in();

$me   = (int)$_SESSION['user_id'];
$user = get_user($me);

$q    = trim($_GET['q'] ?? '');
$erro = '';
$ok   = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['toggle_follow'])) {
  $alvo = (int)$_POST['toggle_follow'];
  $res  = toggle_follow($me, $alvo);
  $ok   = $res ? "Agora você segue este usuário." : "Você deixou de seguir este usuário.";
}

$lista = [];
if ($q !== '') {
  $lista = search_users($me, $q);
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pesquisar usuários - Snapface</title>
  <link rel="stylesheet" href="Css/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
<div class="container">
  <nav class="sidebar">
    <a href="feed.php" title="Feed"><i class="fas fa-home"></i></a>
    <a href="pesquisa.php" title="Pesquisar" aria-current="page"><i class="fas fa-search"></i></a>
    <a href="feed.php" title="Nova postagem"><i class="fas fa-plus"></i></a>
    <a href="perfil.php" title="Perfil"><i class="fas fa-user"></i></a>
  </nav>

  <main class="main-content">
    <header class="profile-header">
      <img src="<?= $user['foto_perfil'] ? htmlspecialchars($user['foto_perfil']) : 'Imagens/Foto Perfil.jpg' ?>" alt="Foto">
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

    <div class="post-form" style="gap:8px;">
      <form method="GET" style="display:flex;gap:8px;width:100%;">
        <input type="text" name="q" placeholder="Pesquisar por nome ou username..." value="<?= htmlspecialchars($q) ?>">
        <button type="submit" class="btn-primary"><i class="fas fa-search"></i> Buscar</button>
      </form>
    </div>

    <?php foreach ($lista as $u): ?>
      <div class="post">
        <img src="<?= $u['foto_perfil'] ? htmlspecialchars($u['foto_perfil']) : 'Imagens/Foto Perfil.jpg' ?>" alt="Perfil">
        <div class="post-body" style="display:flex;align-items:center;gap:12px;">
          <div style="flex:1;">
            <div class="post-header-line">
              <label class="name"><?= htmlspecialchars($u['nome']) ?></label>
              <label class="username">@<?= htmlspecialchars($u['username']) ?></label>
            </div>
          </div>
          <form method="POST">
            <button class="<?= is_following($me, $u['id']) ? 'unfollow-btn' : 'follow-btn' ?>" 
            name="toggle_follow" 
              value="<?= (int)$u['id'] ?>">
  <?= is_following($me, $u['id']) ? 'Deixar de seguir' : 'Seguir' ?>
</button>
          </form>
        </div>
      </div>
    <?php endforeach; ?>

    <?php if ($q !== '' && empty($lista)): ?>
      <div class="alert">Nenhum usuário encontrado para “<?= htmlspecialchars($q) ?>”.</div>
    <?php endif; ?>
  </main>
</div>
</body>

</html>
