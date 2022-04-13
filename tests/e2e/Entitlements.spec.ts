import { expect } from '@playwright/test';
import { authorize, firstTableRowClick, getLastPartOfUrl } from './helpers/operations';
import { test } from './helpers/fixtures';
import {selectors} from "./helpers/selectors";

test.describe('<Entitlements/>', () => {
  test.beforeEach(async ({ page }) => {
    await authorize(page);
    await page.goto('/entitlements');
  });

  test('has tables', async ({ page }) => {
    const clientTableHeader = page.locator('b', { hasText: "Clients table" });
    await expect(clientTableHeader).toBeVisible();

    const tableHeader = page.locator('b', { hasText: "Users table" });
    await expect(tableHeader).toBeVisible();
  });

  test('redirect to user', async ({ page }) => {
    firstTableRowClick('users-table', page);
    await page.waitForNavigation();

    const id = getLastPartOfUrl(page);
    const header = page.locator(selectors.secondaryHeader, { hasText: `User ${id}` });
    test.expect(header).toBeTruthy();
  });

  test('redirect to client', async ({ page }) => {
    firstTableRowClick('clients-table', page);
    await page.waitForNavigation();

    const id = getLastPartOfUrl(page);
    const header = page.locator(selectors.secondaryHeader, { hasText: `Client ${id}` });
    test.expect(header).toBeTruthy();
  });

  test('Add Entitlements To Entity', async ({ page , authority, attributeName, attributeValue}) => {
    firstTableRowClick('clients-table', page);
    await page.waitForNavigation();
    await page.fill(selectors.entitlementsPage.authorityNamespaceField, authority);
    await page.fill(selectors.entitlementsPage.attributeNameField, attributeName);
    await page.fill(selectors.entitlementsPage.attributeValueField, attributeValue);
    await page.click(selectors.entitlementsPage.submitAttributeButton);
  });
});
