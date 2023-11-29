import { test as baseTest } from "@playwright/test";
import path from "path";
import fs from "fs";

export const generateRandomDigit = (max = 10, min = 0) =>
  Math.floor(Math.random() * max + min);

const istanbulCLIOutput = path.join(process.cwd(), './coverage/playwright');

const alteredTest = baseTest.extend<{ attributeName: string; authority: string; attributeValue: string; }>({
  attributeName: async ({ page }, use) => {
    const attributeName = `randomName${generateRandomDigit(1000, 10)}`;

    await use(attributeName);
  },
  authority: async ({ page }, use) => {
    const authority = `https://opentdf${generateRandomDigit(10000, 1)}.ua`;

    await use(authority);
  },
  attributeValue: async ({ page }, use) => {
    const attributeValue = `${generateRandomDigit(1000, 1)}`;

    await use(attributeValue);
  },
  context: async ({ context }, use) => {
    await context.addInitScript(() =>
      window.addEventListener('beforeunload', () =>
        (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__))
      ),
    );
    await fs.promises.mkdir(istanbulCLIOutput, { recursive: true });
    await context.exposeFunction('collectIstanbulCoverage', (coverageJSON: string) => {
      if (coverageJSON)
        fs.writeFileSync(path.join(istanbulCLIOutput, `playwright_coverage_${generateRandomDigit(1000, 1)}.json`), coverageJSON);
    });
    await use(context);
    for (const page of context.pages()) {
      await page.evaluate(() => (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__)))
    }
  },
});

export const test = alteredTest;