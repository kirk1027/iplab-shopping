<<<<<<< HEAD
// Google Apps Script のエンドポイント
const API_URL = "https://script.google.com/macros/s/AKfycbzNMBBIPOo1ycU2hPXYYwwf2_oSumRKxX3M5z3VAM1jPM91Z2dj0KSZDH8h-LfwiIsQeQ/exec";
=======
// 定義: 消費金額
const expenses = 20000; // 後で修正する場合はここを変更
>>>>>>> parent of 172e70f (精算ボタン)

// 売り上げデータを取得して表示
async function fetchSalesData() {
  try {
    // 在庫データをGoogle Apps Scriptから取得
    const inventoryRes = await fetch('https://script.google.com/macros/s/AKfycbySEJBai_l09TjkkEKtSlwvqGwT548BXioPPcsTk9qW9VzUxwbDupnNS4oPrEc_rGmbnQ/exec'); // URLをGoogle Apps ScriptのWebアプリURLに設定
    const inventory = await inventoryRes.json();
    console.log(inventory); // デバッグ用: 在庫データを確認

    // 売り上げデータをサーバーから取得
    const res = await fetch('/api/sales-data'); // サーバーから売り上げデータを取得
    if (!res.ok) {
      throw new Error(`Error fetching sales data: ${res.statusText}`);
    }
    const { totalSales, salesData } = await res.json();

    // 合計金額と収支を計算
    const balance = totalSales - expenses;

<<<<<<< HEAD
    // 売上・支出・収支の更新
    const balance = totalSales - totalExpenses;
    document.getElementById("total-sales").textContent = `売上の合計金額: ¥${totalSales}`;
    document.getElementById("expenses").textContent = `消費金額: ¥${totalExpenses}`;
    document.getElementById("balance").textContent = `収支: ¥${balance}`;

    // 購入商品一覧の更新
    const salesTableBody = document.querySelector("#sales-table tbody");
    salesTableBody.innerHTML = ""; // テーブルをリセット

    purchasedItems.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.date}</td>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>¥${item.totalPrice}</td>
      `;
      salesTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Failed to fetch sales data:", error);
    alert("売り上げデータの取得に失敗しました。再試行してください。");
=======
    // 合計金額、消費金額、収支を表示
    document.getElementById('total-sales').textContent = `売上の合計金額: ¥${totalSales}`;
    document.getElementById('expenses').textContent = `消費金額: ¥${expenses}`;
    const balanceElement = document.getElementById('balance');
    balanceElement.textContent = `収支: ${balance >= 0 ? `+¥${balance}` : `¥${balance}`}`;
    balanceElement.style.color = balance >= 0 ? 'black' : 'red';
    balanceElement.style.fontWeight = balance >= 0 ? 'bold' : 'normal';

    // 売り上げデータを表に表示
    const salesTable = document.getElementById('sales-table');
    salesTable.innerHTML = '<tr><th>商品名</th><th>購入個数</th></tr>'; // ヘッダーを作成
    salesData.forEach(sale => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${sale.name}</td><td>${sale.quantity}</td>`;
      salesTable.appendChild(row);
    });
  } catch (error) {
    console.error(error);
    alert('売り上げデータの取得に失敗しました。');
>>>>>>> parent of 172e70f (精算ボタン)
  }
}

// 初回実行
fetchSalesData();
