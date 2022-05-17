```js
/// <reference types="cypress" />

describe('Checking title', () => {
    beforeEach(() => {
    });
    
    // it.only() to run only that test
    it('test one', () => {
        // Set Viewport(Screen) resolution
        // you can also set permanent in config file with viewportWidth, viewportHeight
        cy.viewport(1024, 768);

        // You can also set device for resolution(preset)
        // cy.viewport('iphone-5');

        cy.visit('http://localhost:4200/');

        // Simple Check contains text
        cy.contains('ng-cypress app is running');

        // Selector
        cy.get('[role=main]').should('exist');

        // Case insensitive match
        cy.contains('Angular devtools', {matchCase: false}).should('exist');
        
        // Contains check inner html
        cy.contains('Deepen Dhamecha').should('not.exist'); 

        // Matches the text
        cy.get('.resources').should('have.text', 'Resources');
        // cy.get('.resources').should('eq', 'Resources');

        // Value
        cy.get('#dude').should('have.value', 'Dude');
        
        // cy.get('.resources').should('include', 'Reso');

        // Click
        // cy.contains('CLI Documentation').click();

        // It does not include new tab link
        // cy.url().should('include', '/cli');


        // Focus
        cy.get('#dude').focus();

        // invoke
        // cy.get('#dude').invoke('value').should('include', 'Dude');

        // Go Back
        // cy.go('back');

        // log
        cy.url().then(value => { // Since it is async
            cy.log('The current URL is: ', value);
        });

        // its
        // end
        // select
        // eq
        // getCookie/s / localStorage
        // cy.debug();
        cy.setCookie('name', 'Deepen');

        /**
         * cy.getCookie() yields a cookie object with the following properties:

            - domain
            - expiry (if specified)
            - httpOnly
            - name
            - path
            - sameSite (if specified)
            - secure
            - value
         */
        cy.getCookie('name').then(el => {
            cy.log(el.value);
        });

        // pause - To pause the execution so that it can be manually resume
        // cy.pause();

        // Wrap
        // Yield the object passed into .wrap(). If the object is a promise, yield its resolved value.
        cy.wrap({name: 'Dude'}).should('have.keys', 'name');
        cy.wrap({dude: (value) => console.log(value)}).invoke('dude', 'Deepen');
        cy.wrap({dude: (value) => console.log(value)}).should('have.keys', 'dude').invoke('dude', 'Deepen');
        
        // its
        cy.wrap({name: 'Deepen'}).its('name').then(e => {
            cy.log(e);
        })//.should('have.text', 'Deepen');
        

        // intercept
    });

    xit('Visit google search Deepen Dhamecha', () => {
        cy.visit('https://www.google.com/');
        cy.get('.gLFyf.gsfi').type('Deepen Dhamecha').type('{enter}');

        /**
         * Find Element based on text
         **/
        // This is called Sizzle format as selector
        // cy.get('a:contains("in.linkedin")').click();//.type('{enter}');

        // Same Thing
        // cy.contains('a', 'in.linkedin').click();
        // cy.contains('medium').should('exist');
        cy.get('[data-ved="2ahUKEwiT8PvIvqn3AhX8xDgGHTVIAlQQFnoECAMQAQ"]').should('exist');
    });

});
```
