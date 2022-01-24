import { test, expect } from '@playwright/test';


test.describe('<App/>', () => {
  test('renders initially', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const header = page.locator('h2', { hasText: "Attributes" });
    await expect(header).toBeVisible();
  });

  test('should get authorization token', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const loginButton = page.locator('[data-test-id=login-button]');

    console.log('loginButton', loginButton);
    loginButton.click();
    const url = await page.url();
    console.log('url', url);
  });
});
