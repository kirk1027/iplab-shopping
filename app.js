addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

// Google Apps Script APIのエンドポイント
const GOOGLE_APPS_SCRIPT_API = "https://script.google.com/a/macros/iplab.cs.tsukuba.ac.jp/s/AKfycbyY-dC--5YGPy7wg7R4A1r8RQnnCCjh6ATyfFnfBd3mbSjlonbztzRxLYRHMAoRo6RWZg/exec";

async function handleRequest(request) {
  const url = new URL(request.url);

  // 商品情報を取得するエンドポイント
  if (url.pathname === "/api/products") {
    return fetchProducts();
  }

  // 在庫を更新するエンドポイント
  if (url.pathname === "/api/update-stock" && request.method === "POST") {
    return updateStock(request);
  }

  // 上記以外のリクエストは404エラーを返す
  return new Response("Not Found", { status: 404 });
}

// 商品情報を取得する関数
async function fetchProducts() {
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_API); // Google Apps Script APIを呼び出す
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const products = await response.json(); // 商品データを取得
    return new Response(JSON.stringify(products), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// 在庫を更新する関数
async function updateStock(request) {
  try {
    const body = await request.json(); // リクエストボディを解析
    const response = await fetch(GOOGLE_APPS_SCRIPT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body), // 在庫更新データをGoogle Apps Script APIに送信
    });

    if (!response.ok) {
      throw new Error(`Failed to update stock: ${response.status}`);
    }

    const result = await response.json(); // 更新結果を取得
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update stock" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


// 売り上げデータを提供するAPI
app.get('/api/sales-data', (req, res) => {
  res.json({ totalSales, salesData });
});

// PORTの定義
const PORT = process.env.PORT || 3000;

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit the application at http://localhost:${PORT} (or the Render-provided URL)`);
});
