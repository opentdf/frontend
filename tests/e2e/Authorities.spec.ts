import {APIRequestContext, expect} from '@playwright/test';
import {
    createAuthority,
    authorize,
    createAttribute,
    assertAttributeCreatedMsg,
    getAccessToken,
    deleteAuthorityViaAPI,
    removeAllAttributesOfAuthority
} from './helpers/operations';
import { test } from './helpers/fixtures';
import { selectors } from "./helpers/selectors";

let authToken: string | null;
let apiContext: APIRequestContext;

test.describe('<Authorities/>', () => {
    test.beforeEach(async ({ page , playwright, authority}) => {
        await authorize(page);
        authToken = await getAccessToken(page)

        await page.getByRole('link', { name: 'Attributes' }).click();
        await page.waitForURL('**/attributes');

        await createAuthority(page, authority);
        // click success message to close it and overcome potential overlapping problem
        const authorityCreatedMsg = page.locator(selectors.alertMessage, {hasText:'Authority was created'})
        await authorityCreatedMsg.click()

        apiContext = await playwright.request.newContext({
            extraHTTPHeaders: {
                'Authorization': `Bearer ${authToken}`,
            },
        });
    });

    test.afterEach(async ({ authority}, testInfo) => {
        // Because authority in this test already deleted
        await removeAllAttributesOfAuthority(apiContext, authority);
        if (testInfo.title !== 'delete authority if there are no assigned attributes') {
            await deleteAuthorityViaAPI(apiContext, authority);
        }
    })

    test.afterAll(async ({ }) => {
        await apiContext.dispose();
    });

    test('renders initially', async ({ page}) => {
        await page.getByRole('link', { name: 'Authorities' }).click();
        await page.waitForURL('**/authorities');

        const header = page.locator(selectors.authoritiesPage.header, { hasText: "Authorities" });
        await expect(header).toBeVisible();
    });

    test('delete authority if there are no assigned attributes', async ({ page, authority}) => {
        await test.step('Open Authorities route', async () => {
            await page.getByRole('link', { name: 'Authorities' }).click();
            await page.waitForURL('**/authorities');
        });

        await page.waitForSelector(selectors.authoritiesPage.authoritiesTableRow);

        const deleteAuthorityButton = await page.getByRole('row', { name: `${authority} Delete` }).getByRole('button', { name: 'Delete' });
        await deleteAuthorityButton.click();

        await test.step('Should be able to close the dialog and cancel authority removal', async() => {
            await page.click(selectors.authoritiesPage.confirmDeletionModal.cancelDeletionBtn)
        })

        await test.step('Assert item is in the table', async() => {
            const cell = page.locator(`td:has-text("${authority}")`);
            await expect(cell).toHaveCount(1);
        })

        await test.step('Confirm Deletion Modal', async () => {
            await deleteAuthorityButton.click();
            await page.click(selectors.authoritiesPage.confirmDeletionModal.confirmDeletionBtn)
        });

        await test.step('Assert success message', async() => {
            const successfulDeletionMsg = await page.locator(selectors.alertMessage, {hasText: `Authority ${authority} deleted`})
            await expect(successfulDeletionMsg).toBeVisible()
            await successfulDeletionMsg.click()
        })

        await test.step('Assert item is deleted from the table', async() => {
            const cell = page.locator(`td:has-text("${authority}")`);
            await expect(cell).toHaveCount(0);
        })
    });

    test('Authority removal is failed when contains assigned attributes', async ({ page, attributeName, attributeValue}) => {
        await createAttribute(page, attributeName, [attributeValue])
        await assertAttributeCreatedMsg(page)

        await test.step('Open Authorities route', async () => {
            await page.getByRole('link', { name: 'Authorities' }).click();
            await page.waitForURL('**/authorities');
        });

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
