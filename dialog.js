import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null
});
const page = await browser.newPage();

page.on('dialog', async dialog => {
  console.log('弹窗类型:', dialog.type());
  console.log('弹窗消息:', dialog.message());

  if (dialog.type() === 'alert') {
    await dialog.accept();
  } else if (dialog.type() === 'confirm') {
    await dialog.dismiss();
  } else if (dialog.type() === 'prompt') {
    await dialog.accept('自动输入的内容');
  } else {
    await dialog.accept();
  }
});

await page.goto('about:blank');

await page.evaluate(() => {
  alert('这是一个 alert 弹窗');
});
await page.evaluate(() => {
  confirm('这是一个 confirm 弹窗');
});
await page.evaluate(() => {
  prompt('这是一个 prompt 弹窗', '默认值');
});

// ✅ 现在用这个代替 waitForTimeout
await new Promise(resolve => setTimeout(resolve, 3000));

await browser.close();
