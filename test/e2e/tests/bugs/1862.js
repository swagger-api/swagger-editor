describe("Editor #1862: codegen download links downgrade HTTPS", () => {
  describe("in Swagger 2", () => {
    beforeEach(() => {
      cy.visit("/?url=/documents/petstore.swagger.yaml")

      cy.intercept("*//generator.swagger.io/api/gen/servers", {
        body: ["nodejs-server"]
      })

      cy.intercept("*//generator.swagger.io/api/gen/clients", {
        body: ["javascript"]
      })
    })

    it("should force HTTPS server downloads from Swagger.io Generator", () => {
      let wasHttpHit = false
      let wasHttpsHit = false

      // Given

      cy.intercept("POST", "https://generator.swagger.io/api/gen/servers/nodejs-server", {
        body: {
          "code": "a92bc815-f6e3-4a56-839b-fd2e6f379d52",
          "link": "http://generator.swagger.io:80/api/gen/download/a92bc815-f6e3-4a56-839b-fd2e6f379d52"
        }
      }).as("httpsServerNodejs")

      cy.intercept("http://generator.swagger.io/api/gen/download/*", () => { wasHttpHit = true }).as("httpServerGenDownload")

      cy.intercept("https://generator.swagger.io/api/gen/download/*", () => { wasHttpsHit = true }).as("httpsServerGenDownload")

      // Then
      cy.contains("Generate Server")
        .click()

      cy.contains("nodejs")
        .click()

      cy.wait(["@httpsServerNodejs", "@httpsServerGenDownload"])
        .then(() => {
          expect(wasHttpHit).to.equal(false, "has HTTP server been hit")
          expect(wasHttpsHit).to.equal(true, "has HTTPS server been hit")
        })
    })

    it("should force HTTPS client downloads from Swagger.io Generator", () => {
      let wasHttpHit = false
      let wasHttpsHit = false

      // Given

      cy.intercept("POST", "https://generator.swagger.io/api/gen/clients/javascript", {
        body: {
          "code": "a92bc815-f6e3-4a56-839b-fd2e6f379d52",
          "link": "http://generator.swagger.io:80/api/gen/download/a92bc815-f6e3-4a56-839b-fd2e6f379d52"
        }
      }).as("httpsClientJavascript")

      cy.intercept("http://generator.swagger.io/api/gen/download/*", () => wasHttpHit = true).as("httpClientGenDownload")

      cy.intercept("https://generator.swagger.io/api/gen/download/*", () => wasHttpsHit = true).as("httpsClientGenDownload")

      // Then
      cy.contains("Generate Client")
        .click()

      cy.contains("javascript")
        .click()

      cy.wait(["@httpsClientJavascript", "@httpsClientGenDownload"])
        .then(() => {
          expect(wasHttpHit).to.equal(false, "has HTTP server been hit")
          expect(wasHttpsHit).to.equal(true, "has HTTPS server been hit")
        })
    })
  })
})
