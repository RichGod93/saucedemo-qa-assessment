import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';

const loginPage = new LoginPage();
const inventoryPage = new InventoryPage();
const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();

describe('Problem User - Bug Documentation Tests', () => {

    beforeEach(() => {
        loginPage.visit();
        // Login as problem_user
        cy.task('getEnv', 'PROBLEM_USER').then((username) => {
            cy.task('getEnv', 'PASSWORD').then((password) => {
                loginPage.login(username, password);
            });
        });
    });

    it('BUG-001: Verify product images are displayed correctly', () => {
        // Check if the first product has correct image
        cy.get('.inventory_item').first().within(() => {
            cy.get('.inventory_item_img').should('be.visible');
            cy.get('.inventory_item_name').invoke('text').then((productName) => {
                cy.log('Product Name: ' + productName);
                // Document the image src for bug report
                cy.get('.inventory_item_img img').invoke('attr', 'src').then((src) => {
                    cy.log('Image Source: ' + src);
                });
            });
        });
    });

    it('BUG-002: Test Add to Cart button behavior', () => {
        // Try adding multiple items and verify cart behavior
        cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        cy.wait(500);

        // Check if cart badge updates
        cy.get('.shopping_cart_badge').should('exist');

        cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        cy.wait(500);
    });

    it('BUG-003: Test product sorting functionality', () => {
        // Test Name (A to Z) - default
        cy.get('[data-test="product-sort-container"]').select('az');
        cy.wait(500);

        // Get first product name
        cy.get('.inventory_item_name').first().invoke('text').as('firstProductAZ');

        // Test Name (Z to A)
        cy.get('[data-test="product-sort-container"]').select('za');
        cy.wait(500);
        cy.get('.inventory_item_name').first().invoke('text').as('firstProductZA');

        // Test Price (low to high)
        cy.get('[data-test="product-sort-container"]').select('lohi');
        cy.wait(500);
        cy.get('.inventory_item_price').first().invoke('text').as('lowestPrice');

        // Test Price (high to low)
        cy.get('[data-test="product-sort-container"]').select('hilo');
        cy.wait(500);
        cy.get('.inventory_item_price').first().invoke('text').as('highestPrice');
    });

    it('BUG-004: Complete checkout flow with problem_user', () => {
        // Add item to cart
        cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();

        // Go to cart
        cy.get('.shopping_cart_link').click();

        // Proceed to checkout
        cy.get('[data-test="checkout"]').click();

        // Fill checkout information
        cy.get('[data-test="firstName"]').type('Test');
        cy.get('[data-test="lastName"]').type('User');
        cy.get('[data-test="postalCode"]').type('12345');

        cy.get('[data-test="continue"]').click();

        // Try to finish checkout
        cy.get('[data-test="finish"]').click();

        // Verify if order completes or encounters issues
        cy.url().then((url) => {
            cy.log('Final URL: ' + url);
        });
    });

    it('Exploratory: Test navigation and UI consistency', () => {
        // Test back navigation
        cy.get('.inventory_item_name').first().click();
        cy.url().should('include', 'inventory-item');

        cy.get('[data-test="back-to-products"]').click();
        cy.url().should('include', 'inventory');

        // Test menu functionality
        cy.get('#react-burger-menu-btn').click();
        cy.get('.bm-menu').should('be.visible');
        cy.get('#inventory_sidebar_link').should('be.visible');
        cy.get('#about_sidebar_link').should('be.visible');
    });

});
