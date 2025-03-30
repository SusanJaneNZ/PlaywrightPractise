import { test as base, chromium } from '@playwright/test';
import path from "path";
import LoginPage from '../pageObjects/loginPage';
import HomePage from '../pageObjects/homePage';
require("dotenv").config({ path:  "./../.env" });

type myFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  exceptionLogger: void;
  timeLogger: void;
};

const capabilities = {
  browserName: "Chrome",
  browserVersion: "134",
  "LT:Options": {
    user: process.env.LAMBDA_USERNAME,
    accessKey: process.env.LAMBDA_ACCESS_KEY,
    video: true,
    console: true,
    network: true,
    tunnel: false,
    w3c: true,
    platformName: "Windows 10",
    build: "Playwright Training Build",
    name: "Playwright Test",
    timezon: "Auckland",
    project: "Untitled",
    plugin: "node_js-node_js"
  }
}

// Patching the capabilities dynamically according to the project name.
const modifyCapabilities = (configName, testName) => {
  let config = configName.split("@lambdatest")[0];
  let [browserName, browserVersion, platform] = config.split(":");
  capabilities.browserName = browserName
    ? browserName
    : capabilities.browserName;
  capabilities.browserVersion = browserVersion
    ? browserVersion
    : capabilities.browserVersion;
  capabilities["LT:Options"]["platform"] = platform
    ? platform
    : capabilities["LT:Options"]["platform"];
  capabilities["LT:Options"]["name"] = testName;
};

const myTest = base.extend<myFixtures>({
    page: async ({ page }, use, testInfo) => {
      // Configure LambdaTest platform for cross-browser testing
      let fileName = testInfo.file.split(path.sep).pop();
      if (testInfo.project.name.match(/lambdatest/)) {
        modifyCapabilities(
          testInfo.project.name,
          `${testInfo.title} - ${fileName}`
        );

        const browser = await chromium.connect({
          wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
            JSON.stringify(capabilities)
          )}`,
        timeout: 120000});

        const ltPage = await browser.newPage(testInfo.project.use);
        await use(ltPage);

        const testStatus = {
          action: "setTestStatus",
          arguments: {
            status: testInfo.status,
            remark: testInfo.error?.stack || testInfo.error?.message,
          },
        };
        await ltPage.evaluate(() => {},
        `lambdatest_action: ${JSON.stringify(testStatus)}`);
        await ltPage.close();
        await browser.close();
      } else {
        // Run tests in local in case of local config provided
        await use(page);
      }
    },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  exceptionLogger: [async ({}, use, testInfo) => {
    const errors: Error[] = [];
    process.on("pageerror", (error) => {
      errors.push(error);
    });
    await use();
    if (errors.length) {
      await testInfo.attach("Page Errors", {
        body: errors.map((error) => '${error.message\n ${error.stack}')
        .join("\n---------\n"),
      });

      throw new Error("Javascript Page errors occurred during the test run.");
    }
  },{auto: true}],
  timeLogger: [async ({}, use, testInfo) => {
    testInfo.annotations.push({
      type:  "Start",
      description: new Date().toLocaleString("en-NZ", {
        timeZone: "Pacific/Auckland",
      }),
    })
    await use();
    testInfo.annotations.push({
      type: "End",
      description: new Date().toLocaleString("en-NZ", {
        timeZone: "Pacific/Auckland",
      }),
    })
  },{auto: true}],
});

export const test = myTest;
export const expect = myTest.expect;

