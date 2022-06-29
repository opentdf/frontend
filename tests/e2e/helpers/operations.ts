import {selectors} from "./selectors";

export const authorize = async (page) => {
  await page.goto('/');
  await page.locator(selectors.loginButton).click()

  await page.fill(selectors.loginScreen.usernameField, "user1");
  await page.fill(selectors.loginScreen.passwordField, "testuser123");
  await page.click(selectors.loginScreen.submitButton);

  await page.waitForNavigation();
  await page.waitForSelector(selectors.logoutButton);
  // click the token message to close it and overcome potential overlapping problem
  await page.locator(selectors.tokenMessage).click()
};

export const createAuthority = async (page, authority) => {
  await page.locator(selectors.attributesPage.newSectionBtn).click();
  page.fill(selectors.attributesPage.newSection.authorityField, authority);
  await page.locator(selectors.attributesPage.newSection.submitAuthorityBtn).click();
};

export const firstTableRowClick = async (table, page) => {
  const firstRow = await page.locator(`[data-test-id=${table}] .ant-table-tbody>tr:first-child`);
  await firstRow.click();
};

export const getLastPartOfUrl = async (page) => {
  const url = page.url();
  return url.substring(url.lastIndexOf('/') + 1);
};
