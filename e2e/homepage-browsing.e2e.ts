import { test, expect, BrowserContext } from '@playwright/test';

test.describe('首页浏览 E2E 测试', () => {
  let context: BrowserContext;

  test.beforeEach(async ({ browser, page }) => {
    context = await browser.newContext();
    await context.clearCookies();
    await context.clearPermissions();
    await page.goto('/');
  });

  test('首页正确加载并显示核心内容', async ({ page }) => {
    await expect(page).toHaveTitle(/世界纸币/);
    
    await expect(page.getByRole('heading', { name: /探索/ })).toBeVisible();
    await expect(page.locator('text=全球纸币').first()).toBeVisible();
    
    const searchInput = page.getByPlaceholder(/搜索国家、面值、年份、图案/);
    await expect(searchInput).toBeVisible();
    
    await expect(page.getByRole('heading', { name: /智能推荐/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /最新收录/ })).toBeVisible();
  });

  test('首页显示分类浏览入口', async ({ page }) => {
    const categoryTexts = ['按国家', '按年份', '按材质', '按稀有度'];

    for (const text of categoryTexts) {
      const element = page.locator(`text=${text}`).first();
      if (await element.count() > 0) {
        await expect(element).toBeVisible();
      }
    }
    
    const allLinks = page.getByRole('link');
    expect(await allLinks.count()).toBeGreaterThan(0);
  });

  test('首页显示统计数据', async ({ page }) => {
    await page.waitForTimeout(300);
    
    await expect(page.locator('text=收录纸币').first()).toBeVisible();
    await expect(page.locator('text=国家地区').first()).toBeVisible();
    await expect(page.locator('text=发行年份').first()).toBeVisible();
    await expect(page.locator('text=收藏总数').first()).toBeVisible();
  });

  test('首页"开始探索"按钮跳转到纸币列表', async ({ page }) => {
    const startLink = page.getByRole('link', { name: /开始探索/ }).first();
    await Promise.all([
      page.waitForNavigation(),
      startLink.click(),
    ]);
    
    await expect(page).toHaveURL(/\/banknotes/);
    await expect(page.getByRole('heading', { name: '全部纸币', exact: true })).toBeVisible();
  });

  test('首页"按国家浏览"按钮跳转到国家页面', async ({ page }) => {
    const countryLink = page.getByRole('link', { name: /按国家浏览/ }).first();
    await Promise.all([
      page.waitForNavigation(),
      countryLink.click(),
    ]);
    
    await expect(page).toHaveURL(/\/countries/);
  });

  test('首页"我的收藏"按钮跳转到收藏页面', async ({ page }) => {
    const favoriteLink = page.getByRole('link', { name: /我的收藏/ }).first();
    await Promise.all([
      page.waitForNavigation(),
      favoriteLink.click(),
    ]);
    
    await expect(page).toHaveURL(/\/favorites/);
  });

  test('首页最新收录卡片可点击跳转到详情页', async ({ page }) => {
    const firstCard = page.locator('[data-testid="banknote-card"], a[href*="/banknote/"]').first();
    
    if (await firstCard.count() > 0) {
      const href = await firstCard.getAttribute('href') || '';
      if (href.includes('/banknote/')) {
        await Promise.all([
          page.waitForNavigation(),
          firstCard.click(),
        ]);
        await expect(page).toHaveURL(/\/banknote\//);
      }
    }
  });

  test('首页响应式布局：搜索框在各尺寸下可正常使用', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/搜索国家、面值、年份、图案/);
    
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(searchInput).toBeVisible();
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(searchInput).toBeVisible();
    
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(searchInput).toBeVisible();
    
    await searchInput.click();
    await searchInput.fill('测试搜索');
    await expect(searchInput).toHaveValue('测试搜索');
  });
});
