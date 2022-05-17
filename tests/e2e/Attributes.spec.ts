import { expect } from '@playwright/test';
import { authorize, createAuthority, firstTableRowClick } from './helpers/operations';
import { test } from './helpers/fixtures';
import { selectors } from "./helpers/selectors";

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
    expect(newAuthority).toBeTruthy();
  });

  test('should add attribute, should filter attributes by Name, Order', async ({ page, attributeName, authority, attributeValue }) => {
    await page.locator(selectors.attributesPage.openNewSectionBtn).click();
    await page.fill(selectors.attributesPage.newSection.attributeNameField, attributeName);
    await page.fill(selectors.attributesPage.newSection.orderField, attributeValue);
    await page.click(selectors.attributesPage.newSection.submitAttributeBtn);
    const attributeCreatedMsg = await page.locator(selectors.alertMessage, {hasText: `Attribute created for`})
    await expect(attributeCreatedMsg).toBeVisible()

    const attributesHeader = selectors.attributesPage.attributesHeader;
    const filterModal = attributesHeader.filterModal;

    // filter by existed Name
    await page.click(attributesHeader.filtersToolbarButton)
    await page.fill(filterModal.nameInputField, attributeName)
    await page.click(filterModal.submitBtn)
    await page.click(attributesHeader.itemsQuantityIndicator)
    const filteredAttributesListByName = await page.$$(selectors.attributesPage.attributeItem)
    expect(filteredAttributesListByName.length).toBe(1)

    // filter by non-existed Name
    await page.click(attributesHeader.filtersToolbarButton)
    await page.click(filterModal.clearBtn)
    await page.fill(filterModal.nameInputField, 'invalidAttributeName')
    await page.click(filterModal.submitBtn)
    await expect(page.locator(attributesHeader.itemsQuantityIndicator)).toHaveText('Total 0 items')

    // filter by Order
    await page.click(filterModal.clearBtn)
    await page.fill(filterModal.orderInputField, attributeValue)
    await page.click(filterModal.submitBtn)
    await page.click(attributesHeader.itemsQuantityIndicator)
    const filteredAttributesListByOrder = await page.$$(selectors.attributesPage.attributeItem)
    expect(filteredAttributesListByOrder.length).toBe(1)

    // TODO: enable after fixing PLAT-1781 (filtering by Rule doesn't work for now)
    // await page.click(filterModal.clearBtn)
    // await page.fill(filterModal.ruleInputField, 'hierarchy')
    // await page.fill(filterModal.nameInputField, attributeName)
    // await page.click(filterModal.submitBtn)
    // const filteredAttributesListByRule = await page.$$(selectors.attributesPage.attributeItem)
    // expect(filteredAttributesListByRule.length).toBe(1)
  });

  test('should delete attribute', async ({ page, authority, attributeName, attributeValue }) => {
    await page.goto("/entitlements");
    firstTableRowClick('clients-table', page);
    await page.waitForNavigation();

    await page.click(selectors.entitlementsPage.entityDetailsPage.tableCell)
    const originalTableRows = await page.$$(selectors.entitlementsPage.entityDetailsPage.tableRow)
    const originalTableSize = originalTableRows.length

    // Delete single item
    await page.click(selectors.entitlementsPage.entityDetailsPage.deleteAttributeBtn);
    await page.click(selectors.entitlementsPage.entityDetailsPage.deleteAttributeModalBtn);

    await page.click(selectors.entitlementsPage.entityDetailsPage.tableCell)
    const updatedTableRows = await page.$$(selectors.entitlementsPage.entityDetailsPage.tableRow)
    const updatedTableSize = updatedTableRows.length

    expect(updatedTableSize === (originalTableSize - 1)).toBeTruthy()
  });
});
