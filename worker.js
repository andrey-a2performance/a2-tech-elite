const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    const { pathname } = new URL(request.url);

    try {
      // ROTA: PRODUTOS
      if (pathname === "/produtos") {
        if (request.method === "GET") {
          const { results } = await env.DB.prepare("SELECT * FROM produtos ORDER BY id DESC").all();
          return new Response(JSON.stringify(results), { headers: corsHeaders });
        }

        if (request.method === "POST") {
          const p = await request.json();
          await env.DB.prepare(`
            INSERT INTO produtos (nome, preco, custo, categoria, descricao, imagem, capacidade, cor, condicao, saude_bateria, estoque) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(p.nome, p.preco, p.custo || 0, p.categoria, p.descricao, p.imagem, p.capacidade, p.cor, p.condicao, p.saude_bateria || 100, 1).run();
          return new Response("Produto Salvo", { headers: corsHeaders });
        }

        if (request.method === "PUT") {
          const p = await request.json();
          await env.DB.prepare(`
            UPDATE produtos SET 
              nome=?, preco=?, custo=?, categoria=?, descricao=?, 
              imagem=?, capacidade=?, cor=?, condicao=?, saude_bateria=?, estoque=?
            WHERE id = ?
          `).bind(p.nome, p.preco, p.custo, p.categoria, p.descricao, p.imagem, p.capacidade, p.cor, p.condicao, p.saude_bateria, p.estoque, p.id).run();
          return new Response("Produto Atualizado", { headers: corsHeaders });
        }
        
        if (request.method === "DELETE") {
          const { id } = await request.json();
          await env.DB.prepare("DELETE FROM produtos WHERE id = ?").bind(id).run();
          return new Response("Removido", { headers: corsHeaders });
        }
      }

      // ROTA: CONFIGURAÇÕES (SISTEMA ELITE COM ON CONFLICT)
      if (pathname.startsWith("/config")) {
        if (request.method === "GET") {
          const result = await env.DB.prepare("SELECT * FROM configuracoes WHERE id = 1").first();
          return new Response(JSON.stringify(result || {}), { headers: corsHeaders });
        }

        if (request.method === "POST") {
          const c = await request.json();
          await env.DB.prepare(`
            INSERT INTO configuracoes (id, whats_vendas, banner_home) 
            VALUES (1, ?, ?)
            ON CONFLICT(id) DO UPDATE SET 
              whats_vendas = excluded.whats_vendas, 
              banner_home = excluded.banner_home
          `).bind(c.whats_vendas, c.banner_home).run();
          return new Response("Config Atualizada", { headers: corsHeaders });
        }
      }

      // ROTA: BANNERS ADICIONAIS
      if (pathname === "/banners") {
        if (request.method === "GET") {
          const { results } = await env.DB.prepare("SELECT * FROM banners ORDER BY ordem ASC").all();
          return new Response(JSON.stringify(results), { headers: corsHeaders });
        }
        if (request.method === "POST") {
          const b = await request.json();
          await env.DB.prepare("INSERT INTO banners (imagem_url, ordem) VALUES (?, ?)").bind(b.imagem_url, b.ordem).run();
          return new Response("Banner Salvo", { headers: corsHeaders });
        }
      }

      return new Response("Rota não encontrada", { status: 404, headers: corsHeaders });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }
};