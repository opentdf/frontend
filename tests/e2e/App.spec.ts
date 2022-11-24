import { test, expect } from '@playwright/test';
import { selectors } from "./helpers/selectors";
import {authorize, login} from "./helpers/operations";

test.describe('<App/>', () => {
  test.beforeEach(async ({ page }) => {
    await authorize(page);
    await page.goto('/');
  });

  test('renders initially', async ({ page }) => {
    const header = page.locator('h2', { hasText: "Attributes" });
    await expect(header).toBeVisible();
  });

  test('should get authorization token', async ({ page }) => {
    const logoutButton = page.locator(selectors.logoutButton);
    expect(logoutButton).toBeTruthy();
  });

  // TODO: uncomment after fixing PLAT-2044
  test.skip('should be able to log out', async ({ page }) => {
    await page.goto('/attributes');
    await Promise.all([
      page.waitForNavigation(),
      page.click(selectors.logoutButton),
    ])
    await page.waitForSelector(selectors.loginButton);
    // check that data isn't shown
    const authorityDropdown = page.locator(".ant-select-selector >> nth=1")
    await authorityDropdown.click()
    await expect(page.locator('.ant-empty-description')).toHaveText('No Data')
  });
});

test.describe('<Login/>', () => {
  test('is failed when using blank values', async ({ page }) => {
    await login(page, "", "")
    await expect(page.locator("#input-error")).toBeVisible();
  });

  test('is failed when using wrong username', async ({ page }) => {
    await login(page, "non-existed-username", "testuser123")
    await expect(page.locator("#input-error")).toBeVisible();
  });

  test('is failed when using wrong password', async ({ page }) => {
    await login(page, "user1", "wrong-password")
    await expect(page.locator("#input-error")).toBeVisible();
  });
});
