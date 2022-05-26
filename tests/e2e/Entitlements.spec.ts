import { expect } from '@playwright/test';
import {authorize, createAuthority, firstTableRowClick, getLastPartOfUrl} from './helpers/operations';
import { test } from './helpers/fixtures';
import {selectors} from "./helpers/selectors";

test.describe('<Entitlements/>', () => {
  test.beforeEach(async ({ page , authority}) => {
    await authorize(page);
    await page.goto('/attributes');
    // click the token message to close it and overcome potential overlapping problem
    await page.locator(selectors.tokenMessage).click()
    await createAuthority(page, authority);
    // click success message to close it and overcome potential overlapping problem
    await page.locator(selectors.alertMessage).click()
    await page.goto('/entitlements');
    // click the token message to close it and overcome potential overlapping problem
    await page.locator(selectors.tokenMessage).click()
  });

  test('has tables', async ({ page }) => {
    const clientTableHeader = page.locator('b', { hasText: "Clients table" });
    await expect(clientTableHeader).toBeVisible();

    const tableHeader = page.locator('b', { hasText: "Users table" });
    await expect(tableHeader).toBeVisible();
  });

  test('redirect to user/PE', async ({ page }) => {
    firstTableRowClick('users-table', page);
    await page.waitForNavigation();

    const id = getLastPartOfUrl(page);
    const header = page.locator(selectors.secondaryHeader, { hasText: `User ${id}` });
    test.expect(header).toBeTruthy();
  });

  test('redirect to client/NPE', async ({ page }) => {
    firstTableRowClick('clients-table', page);
    await page.waitForNavigation();

    const id = getLastPartOfUrl(page);
    const header = page.locator(selectors.secondaryHeader, { hasText: `Client ${id}` });
    test.expect(header).toBeTruthy();
  });

  test('Add Entitlements To Entity', async ({ page , authority, attributeName, attributeValue}) => {
    firstTableRowClick('clients-table', page);
    await page.waitForNavigation();
    await page.type(selectors.entitlementsPage.authorityNamespaceField, authority);
    await page.keyboard.press('Enter')
    await page.fill(selectors.entitlementsPage.attributeNameField, attributeName);
    await page.fill(selectors.entitlementsPage.attributeValueField, attributeValue);
    await page.click(selectors.entitlementsPage.submitAttributeButton);
    const successfulEntitlementMsg = await page.locator(selectors.alertMessage, {hasText: "Entitlement updated!"})
    await expect(successfulEntitlementMsg).toBeVisible()
    // const tableVal = `${authority}/attr/${attributeName}/value/${attributeValue}`;
  });
});
