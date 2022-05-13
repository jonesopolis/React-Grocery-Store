/// <reference types="cypress" />
import { BrowserCacheLocation } from '@azure/msal-browser'
import 'cypress-msal-login'
import { lazy } from 'react';

Cypress.Commands.add('login', () => {
  return cy
    .request({
      method: 'POST',
      url: `https://login.microsoftonline.com/${Cypress.env("msal_tenantid")}/oauth2/token`,
      form: true,
      body: {
        grant_type: 'password',
        tenant: Cypress.env("msal_tenantid"),
        client_id: Cypress.env("msal_clientid"),
        client_secret: 'MtE8Q7RmZLpJjbFG7yU4cnQ7OizbdwNMeRSmcDY',
        username: 'cypress-test-runner@davidtestrda.onmicrosoft.com',
        password: 'CypressTestRunner1',
        resource: Cypress.env("msal_clientid"),
      },
    })
    .then((response) => {
      console.log(response);
      sessionStorage.setItem('access_token', response.body.access_token);
    })
    .then(() => {
      cy.reload();
    });
});

describe('Navbar', () => {
    beforeEach(() => {      
      cy.visit('http://localhost:3000')
    })
  
    it('should navigate to the inventory page', () => {
     
        cy.get('a[href*="inventory"]').click()
        cy.url().should('include', '/inventory')
    });

    it('should be able to authenticate via MSAL', () => {
      console.log(Cypress.env("msal_tenantid"));
      cy.login()

      //cy.get('a[href*="profile"]').should('contain', 'cypress-test-runner@davidtestrda.onmicrosoft.com')
    });

    
});