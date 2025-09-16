import puppeteer from 'puppeteer';
import XLSX from 'xlsx';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  // 模拟正常浏览器 UA
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  await page.goto('https://www.taobao.com', { waitUntil: 'domcontentloaded' });

  // 自动滚动到底部
  const autoScroll = async () => {
    await page.evaluate(async () => {
      await new Promise(resolve => {
        let totalHeight = 0;
        const distance = 400;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight - window.innerHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 500);
      });
    });
  };

  console.log('开始自动翻页...');
  await autoScroll();
  console.log('已经滚动到底部！');

  // 抓取宝贝标题和价格
  const items = await page.$$eval('.tb-pick-content-item', els =>
    els.map(el => {
      const title = el.querySelector('.info-wrapper-title-text')?.innerText.trim() || '';
      const price = el.querySelector('.price-value')?.innerText.trim() || '';
      return { title, price };
    }).filter(item => item.title) // 只保留有标题的
  );

  console.log(`抓到 ${items.length} 个宝贝`);
  console.log(items.slice(0, 10));

  // =====================
  // 导出 Excel
  // =====================
  const worksheet = XLSX.utils.json_to_sheet(items);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '淘宝宝贝');
  XLSX.writeFile(workbook, 'taobao_items.xlsx');

  console.log('已导出 taobao_items.xlsx');

  await sleep(3000);
  await browser.close();
})();
