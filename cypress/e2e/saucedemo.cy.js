import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';

const loginPage = new LoginPage();
const inventoryPage = new InventoryPage();
const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();

describe('SauceDemo Test Suite', () => {

    beforeEach(() => {
        loginPage.visit();
    });

    it('Successful Login', () => {

        cy.task('getEnv', 'STANDARD_USER').then((username) => {
            cy.task('getEnv', 'PASSWORD').then((password) => {
                loginPage.login(username, password);
            });
        });

        loginPage.verifyLoginSuccess();

    });

    it('Failed Login', () => {

        loginPage.login('wrong_user', 'wrong_password');

        loginPage.verifyError();

    });

    it('Add item and verify cart count', () => {

        cy.loginStandardUser();

        inventoryPage.addItemToCart();

        inventoryPage.verifyCartCount('1');

    });

    it('Complete Checkout Flow', () => {

        cy.loginStandardUser();

        inventoryPage.addItemToCart();

        inventoryPage.goToCart();

        cartPage.verifyItemExists('Sauce Labs Backpack');

        cartPage.proceedCheckout();

        checkoutPage.fillCheckoutInfo(
            'RichGod',
            'Usen',
            '12345'
        );

        checkoutPage.continue();

        checkoutPage.finish();

        checkoutPage.verifyOrderSuccess();

    });

    it('Logout', () => {

        cy.loginStandardUser();

        loginPage.logout();

        cy.url()
            .should('eq', 'https://www.saucedemo.com/');

    });

});
