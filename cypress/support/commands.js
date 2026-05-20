// ***********************************************
// Custom Cypress Commands
// ***********************************************

Cypress.Commands.add('loginStandardUser', () => {

    cy.visit('/');

    cy.task('getEnv', 'STANDARD_USER').then((username) => {
        cy.get('[data-test="username"]').type(username);
    });

    cy.task('getEnv', 'PASSWORD').then((password) => {
        cy.get('[data-test="password"]').type(password);
    });

    cy.get('[data-test="login-button"]').click();

});