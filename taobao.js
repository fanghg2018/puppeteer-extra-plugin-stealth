import puppeteer from 'puppeteer';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // 调试时看效果
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  // 伪造UA，降低反爬风险
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  // 打开淘宝首页
  await page.goto('https://www.taobao.com', { waitUntil: 'domcontentloaded' });

  // 自动滚动到底部
  const autoScroll = async () => {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
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

  console.log("开始自动翻页...");
  await autoScroll();
  console.log("已经滚动到底部！");

  // 抓取宝贝标题和价格
  const items = await page.evaluate(() => {
    const data = [];
    document.querySelectorAll('.tb-pick-content-item').forEach(el => {
      const titleEl = el.querySelector('.info-wrapper-title-text');
      const priceEl = el.querySelector('.price-value');
      const title = titleEl ? titleEl.innerText.trim() : '';
      const price = priceEl ? priceEl.innerText.trim() : '';
      if (title) {
        data.push({ title, price });
      }
    });
    return data;
  });

  console.log(`共抓到 ${items.length} 个宝贝`);
  console.log(items); // 只打印前20条看看

  await sleep(3000);
  // await browser.close();
})();
