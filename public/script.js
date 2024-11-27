// Google Apps Script のエンドポイントURL
const API_URL = "https://script.google.com/macros/s/AKfycbzNMBBIPOo1ycU2hPXYYwwf2_oSumRKxX3M5z3VAM1jPM91Z2dj0KSZDH8h-LfwiIsQeQ/exec";

// カート情報を保持する配列
let cart = [];

// 商品データを取得して画面に表示
async function fetchProducts() {
  try {
    // Google Apps Script からデータを取得
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    const products = await response.json();

    console.log(products); // デバッグ用: 商品データを確認

    // 商品データを在庫がある商品とない商品に分ける
    const availableProducts = products.filter(product => product.在庫 > 0);
    const unavailableProducts = products.filter(product => product.在庫 === 0);

    const drinkList = document.getElementById("drink-list");
    const snackList = document.getElementById("snack-list");

    drinkList.innerHTML = ""; // ドリンクリストをリセット
    snackList.innerHTML = ""; // スナックリストをリセット

    // 在庫がある商品を先に表示
    const sortedProducts = [...availableProducts, ...unavailableProducts];

    // 商品ごとにHTML要素を作成
    sortedProducts.forEach(product => {
      const productDiv = document.createElement("div");
      productDiv.className = "product";
      productDiv.style.backgroundColor = product.在庫 === 0 ? "#f0f0f0" : "white"; // 在庫なしは暗く表示

      productDiv.innerHTML = `
        <img src="${product.画像URL || 'default.jpg'}" alt="${product.商品名}" width="100%"> <!-- 商品画像 -->
        <h3>${product.商品名}</h3> <!-- 商品名 -->
        <p>Price: ¥${product.価格}</p> <!-- 価格 -->
        <p>Stock: ${product.在庫}</p> <!-- 在庫 -->
        <select id="quantity-${product['商品 ID']}" ${product.在庫 === 0 ? "disabled" : ""}> <!-- 購入数を選択 -->
          ${[...Array(product.在庫).keys()].map(i => `<option value="${i + 1}">${i + 1}</option>`).join("")}
        </select>
        <button 
          onclick="addToCart(${product['商品 ID']}, '${product.商品名}', ${product.価格})" 
          ${product.在庫 === 0 ? "disabled style='background-color: #ccc; cursor: not-allowed;'" : ""}>
          カートに入れる
        </button>
      `;

      // ジャンルごとにリストに追加
      if (product.ジャンル === "drink") {
        drinkList.appendChild(productDiv);
      } else if (product.ジャンル === "snack") {
        snackList.appendChild(productDiv);
      }
    });
  } catch (error) {
    console.error("Fetch error:", error);
    alert("商品データの取得に失敗しました。");
  }
}

// カートに商品を追加
function addToCart(productId, productName, productPrice) {
  const quantity = parseInt(document.getElementById(`quantity-${productId}`).value, 10);

  // カート内に同じ商品があるか確認
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: productId, name: productName, price: productPrice, quantity });
  }

  alert(`${productName}を${quantity}個カートに追加しました！`);
  updateCartPopup();
}

// カートの内容を更新
function updateCartPopup() {
  const cartItemsList = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");

  cartItemsList.innerHTML = ""; // リストをリセット
  let totalPrice = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.quantity} - ¥${item.price * item.quantity}`;
    cartItemsList.appendChild(li);

    totalPrice += item.price * item.quantity;
  });

  totalPriceElement.textContent = `合計金額: ¥${totalPrice}`;
}

<<<<<<< HEAD
// 現金ボタンの処理
async function processPayment() {
  if (cart.length === 0) {
    alert("カートが空です！");
    return;
  }

  try {
    let cartTotal = 0;
    const soldItems = cart.map(item => {
      const totalPrice = item.price * item.quantity;
      cartTotal += totalPrice;
  
      // 商品在庫を減少
      const product = products.find(p => p["商品 ID"] === item.id);
      if (product) {
        product.在庫 -= item.quantity; // 在庫減少
      }
  
      return {
        name: item.name,
        quantity: item.quantity,
        totalPrice: totalPrice
      };
    });
  
    // 在庫データを更新
    const stockUpdateResponse = await fetch(`${API_URL}/update-stock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products })
    });
  
    if (!stockUpdateResponse.ok) {
      throw new Error(`Failed to update stock: ${stockUpdateResponse.status}`);
    }
  } catch (error) {
    console.error("Error updating stock:", error);
    alert("在庫更新中にエラーが発生しました。");
  }  
}



// 初期化処理
fetchProducts(); // 商品データを取得して表示
document.getElementById("cash-button").addEventListener("click", processPayment);
=======
// 初期化処理
fetchProducts(); // 商品データを取得して表示
>>>>>>> parent of 172e70f (精算ボタン)
