import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,           // 显示浏览器窗口
    defaultViewport: null
  });

  // 打开第一个页面
  const page1 = await browser.newPage();
  await page1.goto('https://www.baidu.com');
  const title1 = await page1.title();
  console.log('第一个页面标题:', title1);

  // 打开第二个页面
  const page2 = await browser.newPage();
  await page2.goto('https://www.bing.com');
  const title2 = await page2.title();
  console.log('第二个页面标题:', title2);

  // 也可以同时获取所有已打开的页面
  const pages = await browser.pages();
  console.log('当前标签页数量:', pages.length);

  // 在第二个页面执行一段 JS
  const searchBoxSelector = '#sw_as';
  await page2.type(searchBoxSelector, 'puppeteer 多页面示例', { delay: 300 });
  await page2.keyboard.press('Enter', { delay: 300 });

  // 等几秒看效果
  await new Promise(res => setTimeout(res, 5000));

  // await browser.close();
})();
