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

  test('should add attribute, should filter attributes by Name, Order, Rule', async ({ page, attributeName, authority, attributeValue }) => {
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

    // filter by Rule
    await page.click(attributesHeader.filtersToolbarButton)
    await page.click(filterModal.clearBtn)
    await page.fill(filterModal.ruleInputField, 'allOf')
    await page.click(filterModal.submitBtn)
    await expect(page.locator(attributesHeader.itemsQuantityIndicator)).toHaveText('Total 0 items')
    await page.fill(filterModal.ruleInputField, 'hierarchy')
    await page.click(filterModal.submitBtn)
    await expect(page.locator(attributesHeader.itemsQuantityIndicator)).toHaveText('Total 1 items')
    await page.click(attributesHeader.itemsQuantityIndicator)
    const filteredAttributesListByRule = await page.$$(selectors.attributesPage.attributeItem)
    expect(filteredAttributesListByRule.length).toBe(1)
  });

  test('should sort attributes by Name, ID, rule, values_array', async ({ playwright, page, authority, attributeName, attributeValue }) => {

    const ascendingSortingOption = page.locator('.ant-cascader-menu-item-content', {hasText: 'ASC'})
    const descendingSortingOption = page.locator('.ant-cascader-menu-item-content', {hasText: 'DES'})
    const nameSortingSubOption = page.locator('.ant-cascader-menu-item-content', {hasText: 'name'})
    const ruleSortingSubOption = page.locator('.ant-cascader-menu-item-content', {hasText: 'rule'})
    const idSortingSubOption = page.locator('.ant-cascader-menu-item-content', {hasText: 'id'})
    const valuesSortingSubOption = page.locator('.ant-cascader-menu-item-content', {hasText: 'values_array'})
    const sortByToolbarButton = selectors.attributesPage.attributesHeader.sortByToolbarButton
    const firstAttributeName = '1st attribute'
    const secondAttributeName = 'Z 2nd attribute'
    const thirdAttributeName = '3rd attribute'

    const accessToken = await page.evaluate(() => {
      return sessionStorage.getItem("keycloak");
    });

    const apiContext = await playwright.request.newContext({
      extraHTTPHeaders: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const createAttributeViaAPI = async (attrName: string, attrRule: string, attrOrder: string) => {
      const createAttributeResponse = await apiContext.post('http://localhost:65432/api/attributes/definitions/attributes', {
        data: {
          "authority": authority,
          "name": attrName,
          "rule": attrRule,
          "state": "published",
          "order": [
            attrOrder
          ]
        }
      })
      expect(createAttributeResponse.ok()).toBeTruthy()
    }

    const deleteAttributeViaAPI = async (attrName: string, attrRule: string, attrOrder: string) => {
      const deleteAttributeResponse = await apiContext.delete('http://localhost:65432/api/attributes/definitions/attributes', {
        data: {
          "authority": authority,
          "name": attrName,
          "rule": attrRule,
          "state": "published",
          "order": [
            attrOrder
          ]
        }
      })
      expect(deleteAttributeResponse.ok()).toBeTruthy()
    }

    const assertItemsOrderAfterSorting = async (expectedFirstItemName: string, expectedSecondItemName: string, expectedLastItemName: string) => {
      const firstItemNameAfterSorting = await page.innerText(".ant-col h3 >> nth=0")
      expect(firstItemNameAfterSorting == expectedFirstItemName).toBeTruthy()
      const secondItemNameAfterSorting = await page.innerText(".ant-col h3 >> nth=1")
      expect(secondItemNameAfterSorting == expectedSecondItemName).toBeTruthy()
      const lastItemNameAfterSorting = await page.innerText('.ant-col h3 >> nth=-1')
      expect(lastItemNameAfterSorting == expectedLastItemName).toBeTruthy()
    }

    // data setup
    await createAttributeViaAPI(firstAttributeName, 'anyOf', 'A')
    await createAttributeViaAPI(secondAttributeName, 'allOf', 'C')
    await createAttributeViaAPI(thirdAttributeName, 'hierarchy', 'B')

    // switch between section to renew data
    await page.goto('/entitlements');
    await page.goto('/attributes');

    // select proper authority
    await page.click(selectors.attributesPage.attributesHeader.authorityDropdownButton, {force: true})
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("Enter")

    await expect(page.locator(selectors.attributesPage.attributesHeader.itemsQuantityIndicator)).toHaveText('Total 3 items')

    // sort by Name ASC
    await page.click(sortByToolbarButton)
    await ascendingSortingOption.click()
    await nameSortingSubOption.click()
    await assertItemsOrderAfterSorting(firstAttributeName, thirdAttributeName, secondAttributeName)

    // sort by Name DESC
    await page.click(sortByToolbarButton, {force: true})
    await descendingSortingOption.click()
    await nameSortingSubOption.click()
    await assertItemsOrderAfterSorting(secondAttributeName, thirdAttributeName, firstAttributeName)

    // sort by Rule ASC
    await page.click(sortByToolbarButton, {force: true})
    await ascendingSortingOption.click()
    await ruleSortingSubOption.click()
    await assertItemsOrderAfterSorting(secondAttributeName, firstAttributeName, thirdAttributeName)

    // sort by Rule DESC
    await page.click(sortByToolbarButton, {force: true})
    await descendingSortingOption.click()
    await ruleSortingSubOption.click()
    await assertItemsOrderAfterSorting(thirdAttributeName, firstAttributeName, secondAttributeName)

    // sort by ID ASC
    await page.click(sortByToolbarButton, {force: true})
    await ascendingSortingOption.click()
    await idSortingSubOption.click()
    await assertItemsOrderAfterSorting(firstAttributeName, secondAttributeName, thirdAttributeName)

    // sort by ID DESC
    await page.click(sortByToolbarButton, {force: true})
    await descendingSortingOption.click()
    await idSortingSubOption.click()
    await assertItemsOrderAfterSorting(thirdAttributeName, secondAttributeName, firstAttributeName)

    // sort by Order values ASC
    await page.click(sortByToolbarButton, {force: true})
    await ascendingSortingOption.click()
    await valuesSortingSubOption.click()
    await assertItemsOrderAfterSorting(firstAttributeName, thirdAttributeName, secondAttributeName)

    // sort by Order values DESC
    await page.click(sortByToolbarButton, {force: true})
    await descendingSortingOption.click()
    await valuesSortingSubOption.click()
    await assertItemsOrderAfterSorting(secondAttributeName, thirdAttributeName, firstAttributeName)

    // data teardown
    await deleteAttributeViaAPI(firstAttributeName, 'anyOf', 'A')
    await deleteAttributeViaAPI(secondAttributeName, 'allOf', 'C')
    await deleteAttributeViaAPI(thirdAttributeName, 'hierarchy', 'B')
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
