import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();


// 把页面console输出映射到Node.js终端
page.on('console', msg => {
  console.log('页面console:', msg.text());
});

// 监听 dialog 弹窗
page.on('dialog', async dialog => {
  console.log('弹窗类型:', dialog.type());
  console.log('弹窗消息:', dialog.message());
  console.log('默认值:', dialog.defaultValue());

  if (dialog.type() === 'prompt') {
    // 在 prompt 输入框自动填入文本并点击“确定”
    await dialog.accept('我自动填的内容');
  } else {
    await dialog.accept();
  }
});

// 打开空白页并在页面内触发 prompt
await page.goto('about:blank');

await page.evaluate(() => {
  // 弹出 prompt 并把返回值打印到控制台
  const val = prompt('请输入点什么：', '默认值');
  console.log('用户在 prompt 输入的内容是:', val);
});

// 等待几秒看效果
await new Promise(resolve => setTimeout(resolve, 3000));

await browser.close();
