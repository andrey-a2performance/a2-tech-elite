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
      // ROTA: PRODUTOS (Para a Vitrine e Estoque)
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
      }

      // ROTA: CONFIGURAÇÕES (Para WhatsApp e Banner)
      if (pathname.startsWith("/config")) {
        if (request.method === "GET") {
          const result = await env.DB.prepare("SELECT * FROM configuracoes WHERE id = 1").first();
          return new Response(JSON.stringify(result), { headers: corsHeaders });
        }

        if (request.method === "POST") {
          const c = await request.json();
          await env.DB.prepare(`
            UPDATE configuracoes SET whats_vendas = ?, banner_home = ? WHERE id = 1
          `).bind(c.whats_vendas, c.banner_home).run();
          return new Response("Config Atualizada", { headers: corsHeaders });
        }
      }

      // ROTA: BANNERS
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

      // ROTA: VÍDEOS TECH
      if (pathname === "/videos-tech") {
        if (request.method === "GET") {
          const { results } = await env.DB.prepare("SELECT * FROM videos_tech ORDER BY ordem ASC").all();
          return new Response(JSON.stringify(results), { headers: corsHeaders });
        }
        if (request.method === "POST") {
          const v = await request.json();
          await env.DB.prepare("INSERT INTO videos_tech (video_url, titulo, ordem) VALUES (?, ?, ?)").bind(v.video_url, v.titulo, v.ordem).run();
          return new Response("Vídeo Salvo", { headers: corsHeaders });
        }
      }

      return new Response("Rota não encontrada", { status: 404, headers: corsHeaders });

    } catch (e) {
      return new Response(e.message, { status: 500, headers: corsHeaders });
    }
  }
};