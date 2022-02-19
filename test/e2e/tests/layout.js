describe("EditorLayout", () => {
  describe("file uploads", () => {
    beforeEach(() => {
      cy.visit("/?url=/documents/petstore.swagger.yaml")
    })

    describe("given one or more files are of an unexpected type", () => {
      it("should alert the user that their file(s) were rejected", () => {
        let dropped = 0
        const alert = cy.stub()

        cy.on("window:alert", (text) => {
          expect(text).to.equal("Sorry, there was an error processing your file.\nPlease drag and drop exactly one .yaml or .json OpenAPI definition file.")
        })
        cy.on("window:alert", alert)
        cy.on("window:alert", () => {
          // when this closure executes the previous alert have already been closed
          dropped += 1
          if (dropped === 1) {
            cy.get("[data-cy=\"dropzone\"]")
              .attachFile(["rejected.file.1", "rejected.file.2"], { subjectType: "input" })
              .then(() => {
                expect(alert.callCount).to.equal(2)
              })
          }
        })

        cy.get("[data-cy=\"dropzone\"]")
          .attachFile("rejected.file.1", { subjectType: "input" })
          .then(() => { dropped += 1 })
      })
    })

    describe("when more than one file of an expected type is dropped", () => {
      it("should alert the user that their file(s) were rejected", () => {
        const stub = cy.stub()
        cy.on("window:alert", stub)
        cy.on("window:alert", () => {
          expect(stub.calledOnce).to.be.true
          expect(stub.getCall(0)).to.be.calledWith("Sorry, there was an error processing your file.\nPlease drag and drop exactly one .yaml or .json OpenAPI definition file.")
        })

        cy.get("[data-cy=\"dropzone\"]")
          .attachFile(["rejected.file.1", "rejected.file.2"], { subjectType: "input" })
      })
    })

    describe("when one file of an expected type is dropped", () => {
      it("should update the editor content and the SwaggerUI", () => {
        /**
         * subjectType: 'drag-n-drop' doesn't work correctly as it generates
         * `dragleave` and then `dragenter` events (in that order), which manifests in always
         * seeing the dropzone overlay. The goal of this test is to see when the
         * file is uploaded that the editor content and rendered UI changes and
         * this goal is satisfied.
         */

        cy.get(".info", { timeout: 10000 }).should("be.visible")
        cy.get("[data-cy=\"dropzone\"]").attachFile("petstore.openapi.yaml", { subjectType: "input" })
        cy.get(".info .title .version-stamp .version").should("have.text", "OAS3")
      })
    })
  })
})
