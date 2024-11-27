// 定義: 消費金額
const expenses = 20000; // 後で修正する場合はここを変更

// 売り上げデータを取得して表示
async function fetchSalesData() {
  try {
    // 在庫データをGoogle Apps Scriptから取得
    const inventoryRes = await fetch('https://script.google.com/a/macros/iplab.cs.tsukuba.ac.jp/s/AKfycbyY-dC--5YGPy7wg7R4A1r8RQnnCCjh6ATyfFnfBd3mbSjlonbztzRxLYRHMAoRo6RWZg/exec'); // URLをGoogle Apps ScriptのWebアプリURLに設定
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
  }
}

// 初回実行
fetchSalesData();
