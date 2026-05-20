class CheckoutPage {

    firstName = '[data-test="firstName"]';
    lastName = '[data-test="lastName"]';
    postalCode = '[data-test="postalCode"]';
    continueBtn = '[data-test="continue"]';
    finishBtn = '[data-test="finish"]';

    fillCheckoutInfo(first, last, postal) {

        cy.get(this.firstName)
            .type(first);

        cy.get(this.lastName)
            .type(last);

        cy.get(this.postalCode)
            .type(postal);

    }

    continue() {

        cy.get(this.continueBtn)
            .click();

    }

    finish() {

        cy.get(this.finishBtn)
            .click();

    }

    verifyOrderSuccess() {

        cy.contains('Thank you for your order!')
            .should('be.visible');

    }

}

export default CheckoutPage;
