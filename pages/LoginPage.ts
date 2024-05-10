import { expect } from "@playwright/test";
import { errors } from "../utils/constants";
import { url } from "../tests/fixtures";

class LoginPage {
  constructor(public page: any) {}

  private readonly loginButtonLocator = ".btAccess";
  private readonly usernameFieldLocator = 'input[name="username"]';
  private readonly passwordFieldLocator = 'input[name="password"]';
  private readonly submitButtonLocator = "#btnaccess";
  private readonly userSubmenuLocator = ".user-submenu-button";
  private readonly alertMessageLocator = ".alert-message";
  private readonly acceptCookiesLocator = "Aceptar todas las cookies";

  async acceptCookies() {
    try {
      await this.page.getByText(this.acceptCookiesLocator).click();
    } catch (error) {
      console.log("No cookies banner present. Continuing test execution");
    }
  }

  async navigate() {
    try {
      await this.page.goto(url.base);
      await this.page.locator(this.loginButtonLocator).click();
      await this.acceptCookies();
    } catch (error) {
      console.log("Error when opening login page");
    }
  }

  async getUsernameField() {
    return await this.page.locator(this.usernameFieldLocator);
  }

  async getPasswordField() {
    return await this.page.locator(this.passwordFieldLocator);
  }

  async getloginButton() {
    return await this.page.locator(this.submitButtonLocator);
  }

  async isLoggedIn() {
    try {
      return await this.page.locator(this.userSubmenuLocator);
    } catch (error) {
      return false;
    }
  }

  async getAlertMessage() {
    return await this.page.locator(this.alertMessageLocator).text();
  }

  async assertLoginUnsuccessAndError() {
    expect(this.isLoggedIn()).toBeFalsy();
    expect(this.getAlertMessage()).toBe(errors.wrongCredsAlertText);
  }

  async fillCredentials(username: string, password: string) {
    const usernameField = await this.getUsernameField();
    const passwordField = await this.getPasswordField();
    await usernameField.fill(username);
    await passwordField.fill(password);
  }

  async submitLogin() {
    const loginButton = await this.getloginButton();
    await loginButton.click();
  }
}

export default LoginPage;
