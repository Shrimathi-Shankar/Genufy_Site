import { chromium } from 'playwright';
import { join } from 'path';
import { fileURLToPath } from 'url';

const SCRATCHPAD = 'C:\\Users\\shrim\\AppData\\Local\\Temp\\claude\\c--Users-shrim-Desktop-Copy-Website\\bf4de11e-c0d3-4dff-b307-459aec6bfac3\\scratchpad';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3000');
await page.waitForTimeout(3000);

for (let y = 1500; y <= 5500; y += 300) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await page.waitForTimeout(800);
  const filePath = join(SCRATCHPAD, `scroll_${y}.png`);
  await page.screenshot({ path: filePath, fullPage: false });
  console.log(`Saved: scroll_${y}.png`);
}

await browser.close();
console.log('Done!');
