import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // 可以看到浏览器
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // 打开一个有 iframe 的测试页
  await page.goto('https://www.w3schools.com/html/html_iframe.asp', {
    waitUntil: 'networkidle0',
  });

  // 打印所有 Frame 的 URL
  const frames = page.frames();
  console.log('Frames on this page:');
  frames.forEach((frame, index) => {
    console.log(`${index}: ${frame.url()}`);
  });

  // 找到我们想操作的 iframe
  // 这个页面有一个 iframe 指向 https://www.w3schools.com
  const myFrame = frames.find(frame => frame.url().includes(`www.w3schools.com/html/default.asp`));

  if (myFrame) {
    console.log('Found target iframe:', myFrame.url());

    // 在 iframe 中抓取标题
    const title = await myFrame.evaluate(() => document.title);
    console.log('Iframe title:', title);

    // 也可以抓取 iframe 中某个元素的文本
    // 这里以 iframe 中的 h1 标签为例
    const h1Text = await myFrame.$eval('h1', el => el.innerText);
    console.log('Iframe h1:', h1Text);
  } else {
    console.log('No matching iframe found.');
  }

  await browser.close();
})();
