const express = require('express'); // Expressを使ってサーバーを作成
const bodyParser = require('body-parser'); // JSONデータを処理するためのモジュール

const app = express(); // Expressアプリケーションを作成
app.use(express.static('public')); // 静的ファイル（HTML, CSS, JSなど）を`public`フォルダから提供
app.use(bodyParser.json()); // JSON形式のリクエストボディを解析

// 商品データ（名前、価格、在庫、画像パス）を定義
let products = [
  { id: 1, name: 'Product A', price: 1000, stock: 10, image: 'images/product-a.jpg' },
  { id: 2, name: 'Product B', price: 2000, stock: 5, image: 'images/product-b.jpg' },
  { id: 3, name: 'Product C', price: 1500, stock: 8, image: 'images/product-c.jpg' },
  { id: 3, name: 'Product C', price: 1500, stock: 8, image: 'images/product-c.jpg' },
  { id: 3, name: 'Product C', price: 1500, stock: 8, image: 'images/product-c.jpg' },
  { id: 3, name: 'Product C', price: 1500, stock: 8, image: 'images/product-c.jpg' },
  { id: 3, name: 'Product C', price: 1500, stock: 8, image: 'images/product-c.jpg' },
  { id: 3, name: 'Product C', price: 1500, stock: 8, image: 'images/product-c.jpg' },
  { id: 3, name: 'Product C', price: 1500, stock: 8, image: 'images/product-c.jpg' },
  { id: 3, name: 'Product C', price: 1500, stock: 8, image: 'images/product-c.jpg' },
  { id: 3, name: 'Product C', price: 1500, stock: 8, image: 'images/product-c.jpg' },
];

// メインページのHTMLを返す（`views/index.html`が表示される）
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// 商品情報をフロントエンドに提供するAPI
app.get('/api/products', (req, res) => {
  res.json(products); // 商品データをJSON形式で返す
});

// 商品購入時に在庫を更新するAPI
app.post('/api/purchase', (req, res) => {
  const { id, quantity } = req.body; // リクエストから商品IDと購入数量を取得
  const product = products.find(p => p.id === id); // 該当する商品を検索

  if (product && product.stock >= quantity) {
    // 在庫が十分ある場合は在庫を減らす
    product.stock -= quantity;
    res.json({ success: true, message: 'Purchase successful!', product });
  } else {
    // 在庫が足りない場合はエラーメッセージを返す
    res.json({ success: false, message: 'Not enough stock!' });
  }
});

console.log(`Visit the application at http://localhost:${PORT} (or the Render-provided URL)`);

// 以下，売り上げ関連
// 売り上げデータページのHTMLを返す
app.get('/sales', (req, res) => {
    res.sendFile(__dirname + '/views/sales.html');
});

// 売り上げデータを保存する配列
let salesData = [];
let totalSales = 0; // 売り上げの合計金額

// 売り上げを記録するAPI
app.post('/api/record-sale', (req, res) => {
  const { name, quantity, price } = req.body;
  const saleAmount = price * quantity;

  // 売り上げを保存
  salesData.push({ name, quantity, price });
  totalSales += saleAmount;

  res.json({ success: true, totalSales });
});

// 売り上げデータを提供するAPI
app.get('/api/sales-data', (req, res) => {
  res.json({ totalSales, salesData });
});

// サーバーを起動
const PORT = process.env.PORT || 3000; // Render環境ではPORTを環境変数から取得
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
