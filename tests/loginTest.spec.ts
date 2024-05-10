import { test, expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import { user } from "./fixtures";

test.describe("Codere Login Tests", () => {
  let loginPage: LoginPage;

  const testData = [
    {
      username: user.empty.username,
      password: user.positive.password,
      description: "Empty Username",
    },
    {
      username: user.positive.username,
      password: user.empty.password,
      description: "Empty Password",
    },
    {
      username: user.empty.username,
      password: user.empty.password,
      description: "Empty Credentials",
    },
    {
      username: user.negative.username,
      password: user.positive.password,
      description: "Incorrect Username",
    },
    {
      username: user.positive.username,
      password: user.negative.password,
      description: "Incorrect Password",
    },
  ];

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test.afterEach(async ({ page }) => {
    page.context().clearCookies();
  });

  test("Successful Login", async () => {
    await loginPage.fillCredentials(
      user.positive.username,
      user.positive.password
    );
    await loginPage.submitLogin();

    expect(loginPage.isLoggedIn()).toBeTruthy();
  });

  test("Invalid Login Scenarios", async () => {
    for (const testCase of testData) {
      console.log(`Running test: ${testCase.description}`);

      await loginPage.navigate();
      await loginPage.fillCredentials(testCase.username, testCase.password);
      await loginPage.submitLogin();

      await loginPage.assertLoginUnsuccessAndError();
    }
  });
});
