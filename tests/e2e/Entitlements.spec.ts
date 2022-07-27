import { expect } from '@playwright/test';
import { createAuthority, firstTableRowClick, getLastPartOfUrl, authorize } from './helpers/operations';
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
    const authorityCreatedMsg = page.locator(selectors.alertMessage, {hasText:'Authority was created'})
    await authorityCreatedMsg.click()
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
    await Promise.all([
        page.waitForNavigation(),
        firstTableRowClick('users-table', page),
    ]);

    const id = getLastPartOfUrl(page);
    const header = page.locator(selectors.secondaryHeader, { hasText: `User ${id}` });
    test.expect(header).toBeTruthy();
  });

  test('redirect to client/NPE', async ({ page }) => {
    await Promise.all([
        page.waitForNavigation(),
        firstTableRowClick('clients-table', page),
    ]);

    const id = getLastPartOfUrl(page);
    const header = page.locator(selectors.secondaryHeader, { hasText: `Client ${id}` });
    test.expect(header).toBeTruthy();
  });

  test('Add Entitlements To Entity', async ({ page , authority, attributeName, attributeValue}) => {
    await Promise.all([
        page.waitForNavigation(),
        firstTableRowClick('clients-table', page),
    ]);

    await test.step('Entitle attribute', async() => {
      await page.type(selectors.entitlementsPage.authorityNamespaceField, authority);
      await page.keyboard.press('Enter')
      await page.fill(selectors.entitlementsPage.attributeNameField, attributeName);
      await page.fill(selectors.entitlementsPage.attributeValueField, attributeValue);
      await page.click(selectors.entitlementsPage.submitAttributeButton);
    })

    await test.step('Assert result message', async() => {
      const successfulEntitlementMsg = await page.locator(selectors.alertMessage, {hasText: "Entitlement updated!"})
      await expect(successfulEntitlementMsg).toBeVisible()
    })

    await test.step('Input fields are properly cleared after successful submission', async() => {
      await expect(page.locator(selectors.entitlementsPage.authorityNamespaceField)).toHaveText("")
      await expect(page.locator(selectors.entitlementsPage.attributeNameField)).toHaveText("")
      await expect(page.locator(selectors.entitlementsPage.attributeValueField)).toHaveText("")
    })
  });
});
