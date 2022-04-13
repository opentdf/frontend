import { test, expect } from '@playwright/test';
import { authorize } from './helpers/operations';
import {selectors} from "./helpers/selectors";

test.describe('<App/>', () => {
  test.beforeEach(async ({ page }) => {
    await authorize(page);
  });

  test('renders initially', async ({ page }) => {
    const header = page.locator('h2', { hasText: "Attributes" });
    await expect(header).toBeVisible();
  });

  test('should get authorization token', async ({ page }) => {
    const logoutButton = page.locator(selectors.logoutButton);
    expect(logoutButton).toBeTruthy();
  });
});
