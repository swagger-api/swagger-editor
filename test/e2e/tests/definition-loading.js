describe("Menu Definition Loading", () => {
    describe("Should support OAS2.0 and OAS3.0 loading options", () => {
        beforeEach(() => {
            cy.visit("/")
        })

        describe("When Load Petstore OAS2.0 is chosen from menu", () => {
            it("should load the definition into the editor", () => {

                cy.contains("Edit").click()
                cy.wait(50).contains("Load Petstore OAS 2.0").click()

                cy.get(".info", { timeout: 10000 }).should("be.visible")
                cy.get(".info .title").should("have.text", "Swagger Petstore 2.0 1.0.0 ")
            })
        })

        describe("When Load Petstore OAS3.0 is chosen from menu", () => {
            it("should load the definition into the editor", () => {

                cy.contains("Edit").click()
                cy.wait(50).contains("Load Petstore OAS 3.0").click()

                cy.get(".info", { timeout: 10000 }).should("be.visible")
                cy.get(".info .title .version-stamp .version").should("have.text", "OAS3")
            })
        })
    })
})