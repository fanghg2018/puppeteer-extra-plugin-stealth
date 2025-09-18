import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // 打开一个你知道有嵌套 iframe 的页面
  await page.goto('https://www.w3schools.com/tags/tryit.asp?filename=tryhtml_iframe', {
    waitUntil: 'networkidle0'
  });

  // 打印所有 Frame URL
  console.log('All Frames:');
  page.frames().forEach((f, i) => {
    console.log(i, f.url());
  });

  // 第一步：找到外层 iframe
  const outerFrame = page.frames().find(f => f.url().includes('tryit.asp'));
  if (!outerFrame) {
    console.log('Outer frame not found');
    await browser.close();
    return;
  }

  // 第二步：在外层 Frame 中找到内层 iframe
  // 方法1：直接用 outerFrame.childFrames()（puppeteer24 有）
  const innerFrame = outerFrame.childFrames().find(f => f.url().includes('topics_frame.html'));

  if (innerFrame) {
    // 获取内层 iframe 的标题
    const title = await innerFrame.evaluate(() => document.title);
    console.log('Inner frame title:', title);
  } else {
    console.log('Inner frame not found');
  }

  await browser.close();
})();
