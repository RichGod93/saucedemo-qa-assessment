class InventoryPage {

    cartBadge = '.shopping_cart_badge';
    addBackpack = '[data-test="add-to-cart-sauce-labs-backpack"]';
    cartIcon = '.shopping_cart_link';

    addItemToCart() {
        cy.get(this.addBackpack).click();
    }

    verifyCartCount(count) {
        cy.get(this.cartBadge)
            .should('have.text', count);
    }

    goToCart() {
        cy.get(this.cartIcon).click();
    }

}

export default InventoryPage;
