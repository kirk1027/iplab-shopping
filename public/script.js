// カート情報を保持する配列
let cart = [];

// 商品データを取得して画面に表示
async function fetchProducts() {
  const res = await fetch('/api/products'); // サーバーから商品データを取得
  const products = await res.json(); // JSON形式でデータを取得

  const productList = document.getElementById('product-list'); // 商品リストの表示エリアを取得
  productList.innerHTML = ''; // 表示をリセット

  // 商品ごとにHTML要素を作成
  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}" width="100%"> <!-- 商品画像 -->
      <h3>${product.name}</h3> <!-- 商品名 -->
      <p>Price: ¥${product.price}</p> <!-- 価格 -->
      <p>Stock: ${product.stock}</p> <!-- 在庫 -->
      <select id="quantity-${product.id}"> <!-- 購入数を選択するプルダウン -->
        ${[...Array(product.stock).keys()].map(i => `<option value="${i + 1}">${i + 1}</option>`).join('')}
      </select>
      <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">カートに入れる</button> <!-- カートに入れるボタン -->
    `;
    productList.appendChild(productDiv); // 商品をリストに追加
  });
}

// カートに商品を追加
function addToCart(productId, productName, productPrice) {
  const quantity = parseInt(document.getElementById(`quantity-${productId}`).value, 10); // 選択された数量を取得

  // カート内に同じ商品が既に存在するか確認
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity; // 既存商品の数量を増やす
  } else {
    // 新しい商品をカートに追加
    cart.push({ id: productId, name: productName, price: productPrice, quantity });
  }

  alert(`${productName}を${quantity}個カートに追加しました！`);
  updateCartPopup(); // ポップアップを更新
}

// カートポップアップを更新
function updateCartPopup() {
  const cartItemsList = document.getElementById('cart-items'); // カート内の商品リスト
  const totalPriceElement = document.getElementById('total-price'); // 合計金額を表示する要素

  cartItemsList.innerHTML = ''; // リストをリセット
  let totalPrice = 0;

  cart.forEach(item => {
    // 各商品の表示を作成
    const li = document.createElement('li');
    li.textContent = `${item.name} x${item.quantity} - ¥${item.price * item.quantity}`;
    cartItemsList.appendChild(li);

    // 合計金額を計算
    totalPrice += item.price * item.quantity;
  });

  totalPriceElement.textContent = `合計金額: ¥${totalPrice}`;
}

// 常に表示される精算ボタンの処理
document.getElementById('fixed-checkout-button').addEventListener('click', () => {
    const popup = document.getElementById('popup');
    if (cart.length === 0) {
      alert('カートが空です！');
      return;
    }
  
    updateCartPopup(); // ポップアップの内容を更新
    popup.classList.remove('hidden'); // ポップアップを表示
});
  
// ポップアップ内の精算ボタンの処理
document.getElementById('checkout-button').addEventListener('click', () => {
    if (cart.length === 0) {
      alert('カートが空です！');
      return;
    }

    // サーバーに売り上げデータを送信
    cart.forEach(item => {
      fetch('/api/record-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: item.name, quantity: item.quantity, price: item.price })
      }).then(res => {
        if (!res.ok) {
          return res.json().then(data => alert(data.message || 'エラーが発生しました'));
        }
      }).catch(err => alert('エラーが発生しました: ' + err.message));
    });
  
    alert('精算が完了しました！');
    cart = []; // カートを空にする
    updateCartPopup(); // ポップアップをリセット
    document.getElementById('popup').classList.add('hidden'); // ポップアップを閉じる
    // 商品データを更新
    fetchProducts();
});
