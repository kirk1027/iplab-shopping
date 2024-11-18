const express = require('express'); // Expressを使ってサーバーを作成
const bodyParser = require('body-parser'); // JSONデータを処理するためのモジュール

const app = express(); // Expressアプリケーションを作成
app.use(express.static('public')); // 静的ファイル（HTML, CSS, JSなど）を`public`フォルダから提供
app.use(bodyParser.json()); // JSON形式のリクエストボディを解析

// 商品データ（名前、価格、在庫、画像パス）を定義
let products = [
  { id: 1, name: '水', price: 50, stock: 10, genre: 'drink', image: 'images/water.jpg' },
  { id: 2, name: 'チルアウト', price: 170, stock: 0, genre: 'drink', image: 'images/chillout.jpg' },
  { id: 3, name: 'コーラ（PET）', price: 100, stock: 0, genre: 'drink', image: 'images/cola_pet.jpg' },
  { id: 4, name: 'レッドブル（紫）', price: 100, stock: 10, genre: 'drink', image: 'images/redbull_purple.jpg' },
  { id: 5, name: 'レッドブル（黄）', price: 100, stock: 20, genre: 'drink', image: 'images/redbull_yellow.jpg' },
  { id: 6, name: 'カフェオレ', price: 100, stock: 0, genre: 'drink', image: 'images/cafe.jpg' },
  { id: 7, name: 'マッチ', price: 90, stock: 0, genre: 'drink', image: 'images/match.jpg' },
  { id: 8, name: 'ライフガード', price: 90, stock: 0, genre: 'drink', image: 'images/lifeguard.jpg' },
  { id: 9, name: 'アクエリアス', price: 90, stock: 0, genre: 'drink', image: 'images/aquarius.jpg' },
  { id: 10, name: 'ポカリスエット', price: 90, stock: 0, genre: 'drink', image: 'images/pocarisweat.jpg' },
  { id: 11, name: 'コーヒー（PET）', price: 90, stock: 0, genre: 'drink', image: 'images/coffee_pet.jpg' },
  { id: 12, name: 'レモンティー', price: 80, stock: 0, genre: 'drink', image: 'images/lemontea.jpg' },
  { id: 13, name: 'オロナミンC', price: 80, stock: 0, genre: 'drink', image: 'images/oronaminc.jpg' },
  { id: 14, name: '水（2L）', price: 70, stock: 0, genre: 'drink', image: 'images/water_2l.jpg' },
  { id: 15, name: 'コーラ（缶）', price: 60, stock: 0, genre: 'drink', image: 'images/cola_can.jpg' },
  { id: 16, name: 'ジンジャーエール（缶）', price: 60, stock: 0, genre: 'drink', image: 'images/gingerale.jpg' },
  { id: 17, name: 'ファンタグレープ（缶）', price: 60, stock: 0, genre: 'drink', image: 'images/fanta_grape.jpg' },
  { id: 18, name: 'ファンタオレンジ（缶）', price: 60, stock: 0, genre: 'drink', image: 'images/fanta_orange.jpg' },
  { id: 19, name: 'お茶', price: 50, stock: 0, genre: 'drink', image: 'images/tea.jpg' },
  { id: 20, name: '春雨スープ', price: 50, stock: 0, genre: 'drink', image: 'images/harusame.jpg' },
  { id: 21, name: 'ジャッキーカルパス（1袋）', price: 280, stock: 0, genre: 'snack', image: 'images/calpas.jpg' },
  { id: 22, name: 'カロリーメイト（チョコ）', price: 150, stock: 0, genre: 'snack', image: 'images/caloriemate_chocolate.jpg' },
  { id: 23, name: 'カロリーメイト（バニラ）', price: 150, stock: 0, genre: 'snack', image: 'images/caloriemate_vanilla.jpg' },
  { id: 24, name: 'カロリーメイト（メープル）', price: 150, stock: 0, genre: 'snack', image: 'images/caloriemate_maple.jpg' },
  { id: 25, name: 'カロリーメイト（チーズ）', price: 150, stock: 0, genre: 'snack', image: 'images/caloriemate_cheeze.jpg' },
  { id: 26, name: 'カロリーメイト（フルーツ）', price: 150, stock: 0, genre: 'snack', image: 'images/caloriemate_fruit.jpg' },
  { id: 27, name: 'チョコアイスバー', price: 120, stock: 0, genre: 'snack', image: 'images/chocoice.jpg' },
  { id: 28, name: 'じゃがりこ', price: 100, stock: 10, genre: 'snack', image: 'images/jagarico.jpg' },
  { id: 29, name: 'jagabee', price: 100, stock: 0, genre: 'snack', image: 'images/jagabee.jpg' },
  { id: 30, name: 'バームクーヘン', price: 90, stock: 0, genre: 'snack', image: 'images/baumkuchen.jpg' },
  { id: 31, name: 'ナッツ', price: 80, stock: 0, genre: 'snack', image: 'images/nut.jpg' },
  { id: 32, name: 'ポッキー', price: 60, stock: 0, genre: 'snack', image: 'images/pocky.jpg' },
  { id: 33, name: '柿の種', price: 50, stock: 0, genre: 'snack', image: 'images/kakinotane.jpg' },
  { id: 34, name: 'アルフォート（4個）', price: 50, stock: 0, genre: 'snack', image: 'images/alfort.jpg' },
  { id: 35, name: 'たけのこの里（2個）', price: 50, stock: 10, genre: 'snack', image: 'images/takenoko.jpg' },
  { id: 36, name: 'HARIBO（3袋）', price: 50, stock: 0, genre: 'snack', image: 'images/haribo.jpg' },
  { id: 37, name: 'ブラウニー', price: 50, stock: 0, genre: 'snack', image: 'images/brownie.jpg' },
  { id: 38, name: 'オレオ（2枚）', price: 50, stock: 0, genre: 'snack', image: 'images/oreo.jpg' },
  { id: 39, name: 'キットカット（2枚）', price: 50, stock: 0, genre: 'snack', image: 'images/kitkat.jpg' },
  { id: 40, name: 'フェレロ', price: 40, stock: 0, genre: 'snack', image: 'images/ferrero.jpg' },
  { id: 41, name: 'ドーナツ', price: 40, stock: 0, genre: 'snack', image: 'images/donut.jpg' },
  { id: 42, name: 'チチヤスヨーグルト', price: 40, stock: 0, genre: 'snack', image: 'images/yogurt.jpg' },
  { id: 43, name: 'ハッピーターン', price: 40, stock: 0, genre: 'snack', image: 'images/happyturn.jpg' },
  { id: 44, name: 'ブラックサンダー（2個）', price: 30, stock: 0, genre: 'snack', image: 'images/blackthunder.jpg' },
  { id: 45, name: '歌舞伎揚（3個）', price: 30, stock: 0, genre: 'snack', image: 'images/kabukiage.jpg' },
  { id: 46, name: 'たべっ子どうぶつ', price: 30, stock: 0, genre: 'snack', image: 'images/tabekko.jpg' },
  { id: 47, name: 'ベビースター', price: 30, stock: 0, genre: 'snack', image: 'images/babystar.jpg' },
  { id: 48, name: 'アポロ（1袋）', price: 30, stock: 0, genre: 'snack', image: 'images/apollo.jpg' },
  { id: 49, name: 'スニッカーズ（2個）', price: 30, stock: 0, genre: 'snack', image: 'images/snickers.jpg' },
  { id: 50, name: 'ピノ', price: 30, stock: 0, genre: 'snack', image: 'images/pino.jpg' },
  { id: 51, name: 'ジャッキーカルパス（1本）', price: 20, stock: 0, genre: 'snack', image: 'images/calpas_1p.jpg' },
  { id: 52, name: 'バラエティラムネ（1個）', price: 20, stock: 0, genre: 'snack', image: 'images/ramune.jpg' },
  { id: 53, name: 'メルティーキッス', price: 15, stock: 0, genre: 'snack', image: 'images/meltykiss.jpg' },
  { id: 54, name: 'こんにゃくゼリー', price: 15, stock: 0, genre: 'snack', image: 'images/konnnyakujelly.jpg' },
  { id: 55, name: '明治チョコ', price: 10, stock: 0, genre: 'snack', image: 'images/meijichoko.jpg' },
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
