import { test, expect } from '@playwright/test';
import { selectors } from "./helpers/selectors";
import {authorize, firstTableRowClick, login} from "./helpers/operations";

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

  test('should be able to log out on the Attributes page', async ({ page }) => {
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

  test('should be able to log out on the Authorities page', async ({ page }) => {
    await page.goto('/authorities');
    // check that authority items are present when logged in
    await expect(page.locator(selectors.authoritiesPage.deleteAuthorityButton)).toBeVisible()

    await Promise.all([
      page.waitForNavigation(),
      page.click(selectors.logoutButton),
    ])
    await page.waitForSelector(selectors.loginButton);
    // check that authorities data isn't shown after log out
    const noDataInfo = page.locator(".ant-empty-description", {hasText: 'No Data'})
    await expect(noDataInfo).toBeVisible()
  });

  test('should be able to log out on the Entitlements page', async ({ page }) => {
    await page.goto('/entitlements');
    await Promise.all([
      page.waitForNavigation(),
      page.click(selectors.logoutButton),
    ])
    await page.waitForSelector(selectors.loginButton);

    // check that entities data isn't shown after log out - progress indicator is shown constantly
    const loadingDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    await loadingDelay(3000)
    const progressIndicator = page.locator(".ant-spin-dot >> nth=0")
    await expect(progressIndicator).toBeVisible()
  });

  test('should be able to log out on the Entity Details page', async ({ page }) => {
    await page.goto('/entitlements');
    await Promise.all([
      page.waitForNavigation(),
      firstTableRowClick('users-table', page),
    ]);
    // check that entitlement items are present when logged in
    await expect(page.locator(selectors.entitlementsPage.entityDetailsPage.deleteEntitlementBtn)).toBeVisible()

    await Promise.all([
      page.waitForNavigation(),
      page.click(selectors.logoutButton),
    ])
    await page.waitForSelector(selectors.loginButton);
    // check that entitlement data isn't shown after log out
    const noDataInfo = page.locator(".ant-empty-description", {hasText: 'No Data'})
    await expect(noDataInfo).toBeVisible()
  });
});

test.describe('<Login/>', () => {
  test('is failed when using blank values', async ({ page }) => {
    await login(page, "", "")
    await expect(page.locator(selectors.loginScreen.errorMessage)).toBeVisible();
  });

  test('is failed when using wrong username', async ({ page }) => {
    await login(page, "non-existed-username", "testuser123")
    await expect(page.locator(selectors.loginScreen.errorMessage)).toBeVisible();
  });

  test('is failed when using wrong password', async ({ page }) => {
    await login(page, "user1", "wrong-password")
    await expect(page.locator(selectors.loginScreen.errorMessage)).toBeVisible();
  });
});
