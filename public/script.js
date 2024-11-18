// カート情報を保持する配列
let cart = [];

// 商品データを取得して画面に表示
async function fetchProducts() {
    const res = await fetch('/api/products'); // サーバーから商品データを取得
    const products = await res.json(); // JSON形式でデータを取得
  
    // 商品データを在庫がある商品とない商品に分ける
    const availableProducts = products.filter(product => product.stock > 0); // 在庫がある商品
    const unavailableProducts = products.filter(product => product.stock === 0); // 在庫がない商品
  
    const drinkList = document.getElementById('drink-list'); // ドリンクリストの表示エリア
    const snackList = document.getElementById('snack-list'); // スナックリストの表示エリア
  
    drinkList.innerHTML = ''; // ドリンクリストをリセット
    snackList.innerHTML = ''; // スナックリストをリセット
  
    // 在庫がある商品を先に表示
    const sortedProducts = [...availableProducts, ...unavailableProducts]; // 在庫がある商品を前に結合
  
    // 商品ごとにHTML要素を作成
    sortedProducts.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.className = 'product';
      productDiv.style.backgroundColor = product.stock === 0 ? '#f0f0f0' : 'white'; // 在庫がない商品の背景色を暗くする
  
      productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}" width="100%"> <!-- 商品画像 -->
        <h3>${product.name}</h3> <!-- 商品名 -->
        <p>Price: ¥${product.price}</p> <!-- 価格 -->
        <p>Stock: ${product.stock}</p> <!-- 在庫 -->
        <select id="quantity-${product.id}" ${product.stock === 0 ? 'disabled' : ''}> <!-- 購入数を選択するプルダウン -->
          ${[...Array(product.stock).keys()].map(i => `<option value="${i + 1}">${i + 1}</option>`).join('')}
        </select>
        <!-- カートに入れるボタン -->
        <button 
          onclick="addToCart(${product.id}, '${product.name}', ${product.price})" 
          ${product.stock === 0 ? 'disabled style="background-color: #ccc; cursor: not-allowed;"' : ''}>
          カートに入れる
        </button>
      `;

      // ジャンルごとにリストに追加
      if (product.genre === 'drink') {
          drinkList.appendChild(productDiv);
      } else if (product.genre === 'snack') {
          snackList.appendChild(productDiv);
      }
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
    fetchProducts();
});
  
// 初回実行時に商品データを取得して表示
fetchProducts();
