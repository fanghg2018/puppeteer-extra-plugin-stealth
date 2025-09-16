// amazon_search.js

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());



(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const page = await browser.newPage();

  // 模拟正常用户 UA 和语言
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) ' +
    'Chrome/120.0.0.0 Safari/537.36'
  );
  await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.9'
  });

  console.log("正在打开 Amazon...");
  await page.goto('https://www.amazon.com', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // 检测是否出现验证页面
  try {
    await page.waitForSelector('.a-button-text', { timeout: 5000 });
    console.log("检测到 Amazon 验证页面，尝试点击按钮...");
    await page.click('.a-button-text');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
  } catch (e) {
    console.log("未检测到验证页面，继续执行...");
  }

  // 等待搜索框出现
  await page.waitForSelector('#twotabsearchtextbox', { timeout: 5000 });

  // 输入关键词，例如 "laptop"
  const keyword = "花卉";
  await page.type('#twotabsearchtextbox', keyword, { delay: 120 }); // 模拟真人逐字输入
  await page.keyboard.press('Enter');

  console.log(`正在搜索: ${keyword}`);
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

  // 模拟滚动，避免被识别为机器人
  await sleep(2000);
  await page.evaluate(() => window.scrollBy(0, window.innerHeight / 2));
  await sleep(1000);

  // 抓取结果标题
  const titles = await page.$$eval(
    'a h2  span',
    elements => elements.map(el => el.textContent.trim())
  );

  console.log("商品标题：");
  titles.forEach((t, i) => console.log(`${i + 1}. ${t}`));





  // await sleep(5000);
  // await browser.close();
})();
