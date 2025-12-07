DROP TABLE IF EXISTS curtidas;
DROP TABLE IF EXISTS seguidores;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS usuarios;

-- =========================
-- TABELA DE USUÁRIOS
-- =========================
CREATE TABLE usuarios (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  nome            VARCHAR(100)      NOT NULL,
  username        VARCHAR(50)       NOT NULL UNIQUE,
  email           VARCHAR(150)      NOT NULL UNIQUE,
  senha_hash      VARCHAR(255)      NOT NULL,
  data_nascimento DATE              NULL,
  genero          ENUM('feminino','masculino','outro') DEFAULT 'outro',
  foto_perfil     VARCHAR(255)      DEFAULT NULL,
  criado_em       TIMESTAMP         DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- TABELA DE POSTS
-- =========================
CREATE TABLE posts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT           NOT NULL,
  conteudo    TEXT          NOT NULL,
  criado_em   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- TABELA DE SEGUIDORES
-- =========================
CREATE TABLE seguidores (
  seguidor_id INT NOT NULL,
  seguido_id  INT NOT NULL,
  seguido_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (seguidor_id, seguido_id),
  FOREIGN KEY (seguidor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (seguido_id)  REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- TABELA DE CURTIDAS
-- =========================
CREATE TABLE curtidas (
  usuario_id INT NOT NULL,
  post_id    INT NOT NULL,
  curtido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id, post_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id)    REFERENCES posts(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;