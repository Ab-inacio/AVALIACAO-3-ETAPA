<?php
// functions.php
require_once __DIR__ . '/db.php';

function sanitize($v) {
  return trim(filter_var($v, FILTER_SANITIZE_SPECIAL_CHARS));
}

/* ===== USUÁRIOS ===== */

function email_exists($email) {
  global $pdo;
  $st = $pdo->prepare("SELECT id FROM usuarios WHERE email = ? LIMIT 1");
  $st->execute([$email]);
  return (bool)$st->fetch();
}

function username_exists($username) {
  global $pdo;
  $st = $pdo->prepare("SELECT id FROM usuarios WHERE username = ? LIMIT 1");
  $st->execute([$username]);
  return (bool)$st->fetch();
}

function create_user($nome, $username, $email, $senha, $data, $genero) {
  global $pdo;
  $hash = password_hash($senha, PASSWORD_DEFAULT);
  $st = $pdo->prepare("
    INSERT INTO usuarios (nome, username, email, senha_hash, data_nascimento, genero)
    VALUES (?,?,?,?,?,?)
  ");
  $st->execute([$nome, $username, $email, $hash, $data, $genero]);
}

function get_user_by_email($email) {
  global $pdo;
  $st = $pdo->prepare("SELECT * FROM usuarios WHERE email = ? LIMIT 1");
  $st->execute([$email]);
  return $st->fetch(PDO::FETCH_ASSOC);
}

function get_user($id) {
  global $pdo;
  $st = $pdo->prepare("SELECT * FROM usuarios WHERE id = ?");
  $st->execute([$id]);
  return $st->fetch(PDO::FETCH_ASSOC);
}

function update_user_basic($id, $nome, $username, $email) {
  global $pdo;
  $st = $pdo->prepare("UPDATE usuarios SET nome = ?, username = ?, email = ? WHERE id = ?");
  $st->execute([$nome, $username, $email, $id]);
}

function update_user_foto($id, $path) {
  global $pdo;
  $st = $pdo->prepare("UPDATE usuarios SET foto_perfil = ? WHERE id = ?");
  $st->execute([$path, $id]);
}

/* ===== POSTS / FEED ===== */

function create_post($user_id, $conteudo) {
  global $pdo;
  // coluna de data (criado_em) tem DEFAULT CURRENT_TIMESTAMP no banco
  $st = $pdo->prepare("INSERT INTO posts (usuario_id, conteudo) VALUES (?, ?)");
  $st->execute([$user_id, $conteudo]);
}

function get_feed_posts($user_id) {
  global $pdo;
  $sql = "
    SELECT 
      p.id,
      p.conteudo,
      p.criado_em AS created_at,
      u.id          AS user_id,
      u.nome,
      u.username,
      u.foto_perfil,
      (SELECT COUNT(*) FROM curtidas c WHERE c.post_id = p.id) AS likes
    FROM posts p
    JOIN usuarios u ON u.id = p.usuario_id
    WHERE p.usuario_id = :me
       OR p.usuario_id IN (
            SELECT seguido_id 
            FROM seguidores 
            WHERE seguidor_id = :me2
          )
    ORDER BY p.criado_em DESC
  ";
  $st = $pdo->prepare($sql);
  $st->execute([':me' => $user_id, ':me2' => $user_id]);
  return $st->fetchAll(PDO::FETCH_ASSOC);
}

/* ===== LIKES (CURTIR / DESCURTIR) ===== */

function toggle_like($user_id, $post_id) {
  global $pdo;
  $pdo->beginTransaction();

  $st = $pdo->prepare("SELECT 1 FROM curtidas WHERE usuario_id = ? AND post_id = ?");
  $st->execute([$user_id, $post_id]);

  if ($st->fetch()) {
    // já curtiu -> remover curtida
    $del = $pdo->prepare("DELETE FROM curtidas WHERE usuario_id = ? AND post_id = ?");
    $del->execute([$user_id, $post_id]);
  } else {
    // não curtiu ainda -> inserir curtida
    $ins = $pdo->prepare("INSERT INTO curtidas (usuario_id, post_id) VALUES (?, ?)");
    $ins->execute([$user_id, $post_id]);
  }

  $pdo->commit();
}

/* ===== FOLLOW / PESQUISA ===== */

function is_following($seguidor, $seguido) {
  global $pdo;
  $st = $pdo->prepare("SELECT 1 FROM seguidores WHERE seguidor_id = ? AND seguido_id = ?");
  $st->execute([$seguidor, $seguido]);
  return (bool)$st->fetch();
}

function toggle_follow($seguidor, $seguido) {
  global $pdo;
  if ($seguidor === $seguido) return null;

  if (is_following($seguidor, $seguido)) {
    // já segue -> deixar de seguir
    $st = $pdo->prepare("DELETE FROM seguidores WHERE seguidor_id = ? AND seguido_id = ?");
    $st->execute([$seguidor, $seguido]);
    return false;
  } else {
    // não segue -> seguir
    $st = $pdo->prepare("INSERT INTO seguidores (seguidor_id, seguido_id) VALUES (?, ?)");
    $st->execute([$seguidor, $seguido]);
    return true;
  }
}

function search_users($me, $q) {
  global $pdo;
  $sql = "
    SELECT id, nome, username, foto_perfil
    FROM usuarios
    WHERE (nome LIKE :q OR username LIKE :q2)
      AND id <> :me
    ORDER BY nome
  ";
  $st = $pdo->prepare($sql);
  $like = "%".$q."%";
  $st->execute([
    ':q'  => $like,
    ':q2' => $like,
    ':me' => $me
  ]);
  return $st->fetchAll(PDO::FETCH_ASSOC);
}
