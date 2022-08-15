describe("Topbar about section and new editor launch", () => {
    describe("Should contain populated about section and new editor launch", () => {
        beforeEach(() => {
            cy.visit("/")
        })

        describe("When About option is chosen from menu", () => {
            it("should load dropdown menu with 3 options", () => {
                cy.contains("About").click()
                cy.get(".swagger-editor-standalone .dd-menu.dd-menu-left .dd-menu-items", { timeout: 1000 }).should("be.visible")
                cy.get(".swagger-editor-standalone .dd-menu .dd-menu-items ul li").should("have.text", "About Swagger EditorView DocsView on GitHub")
            })
        })

        describe("When topbar loads", () => {
            it("should have call to action button to launch new editor", () => {
                cy.get(".swagger-editor-standalone .new-editor-cta", { timeout: 1000 }).should("be.visible")
                cy.get(".swagger-editor-standalone .new-editor-cta").should("have.text", "Try our new Editor")
            })
        })
    })
})