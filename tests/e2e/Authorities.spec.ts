import { expect } from '@playwright/test';
import { createAuthority, authorize, createAttributeAndVerifyResultMsg } from './helpers/operations';
import { test } from './helpers/fixtures';
import { selectors } from "./helpers/selectors";

test.describe('<Authorities/>', () => {
    test.beforeEach(async ({ page , authority}) => {
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
        await page.goto('/authorities');
        const header = page.locator(selectors.authoritiesPage.header, { hasText: "Authorities" });
        await expect(header).toBeVisible();
    });

    test('delete authority if there are no assigned attributes', async ({ page, authority}) => {
        await page.goto('/authorities');
        // click the token message to close it and overcome potential overlapping problem
        await page.locator(selectors.tokenMessage).click()

        const originalTableRows = await page.$$(selectors.authoritiesPage.authoritiesTableRow)
        const originalTableSize = originalTableRows.length

        const deleteAuthorityButtonForTheLastRowItem = await page.locator('#delete-authority-button >> nth=-1')
        await deleteAuthorityButtonForTheLastRowItem.click()

        await test.step('Should be able to close the dialog and cancel authority removal', async() => {
            await page.click(selectors.authoritiesPage.confirmDeletionModal.cancelDeletionBtn)
        })

        await deleteAuthorityButtonForTheLastRowItem.click()
        await page.click(selectors.authoritiesPage.confirmDeletionModal.confirmDeletionBtn)

        await test.step('Assert success message', async() => {
            const successfulDeletionMsg = await page.locator(selectors.alertMessage, {hasText: `Authority ${authority} deleted`})
            await expect(successfulDeletionMsg).toBeVisible()
            await successfulDeletionMsg.click()
        })

        const updatedTableRows = await page.$$(selectors.authoritiesPage.authoritiesTableRow)
        const updatedTableSize = updatedTableRows.length

        expect(updatedTableSize === (originalTableSize - 1)).toBeTruthy()
    });

    test('Authority removal is failed when contains assigned attributes', async ({ page, authority, attributeName, attributeValue}) => {
        await createAttributeAndVerifyResultMsg(page, attributeName, [attributeValue])
        await page.goto('/authorities');
        // click the token message to close it and overcome potential overlapping problem
        await page.locator(selectors.tokenMessage).click()

        const deleteAuthorityButtonForTheLastRowItem = await page.locator('#delete-authority-button >> nth=-1')
        await deleteAuthorityButtonForTheLastRowItem.click()
        await page.click(selectors.authoritiesPage.confirmDeletionModal.confirmDeletionBtn)

        await test.step('Assert failure message', async() => {
            const removalFailedMsg = await page.locator(selectors.alertMessage, {hasText: `Something went wrong`})
            await expect(removalFailedMsg).toBeVisible()
            await removalFailedMsg.click()
        })
    });
});