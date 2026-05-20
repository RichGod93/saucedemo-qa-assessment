class LoginPage {

    usernameInput = '[data-test="username"]';
    passwordInput = '[data-test="password"]';
    loginBtn = '[data-test="login-button"]';
    errorMessage = '[data-test="error"]';
    menuButton = '#react-burger-menu-btn';
    logoutButton = '#logout_sidebar_link';

    visit() {
        cy.visit('/');
    }

    enterUsername(username) {
        cy.get(this.usernameInput).clear().type(username);
    }

    enterPassword(password) {
        cy.get(this.passwordInput).clear().type(password);
    }

    clickLogin() {
        cy.get(this.loginBtn).click();
    }

    login(username, password) {
        this.enterUsername(username);
        this.enterPassword(password);
        this.clickLogin();
    }

    verifyLoginSuccess() {
        cy.url().should('include', 'inventory');
    }

    verifyError() {
        cy.get(this.errorMessage).should('be.visible');
    }

    logout() {
        cy.get(this.menuButton).click();
        cy.get(this.logoutButton).click();
    }

}

export default LoginPage;
