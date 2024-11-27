// Cloudflare WorkersのAPI URL（必ず正しいURLに置き換えてください）
const API_BASE_URL = "https://5d4712d8.iplab-shopping.pages.dev";

// カート情報を保持する配列
let cart = [];

// 商品データを取得して画面に表示
async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`); // Cloudflare Workersのエンドポイントを呼び出す
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }
    const products = await res.json(); // 商品データを取得
    console.log(products); // デバッグ用: 商品データを確認

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
  } catch (error) {
    console.error('Fetch error:', error);
    alert('商品データの取得に失敗しました。');
  }
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

// カートを精算
async function checkout() {
  if (cart.length === 0) {
    alert('カートが空です！');
    return;
  }

  try {
    // カート内の商品をCloudflare WorkersのAPIに送信
    for (const item of cart) {
      const res = await fetch(`${API_BASE_URL}/api/update-stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, quantity: item.quantity }),
      });
      const result = await res.json();
      if (!result.success) {
        alert(`エラー: ${result.message}`);
        return;
      }
    }

    alert('精算が完了しました！');
    cart = []; // カートを空にする
    updateCartPopup(); // ポップアップをリセット
    fetchProducts(); // 商品データを再取得して更新
  } catch (error) {
    console.error(error);
    alert('精算中にエラーが発生しました。');
  }
}

// 初期化処理
fetchProducts();
document.getElementById('fixed-checkout-button').addEventListener('click', checkout);
