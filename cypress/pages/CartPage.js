class CartPage {

    checkoutButton = '[data-test="checkout"]';

    verifyItemExists(itemName) {
        cy.contains(itemName)
            .should('exist');
    }

    proceedCheckout() {
        cy.get(this.checkoutButton)
            .click();
    }

}

export default CartPage;
