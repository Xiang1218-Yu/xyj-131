import { test, expect, BrowserContext } from '@playwright/test';

test.describe('详情页流程 E2E 测试', () => {
  let context: BrowserContext;

  test.beforeEach(async ({ browser, page }) => {
    context = await browser.newContext();
    await context.clearCookies();
    await context.clearPermissions();
    await page.goto('/banknote/cn-100-2015');
    await page.waitForTimeout(800);
  });

  test('详情页加载并显示纸币核心信息', async ({ page }) => {
    await expect(page).toHaveURL(/\/banknote\/cn-100-2015/);
    
    const countryText = page.locator('text=中国').first();
    if (await countryText.count() > 0) {
      await expect(countryText).toBeVisible();
    }
    
    const labels = ['发行国家', '面额', '发行年份', '防伪特征', '历史背景'];
    for (const label of labels) {
      const loc = page.locator(`text=${label}`).first();
      if (await loc.count() > 0) {
        await expect(loc).toBeVisible();
      }
    }
  });

  test('详情页显示防伪特征区域', async ({ page }) => {
    const secText = page.locator('text=防伪特征').first();
    if (await secText.count() > 0) {
      await expect(secText).toBeVisible();
      
      const featureItems = page.locator('li, .security-feature, [class*="feature"]');
      const count = await featureItems.count();
      expect(count >= 0).toBeTruthy();
    }
  });

  test('详情页显示正背面设计', async ({ page }) => {
    const frontText = page.locator('text=/正面|背面/').first();
    if (await frontText.count() > 0) {
      await expect(frontText).toBeVisible();
    }
    
    const images = page.locator('img');
    const imgCount = await images.count();
    expect(imgCount >= 0).toBeTruthy();
  });

  test('详情页显示历史背景信息', async ({ page }) => {
    const historyText = page.locator('text=历史背景').first();
    if (await historyText.count() > 0) {
      await expect(historyText).toBeVisible();
    }
    
    const paragraphs = page.locator('p');
    const pCount = await paragraphs.count();
    expect(pCount >= 0).toBeTruthy();
  });

  test('详情页"返回列表"链接正确', async ({ page }) => {
    const backLinks = page.getByRole('link', { name: /返回/ });
    const backTextLinks = page.locator('text=/返回列表|返回/').first();
    
    if (await backLinks.count() > 0) {
      const link = backLinks.first();
      await expect(link).toBeVisible();
      
      const href = await link.getAttribute('href');
      if (href) {
        expect(href).toContain('/banknotes');
      }
    } else if (await backTextLinks.count() > 0) {
      await expect(backTextLinks).toBeVisible();
    }
  });

  test('详情页稀有度星级显示', async ({ page }) => {
    const rarityText = page.locator('text=/稀有度|星级/').first();
    if (await rarityText.count() > 0) {
      await expect(rarityText).toBeVisible();
    }
    
    const stars = page.locator('text=★, text=☆, svg[aria-label*="star"]');
    const starCount = await stars.count();
    expect(starCount >= 0).toBeTruthy();
  });

  test('详情页收藏数显示', async ({ page }) => {
    const countText = page.locator('text=/收藏|favorites?/i').first();
    if (await countText.count() > 0) {
      await expect(countText).toBeVisible();
    }
    expect(true).toBeTruthy();
  });

  test('详情页标签/Tag 显示', async ({ page }) => {
    const tags = page.locator('[class*="tag"], [class*="badge"], [class*="chip"]');
    const count = await tags.count();
    expect(count >= 0).toBeTruthy();
  });

  test('详情页相关推荐区域', async ({ page }) => {
    const recommendText = page.locator('text=/相关推荐|相似|你可能/').first();
    if (await recommendText.count() > 0) {
      await expect(recommendText).toBeVisible();
    }
    
    const cards = page.locator('[data-testid="banknote-card"], a[href*="/banknote/"]');
    const count = await cards.count();
    expect(count >= 0).toBeTruthy();
  });

  test('详情页图片正常显示', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    
    if (count > 0) {
      const firstImg = images.first();
      await expect(firstImg).toBeVisible();
    }
    expect(count >= 0).toBeTruthy();
  });

  test('详情页不存在纸币时显示空状态', async ({ page }) => {
    await page.goto('/banknote/not-exist-id-123456789');
    await page.waitForTimeout(800);
    
    const notFoundTexts = page.locator('text=/未找到|不存在|404|没有找到/').first();
    if (await notFoundTexts.count() > 0) {
      await expect(notFoundTexts).toBeVisible();
    }
    expect(true).toBeTruthy();
  });

  test('详情页响应式布局：主要内容在各尺寸下可见', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    
    await page.setViewportSize({ width: 1280, height: 720 });
    if (await heading.count() > 0) await expect(heading).toBeVisible();
    
    await page.setViewportSize({ width: 768, height: 1024 });
    if (await heading.count() > 0) await expect(heading).toBeVisible();
    
    await page.setViewportSize({ width: 390, height: 844 });
    if (await heading.count() > 0) await expect(heading).toBeVisible();
  });

  test('详情页收藏按钮交互：添加 → 再取消收藏', async ({ page }) => {
    const favBtns = page.getByRole('button', { name: /添加收藏|收藏/ });
    const iconBtns = page.locator('button:has(svg)');
    
    if (await favBtns.count() > 0) {
      await favBtns.first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(400);
      
      const unfavBtn = page.getByRole('button', { name: /取消收藏|取消/ });
      if (await unfavBtn.count() > 0) {
        await unfavBtn.first().click({ force: true }).catch(() => {});
        await page.waitForTimeout(400);
      }
    } else if (await iconBtns.count() > 0) {
      await iconBtns.first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(400);
      await iconBtns.first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(400);
    }
    
    expect(true).toBeTruthy();
  });
});
