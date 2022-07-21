import { test } from './helpers/fixtures';
import { APIRequestContext, chromium, expect, Page } from "@playwright/test";
import { selectors } from "./helpers/selectors";

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
    test.beforeEach(async ({ playwright, authority, browser }) => {
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
        const updateAttributesResponseBody = await updateAttributeResponse.json();
        expect(updateAttributesResponseBody).toMatchObject(updatedAttributeData)

        // DELETE Attribute
        const deleteAttributeResponse = await apiContext.delete('http://localhost:65432/api/attributes/definitions/attributes', {
            data: updatedAttributeData
        })
        expect(deleteAttributeResponse.status()).toBe(202)
        expect(deleteAttributeResponse.ok()).toBeTruthy()
    })

    test('Entitlements: create, read, delete', async ({ authority, attributeName, attributeValue}) => {

        // GET Entitlements to parse existed entityID
        const getEntitlementsResponse = await apiContext.get(`http://localhost:65432/api/entitlements/entitlements`)
        expect(getEntitlementsResponse.status()).toBe(200)
        expect(getEntitlementsResponse.ok()).toBeTruthy()

        // Get ID of existed entity to work with (response returns list of ordered maps)
        const getEntitlementsResponseBody = await getEntitlementsResponse.json()
        const firstEntity = getEntitlementsResponseBody[0]
        const existedEntityId = Object.keys(firstEntity)[0]

        // CREATE Entitlement
        const entitlementPayload = `${authority}/attr/${attributeName}/value/${attributeValue}`;

        const createAttributeResponse = await apiContext.post(`http://localhost:65432/api/entitlements/entitlements/${existedEntityId}`, {
            data: [entitlementPayload]
        })
        expect(createAttributeResponse.status()).toBe(200)
        expect(createAttributeResponse.ok()).toBeTruthy()

        // GET and check created entitlement
        const checkCreatedEntitlementResponse = await apiContext.get(`http://localhost:65432/api/entitlements/entitlements?entityId=${existedEntityId}`)
        expect(checkCreatedEntitlementResponse.status()).toBe(200)
        expect(checkCreatedEntitlementResponse.ok()).toBeTruthy()

        const checkCreatedEntitlementResponseBody = await checkCreatedEntitlementResponse.text()
        expect(checkCreatedEntitlementResponseBody).toContain(existedEntityId)
        expect(checkCreatedEntitlementResponseBody).toContain(entitlementPayload)

        // DELETE Entitlement
        const deleteEntitlementResponse = await apiContext.delete(`http://localhost:65432/api/entitlements/entitlements/${existedEntityId}`, {
            data: [entitlementPayload]
        })
        expect(deleteEntitlementResponse.status()).toBe(202)
        expect(deleteEntitlementResponse.ok()).toBeTruthy()
    })
})
