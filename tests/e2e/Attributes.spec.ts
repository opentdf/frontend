import {expect, Page} from '@playwright/test';
import { authorize, createAuthority, firstTableRowClick } from './helpers/operations';
import { test } from './helpers/fixtures';
import { selectors } from "./helpers/selectors";

test.describe('<Attributes/>', () => {

  const createAttributeAndVerifyResultMsg = async (page: Page, name: string, values: string[]) => {
    await page.fill(selectors.attributesPage.newSection.attributeNameField, name);
    for (let i = 0; i < values.length; i++) {
      const currentOrderField = `#order_${i}`
      await page.fill(currentOrderField, values[i]);
      await page.click(selectors.attributesPage.newSection.plusOrderButton)
    }
    await page.click(selectors.attributesPage.newSection.submitAttributeBtn);
    const attributeCreatedMsg2 = await page.locator(selectors.alertMessage, {hasText: `Attribute created for`})
    await expect(attributeCreatedMsg2).toBeVisible()
  }

  const existedOrderValue = '.ant-tabs-tab-btn >> nth=0'

  test.beforeEach(async ({ page, authority }) => {
    await authorize(page);
    await page.goto('/attributes');
    // click the token message to close it and overcome potential overlapping problem
    await page.locator(selectors.tokenMessage).click()
    await createAuthority(page, authority);
    // click success message to close it and overcome potential overlapping problem
    const authorityCreatedMsg = page.locator(selectors.alertMessage, {hasText:'Authority was created'})
    await authorityCreatedMsg.click()
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
    await createAttributeAndVerifyResultMsg(page, attributeName, [attributeValue])

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

    // TODO: teardown fails because Delete request passes too quick, step duration is negative (-0.1s)
    // data teardown
    // await deleteAttributeViaAPI(firstAttributeName, 'anyOf', 'A')
    // await deleteAttributeViaAPI(secondAttributeName, 'allOf', 'C')
    // await deleteAttributeViaAPI(thirdAttributeName, 'hierarchy', 'B')
  });

  test('should delete attribute entitlement', async ({ page, authority, attributeName, attributeValue }) => {
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

  test('should edit attribute rule', async ({ page , attributeName, attributeValue}) => {
    const restrictiveAccessDropdownOption = page.locator('.ant-select-item-option', {hasText:'Restrictive Access'})
    const ruleUpdatedMsg = page.locator(selectors.alertMessage, {hasText: `Rule was updated!`})
    const attributeDetailsSection = selectors.attributesPage.attributeDetailsSection

    await createAttributeAndVerifyResultMsg(page, attributeName, [attributeValue])
    await page.click(selectors.attributesPage.attributesHeader.itemsQuantityIndicator)
    await page.click(selectors.attributesPage.newSectionBtn);
    await page.click(existedOrderValue)
    await page.click(attributeDetailsSection.editRuleButton)
    await page.click(attributeDetailsSection.ruleDropdown)
    await restrictiveAccessDropdownOption.click()
    await page.click(attributeDetailsSection.saveRuleButton)
    await expect(ruleUpdatedMsg).toBeVisible()
  });

  test('should create an attribute with multiple order values, able to edit order of values, able to cancel editing', async ({ page , attributeName, attributeValue}) => {
    const ruleUpdatedMsg = page.locator(selectors.alertMessage, {hasText: `Rule was updated!`})

    await createAttributeAndVerifyResultMsg(page, attributeName, [`${attributeValue}1`, `${attributeValue}2`, `${attributeValue}3`, `${attributeValue}4`])
    await page.click(selectors.attributesPage.attributesHeader.itemsQuantityIndicator)
    await page.locator(selectors.attributesPage.newSectionBtn).click();
    await page.click(existedOrderValue)
    await expect(page.locator(existedOrderValue)).toHaveAttribute('aria-selected', 'true')
    // be able to close Details section
    await page.click(selectors.attributesPage.attributeDetailsSection.closeDetailsSectionButton)
    await expect(page.locator(existedOrderValue)).toHaveAttribute('aria-selected', 'false')
    // reopen Details section
    await page.click(existedOrderValue)
    await page.locator(selectors.attributesPage.attributeDetailsSection.editRuleButton).click()
    // be able to cancel editing
    await page.click(selectors.attributesPage.attributeDetailsSection.cancelRuleSavingButton)
    // reopen Edit section
    await page.locator(selectors.attributesPage.attributeDetailsSection.editRuleButton).click()
    const firstOrderItemInEditableList = '.order-list__item >> nth=0'
    const fourthOrderItemInEditableList = '.order-list__item >> nth=3'
    await page.dragAndDrop(fourthOrderItemInEditableList, firstOrderItemInEditableList )
    await page.click(selectors.attributesPage.attributeDetailsSection.saveRuleButton)
    await expect(ruleUpdatedMsg).toBeVisible()
    const updatedFirstOrderValue = page.locator('.ant-tabs-tab-btn >> nth=0')
    await expect(updatedFirstOrderValue).toHaveText(`${attributeValue}4`)
  });

  test('should be able to log out', async ({ page }) => {
    await page.click(selectors.logoutButton)
    await page.waitForNavigation();
    await page.waitForSelector(selectors.loginButton);
    // check that data isn't shown
    const authorityDropdown = page.locator(".ant-select-selector >> nth=1")
    await authorityDropdown.click()
    await expect(page.locator('.ant-empty-description')).toHaveText('No Data')
  });

  test('should show empty state of the Entitlements table in the Attribute Details section when there are no entitlements', async ({page, attributeName,attributeValue}) => {
    await createAttributeAndVerifyResultMsg(page, attributeName, [attributeValue])
    await page.click(selectors.attributesPage.attributesHeader.itemsQuantityIndicator)
    await page.locator(selectors.attributesPage.newSectionBtn).click();
    const existedOrderValue = page.locator('.ant-tabs-tab-btn >> nth=0')
    await existedOrderValue.click()
    await expect(page.locator('#entitlements-table .ant-empty-description')).toHaveText('No Data')
  })

  test('should show existed entitlements in the Attribute Details section', async ({ page,authority,attributeName, attributeValue }) => {
    await createAttributeAndVerifyResultMsg(page, attributeName, [attributeValue])

    await page.goto("/entitlements")
    firstTableRowClick('clients-table', page);
    await page.waitForNavigation();
    await page.click(selectors.entitlementsPage.authorityNamespaceField)
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press('Enter')
    await page.fill(selectors.entitlementsPage.attributeNameField, attributeName);
    await page.fill(selectors.entitlementsPage.attributeValueField, attributeValue);
    await page.click(selectors.entitlementsPage.submitAttributeButton);

    await page.goto("/attributes")
    await page.click(selectors.attributesPage.attributesHeader.authorityDropdownButton, {force:true})
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press('Enter')
    const existedOrderValue = page.locator('.ant-tabs-tab-btn >> nth=0')
    await existedOrderValue.click()
    const tableEntitlements = await page.$$("#entitlements-table .ant-table-tbody")
    expect(tableEntitlements.length).toBe(1)
    const tableValue = `${authority}/attr/${attributeName}/value/${attributeValue}`
    await expect(page.locator('.ant-table-cell', {hasText: tableValue})).toBeVisible()
  });
});
