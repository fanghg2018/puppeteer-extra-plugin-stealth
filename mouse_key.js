import puppeteer from 'puppeteer';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto('https://example.com');

  // 注入“鼠标红点”
  await page.evaluate(() => {
    const dot = document.createElement('div');
    dot.id = 'puppeteer-mouse';
    dot.style.width = '12px';
    dot.style.height = '12px';
    dot.style.background = 'red';
    dot.style.borderRadius = '50%';
    dot.style.position = 'absolute';
    dot.style.zIndex = '99999';
    dot.style.pointerEvents = 'none';
    document.body.appendChild(dot);

    document.addEventListener('mousemove', e => {
      const el = document.getElementById('puppeteer-mouse');
      el.style.left = e.pageX + 'px';
      el.style.top = e.pageY + 'px';
    });
  });

  // 注入元素：按钮、拖拽框、输入框、显示区域
  await page.evaluate(() => {
    // 按钮
    const btn = document.createElement('button');
    btn.textContent = '点击我';
    btn.style.position = 'absolute';
    btn.style.left = '200px';
    btn.style.top = '200px';
    document.body.appendChild(btn);

    // 拖拽框
    const box = document.createElement('div');
    box.textContent = '拖拽框';
    box.style.position = 'absolute';
    box.style.left = '100px';
    box.style.top = '300px';
    box.style.width = '100px';
    box.style.height = '100px';
    box.style.backgroundColor = 'lightblue';
    document.body.appendChild(box);

    // 输入框 + 输出区域
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'puppeteer-input';
    input.placeholder = '在这里输入';
    input.style.position = 'absolute';
    input.style.left = '200px';
    input.style.top = '450px';
    input.style.width = '200px';
    document.body.appendChild(input);

    const output = document.createElement('div');
    output.id = 'typed-output';
    output.textContent = '实时显示输入：';
    output.style.position = 'absolute';
    output.style.left = '200px';
    output.style.top = '480px';
    output.style.fontSize = '16px';
    document.body.appendChild(output);

    input.addEventListener('input', e => {
      document.getElementById('typed-output').textContent = '实时显示输入：' + e.target.value;
    });
  });

  // =====================
  // 鼠标操作演示
  // =====================

  // 移动到按钮并点击
  await page.mouse.move(210, 210, { steps: 30 });
  await sleep(800);
  await page.mouse.click(210, 210);
  await sleep(1000);

  // 拖拽蓝色框
  await page.mouse.move(120, 320, { steps: 30 });
  await sleep(500);
  await page.mouse.down();
  await page.mouse.move(400, 400, { steps: 50 });
  await sleep(500);
  await page.mouse.up();
  await sleep(1000);

  // 滚动页面
  await page.mouse.wheel({ deltaY: 300 });
  await sleep(500);
  await page.mouse.wheel({ deltaY: -300 });
  await sleep(500);

  // =====================
  // 输入框操作演示
  // =====================


  // 让 Puppeteer 确保输入框获得焦点（两种写法都可以）
  // 1. 模拟点击输入框
  await page.click('#puppeteer-input');
  // 2. 或者用专用API
  // await page.focus('#puppeteer-input');

  // 慢速键盘输入
  await page.keyboard.type('Hello Puppeteer!', { delay: 200 });
  await sleep(1000);

  // 全选 + 删除
  await page.keyboard.down('Control');
  await page.keyboard.press('A');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await sleep(500);

  // 输入新文字
  await page.keyboard.type('这里是新输入的文字', { delay: 300 });
  await sleep(2000);

  // 按 Enter
  await page.keyboard.press('Enter');
  await sleep(1000);

  await browser.close();
})();
