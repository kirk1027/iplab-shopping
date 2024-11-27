// Google Apps Script APIのエンドポイント
const GOOGLE_APPS_SCRIPT_API = "https://script.google.com/macros/s/AKfycbzNMBBIPOo1ycU2hPXYYwwf2_oSumRKxX3M5z3VAM1jPM91Z2dj0KSZDH8h-LfwiIsQeQ/exec";

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    if (request.url.includes("/api/products")) {
      return fetchProducts();
    } else if (request.url.includes("/api/update-stock")) {
      return updateStock(request);
    } else if (request.url.includes("/api/sales-data")) {
      return fetchSalesData();
    }
    return new Response("Not Found", { status: 404 });
  } catch (error) {
    console.error("Workers error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// 商品情報を取得する関数
async function fetchProducts() {
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_API); // Google Apps Script APIを呼び出す
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch products: ${response.status} - ${errorText}`);
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
      const errorText = await response.text();
      throw new Error(`Failed to update stock: ${response.status} - ${errorText}`);
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
if (request.url.includes("/api/sales-data")) {
  const salesData = { totalSales, salesData};
  return new Response(JSON.stringify(salesData), {
    headers: { "Content-Type": "application/json" },
  });
}

