const express = require('express'); // Expressを使ってサーバーを作成
const bodyParser = require('body-parser'); // JSONデータを処理するためのモジュール
const products = require('./products'); // 商品データをインポート

const app = express(); // Expressアプリケーションを作成
app.use(express.static('public')); // 静的ファイル（HTML, CSS, JSなど）を`public`フォルダから提供
app.use(bodyParser.json()); // JSON形式のリクエストボディを解析

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

// PayPay支払い完了ページ
app.get('/paypay-success', (req, res) => {
    res.send('<h1>PayPayでの支払いが完了しました！</h1><a href="/">購入ページに戻る</a>');
});
  
// PayPay支払い失敗ページ
app.get('/paypay-failure', (req, res) => {
    res.send('<h1>PayPayでの支払いに失敗しました。</h1><a href="/">購入ページに戻る</a>');
});  

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

  // 在庫を更新
  const product = products.find(p => p.name === name); // 名前で商品を検索
  if (product) {
    if (product.stock >= quantity) {
      product.stock -= quantity; // 在庫を減らす
    } else {
      return res.status(400).json({ success: false, message: '在庫が足りません！' });
    }
  } else {
    return res.status(404).json({ success: false, message: '商品が見つかりません！' });
  }

  res.json({ success: true, totalSales });
});

// 売り上げデータを提供するAPI
app.get('/api/sales-data', (req, res) => {
  res.json({ totalSales, salesData });
});

// PORTの定義を最初に行う
const PORT = process.env.PORT || 3000;

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit the application at http://localhost:${PORT} (or the Render-provided URL)`);
});
