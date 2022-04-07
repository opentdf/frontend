import { expect } from '@playwright/test';
import { authorize } from './helpers/operations';
import { test } from './helpers/fixtures';

test.describe('<TDF3JS/>', () => {
    test.beforeEach(async ({ page }) => {
        await authorize(page);
        await page.goto('/');
    });

    test('should use TDF3JS encrypt/decrypt', async ({ page }) => {
        const header = page.locator('h2', { hasText: "Attributes" });
        await expect(header).toBeVisible();


        await page.click("#encrypt-button");

        const newAuthority = await page.locator(`span:has-text("Text deciphered!")`);
        test.expect(newAuthority).toBeTruthy();
    });
});
