describe("Editor #1862: codegen download links downgrade HTTPS", () => {
  describe("in Swagger 2", () => {
    beforeEach(() => {
      cy.visit("/?url=/documents/petstore.swagger.yaml")

      cy.server()

      cy.route({
        url: "*//generator.swagger.io/api/gen/servers",
        response: ["nodejs"]
      })

      cy.route({
        url: "*//generator.swagger.io/api/gen/clients",
        response: ["javascript"]
      })
    })

    it("should force HTTPS server downloads from Swagger.io Generator", () => {
      let wasHttpHit = false
      let wasHttpsHit = false

      // Given

      cy.route({
        url: "https://generator.swagger.io/api/gen/servers/nodejs",
        method: "POST",
        response: {
          "code": "a92bc815-f6e3-4a56-839b-fd2e6f379d52",
          "link": "http://generator.swagger.io:80/api/gen/download/a92bc815-f6e3-4a56-839b-fd2e6f379d52"
        }
      }).as("httpsServerNodejs")

      cy.route({
        url: "http://generator.swagger.io/api/gen/download/*",
        onRequest: () => wasHttpHit = true,
        response: {}
      }).as("httpServerGenDownload")

      cy.route({
        url: "https://generator.swagger.io/api/gen/download/*",
        onRequest: () => wasHttpsHit = true,
        response: {}
      }).as("httpsServerGenDownload")

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

      cy.route({
        url: "https://generator.swagger.io/api/gen/clients/javascript",
        method: "POST",
        response: {
          "code": "a92bc815-f6e3-4a56-839b-fd2e6f379d52",
          "link": "http://generator.swagger.io:80/api/gen/download/a92bc815-f6e3-4a56-839b-fd2e6f379d52"
        }
      }).as("httpsClientJavascript")

      cy.route({
        url: "http://generator.swagger.io/api/gen/download/*",
        onRequest: () => wasHttpHit = true,
        response: {}
      }).as("httpClientGenDownload")

      cy.route({
        url: "https://generator.swagger.io/api/gen/download/*",
        onRequest: () => wasHttpsHit = true,
        response: {}
      }).as("httpsClientGenDownload")

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
