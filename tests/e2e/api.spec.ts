import { test } from './helpers/fixtures';
import {APIRequestContext, chromium, expect, Page} from "@playwright/test";

const selectors = require('./helpers/selectors');

let apiContext: APIRequestContext;
let pageContext;

const getAccessTokenAfterLogin = async (page: Page) => {
    await page.goto('http://localhost:65432/');
    await page.locator(selectors.loginButton).click()
    await page.fill(selectors.loginScreen.usernameField, "user1");
    await page.fill(selectors.loginScreen.passwordField, "testuser123");
    await page.click(selectors.loginScreen.submitButton);

    await page.waitForResponse('**/token');
    return await page.evaluate(() => {
        return sessionStorage.getItem("keycloak");
    });
};

test.describe('API:', () => {
    test.beforeEach(async ({ playwright, authority }) => {
        const browser = await chromium.launch();
        pageContext = await browser.newContext();
        const page = await pageContext.newPage();
        const authToken = await getAccessTokenAfterLogin(page)

        apiContext = await playwright.request.newContext({
            // baseURL: 'http://localhost:65432/api',
            extraHTTPHeaders: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        // create mandatory authority
        const createAuthorityResponse = await apiContext.post('http://localhost:65432/api/attributes/authorities', {
            data: {
                "authority": authority
            },
        })
        expect(createAuthorityResponse.status()).toBe(200)
        expect(createAuthorityResponse.ok()).toBeTruthy()
    })

    test.afterAll(async ({ }) => {
        await apiContext.dispose();
    });

    test('Attributes: create, read, update, delete', async ({authority, attributeName}) => {

        const originalAttributeData = {
            "authority": authority,
            "name": attributeName,
            "rule": "hierarchy",
            "state": "published",
            "order": [
                "TradeSecret"
            ]
        }

        const updatedAttributeData = {
            "authority": authority,
            "name": attributeName,
            "rule": "anyOf",
            "state": "published",
            "order": [
                "TradeSecret",
                "Proprietary",
                "BusinessSensitive",
                "Open",
                "Close"
            ]
        }

        // CREATE Attribute
        const createAttributeResponse = await apiContext.post('http://localhost:65432/api/attributes/definitions/attributes', {
            data: originalAttributeData
        })
        expect(createAttributeResponse.status()).toBe(200)
        expect(createAttributeResponse.ok()).toBeTruthy()

        // GET Attributes
        const getAttributesResponse = await apiContext.get(`http://localhost:65432/api/attributes/definitions/attributes?authority=${authority}`, {
            params: {
                name: attributeName
            }
        })
        expect(getAttributesResponse.status()).toBe(200)
        expect(getAttributesResponse.ok()).toBeTruthy()
        const getAttributesResponseBody = await getAttributesResponse.json();
        await expect(getAttributesResponseBody).toMatchObject([originalAttributeData])

        // UPDATE Attribute
        const updateAttributeResponse = await apiContext.put('http://localhost:65432/api/attributes/definitions/attributes', {
            data: updatedAttributeData
        })
        expect(updateAttributeResponse.status()).toBe(200)
        expect(updateAttributeResponse.ok()).toBeTruthy()
        expect(await getAttributesResponse.json()).toMatchObject([originalAttributeData])

        // DELETE Attribute
        const deleteAttributeResponse = await apiContext.delete('http://localhost:65432/api/attributes/definitions/attributes', {
            data: updatedAttributeData
        })
        expect(deleteAttributeResponse.status()).toBe(202)
        expect(deleteAttributeResponse.ok()).toBeTruthy()
    })
})