-- Tabela de Produtos Tech (iPhone, Xiaomi, etc)
CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  preco REAL NOT NULL,
  categoria TEXT,
  descricao TEXT,
  imagem TEXT,
  capacidade TEXT,      -- Ex: 128GB, 256GB
  cor TEXT,             -- Ex: Titânio Natural
  condicao TEXT,        -- Ex: novo, seminovo, vitrine
  saude_bateria INTEGER, -- Ex: 100, 95
  custo REAL DEFAULT 0,  -- Preço de compra para cálculo de lucro
  estoque INTEGER DEFAULT 1
);

-- Tabela de Configurações da Loja (WhatsApp, Banner, etc)
CREATE TABLE IF NOT EXISTS configuracoes (
  id INTEGER PRIMARY KEY CHECK (id = 1), -- Garante que só exista uma config
  whats_vendas TEXT,
  banner_home TEXT,
  status_loja TEXT DEFAULT 'ABERTA'
);

-- Insere uma configuração inicial padrão
INSERT OR IGNORE INTO configuracoes (id, whats_vendas, status_loja) 
VALUES (1, '5548999999999', 'ABERTA');

-- Tabela para Banners do Carrossel
CREATE TABLE IF NOT EXISTS banners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  imagem_url TEXT NOT NULL,
  link_destino TEXT,
  ordem INTEGER DEFAULT 0
);

-- Tabela para Galeria de Vídeos (Reels Tech)
CREATE TABLE IF NOT EXISTS videos_tech (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_url TEXT NOT NULL,
  titulo TEXT,
  ordem INTEGER DEFAULT 0
);