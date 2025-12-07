<?php
// functions.php
require_once __DIR__ . '/db.php';

function sanitize($v) {
  return trim(filter_var($v, FILTER_SANITIZE_SPECIAL_CHARS));
}

/* ===== USUÁRIOS ===== */

function email_exists($email) {
  global $pdo;
  $st = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
  $st->execute([$email]);
  return (bool)$st->fetch();
}

function username_exists($username) {
  global $pdo;
  $st = $pdo->prepare("SELECT id FROM users WHERE username = ? LIMIT 1");
  $st->execute([$username]);
  return (bool)$st->fetch();
}

function create_user($nome, $username, $email, $senha, $data, $genero) {
  global $pdo;
  $hash = password_hash($senha, PASSWORD_DEFAULT);
  $st = $pdo->prepare("
    INSERT INTO users (nome, username, email, senha_hash, data_nascimento, genero)
    VALUES (?,?,?,?,?,?)
  ");
  $st->execute([$nome, $username, $email, $hash, $data, $genero]);
}

function get_user_by_email($email) {
  global $pdo;
  $st = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
  $st->execute([$email]);
  return $st->fetch();
}

function get_user($id) {
  global $pdo;
  $st = $pdo->prepare("SELECT * FROM users WHERE id = ?");
  $st->execute([$id]);
  return $st->fetch();
}

function update_user_basic($id, $nome, $username, $email) {
  global $pdo;
  $st = $pdo->prepare("UPDATE users SET nome = ?, username = ?, email = ? WHERE id = ?");
  $st->execute([$nome, $username, $email, $id]);
}

function update_user_foto($id, $path) {
  global $pdo;
  $st = $pdo->prepare("UPDATE users SET foto_perfil = ? WHERE id = ?");
  $st->execute([$path, $id]);
}

/* ===== POSTS / FEED ===== */

function create_post($user_id, $conteudo) {
  global $pdo;
  $st = $pdo->prepare("INSERT INTO posts (user_id, conteudo) VALUES (?, ?)");
  $st->execute([$user_id, $conteudo]);
}

function get_feed_posts($user_id) {
  global $pdo;
  $sql = "
    SELECT p.id, p.conteudo, p.created_at,
           u.id AS user_id, u.nome, u.username, u.foto_perfil,
           (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes
    FROM posts p
    JOIN users u ON u.id = p.user_id
    WHERE p.user_id = :me
       OR p.user_id IN (
            SELECT seguido_id FROM follows WHERE seguidor_id = :me2
          )
    ORDER BY p.created_at DESC
  ";
  $st = $pdo->prepare($sql);
  $st->execute([':me' => $user_id, ':me2' => $user_id]);
  return $st->fetchAll();
}

/* ===== LIKES (CURTIR / DESCURTIR) ===== */

function toggle_like($user_id, $post_id) {
  global $pdo;
  $pdo->beginTransaction();
  $st = $pdo->prepare("SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?");
  $st->execute([$user_id, $post_id]);

  if ($st->fetch()) {
    $del = $pdo->prepare("DELETE FROM likes WHERE user_id = ? AND post_id = ?");
    $del->execute([$user_id, $post_id]);
  } else {
    $ins = $pdo->prepare("INSERT INTO likes (user_id, post_id) VALUES (?, ?)");
    $ins->execute([$user_id, $post_id]);
  }
  $pdo->commit();
}

/* ===== FOLLOW / PESQUISA ===== */

function is_following($seguidor, $seguido) {
  global $pdo;
  $st = $pdo->prepare("SELECT 1 FROM follows WHERE seguidor_id = ? AND seguido_id = ?");
  $st->execute([$seguidor, $seguido]);
  return (bool)$st->fetch();
}

function toggle_follow($seguidor, $seguido) {
  global $pdo;
  if ($seguidor === $seguido) return null;
  if (is_following($seguidor, $seguido)) {
    $st = $pdo->prepare("DELETE FROM follows WHERE seguidor_id = ? AND seguido_id = ?");
    $st->execute([$seguidor, $seguido]);
    return false;
  } else {
    $st = $pdo->prepare("INSERT INTO follows (seguidor_id, seguido_id) VALUES (?, ?)");
    $st->execute([$seguidor, $seguido]);
    return true;
  }
}

function search_users($me, $q) {
  global $pdo;
  $sql = "
    SELECT id, nome, username, foto_perfil
    FROM users
    WHERE (nome LIKE :q OR username LIKE :q2)
      AND id <> :me
    ORDER BY nome
  ";
  $st = $pdo->prepare($sql);
  $like = "%".$q."%";
  $st->execute([':q' => $like, ':q2' => $like, ':me' => $me]);
  return $st->fetchAll();
}