import { expect } from '@playwright/test';
import {authorize, createAuthority, firstTableRowClick} from './helpers/operations';
import { test } from './helpers/fixtures';
import {selectors} from "./helpers/selectors";

test.describe('<Attributes/>', () => {
  test.beforeEach(async ({ page, authority }) => {
    await authorize(page);
    await page.goto('/attributes');
    // click the token message to close it and overcome potential overlapping problem
    await page.locator(selectors.tokenMessage).click()
    await createAuthority(page, authority);
    // click success message to close it and overcome potential overlapping problem
    await page.locator(selectors.alertMessage).click()

  });

  test('renders initially', async ({ page }) => {
    const header = page.locator('h2', { hasText: "Attribute Rules" });
    await expect(header).toBeVisible();
  });

  test('should add authority', async ({ page, authority }) => {
    const newAuthority = await page.locator(`span:has-text("${authority}")`);
    test.expect(newAuthority).toBeTruthy();
  });

  test('should add attribute', async ({ page, attributeName, authority, attributeValue }) => {
    await page.fill(selectors.attributesPage.newSection.attributeNameField, attributeName);
    await page.fill(selectors.attributesPage.newSection.orderField, attributeValue);
    await page.click(selectors.attributesPage.newSection.submitAttributeBtn);
    const attributeCreatedMsg = await page.locator(selectors.alertMessage, {hasText: `Attribute created for`})
    await expect(attributeCreatedMsg).toBeVisible()
  });

  test('should delete attribute', async ({ page, authority, attributeName, attributeValue }) => {
    await page.goto("/entitlements");
    firstTableRowClick('clients-table', page);
    await page.waitForNavigation();

    await page.click(selectors.entitlementsPage.entityDetailsPage.tableCell)
    const originalTableRows = await page.$$(selectors.entitlementsPage.entityDetailsPage.tableRow)
    const originalTableSize = originalTableRows.length

    // Delete single item
    await page.click(selectors.entitlementsPage.entityDetailsPage.deleteAttributeBtn)

    await page.click(selectors.entitlementsPage.entityDetailsPage.tableCell)
    const updatedTableRows = await page.$$(selectors.entitlementsPage.entityDetailsPage.tableRow)
    const updatedTableSize = updatedTableRows.length

    expect(updatedTableSize == (originalTableSize-1)).toBeTruthy()
  });
});