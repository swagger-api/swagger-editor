const selectOpenAPI320PetstoreYAML = () => `openapi: 3.2.0
info:
  title: Swagger Petstore - OpenAPI 3.2
  description: |-
    This is a sample Pet Store Server based on the OpenAPI 3.2 specification. You can find out more about
    Swagger at [https://swagger.io](https://swagger.io). In the third iteration of the pet store, we've switched to the design first approach!
    You can now help us improve the API whether it's by making changes to the definition itself or to the code.
    That way, with time, we can improve the API in general, and expose some of the new features in OAS 3.2.

    Some useful links:
    - [The Pet Store repository](https://github.com/swagger-api/swagger-petstore)
    - [The source API definition for the Pet Store](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)
    - [OpenAPI 3.2 Specification](https://spec.openapis.org/oas/v3.2.0.html)

  termsOfService: https://swagger.io/terms/
  contact:
    email: apiteam@swagger.io
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
  version: 1.0.13
externalDocs:
  description: Find out more about Swagger
  url: https://swagger.io
servers:
  - url: https://petstore32.swagger.io/api/v3
    description: Production server (OAS 3.2)
  - url: https://petstore-staging.swagger.io/api/v3
    description: Staging server
tags:
  - name: pet
    summary: Pet management operations
    description: Everything about your Pets
    externalDocs:
      description: Find out more
      url: https://swagger.io
  - name: store
    summary: Store and order management
    description: Access to Petstore orders and inventory
    externalDocs:
      description: Find out more about our store
      url: https://swagger.io
  - name: user
    summary: User account operations
    description: Operations about user management and authentication
paths:
  /pet:
    put:
      tags:
        - pet
      summary: Update an existing pet.
      description: Update an existing pet by Id.
      operationId: updatePet
      requestBody:
        description: Update an existent pet in the store
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Pet'
          application/xml:
            schema:
              $ref: '#/components/schemas/Pet'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/Pet'
        required: true
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'
            application/xml:
              schema:
                $ref: '#/components/schemas/Pet'
        '400':
          description: Invalid ID supplied
        '404':
          description: Pet not found
        '422':
          description: Validation exception
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
      security:
        - petstore_auth:
            - write:pets
            - read:pets
    post:
      tags:
        - pet
      summary: Add a new pet to the store.
      description: Add a new pet to the store.
      operationId: addPet
      requestBody:
        description: Create a new pet in the store
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Pet'
          application/xml:
            schema:
              $ref: '#/components/schemas/Pet'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/Pet'
        required: true
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'
            application/xml:
              schema:
                $ref: '#/components/schemas/Pet'
        '400':
          description: Invalid input
        '422':
          description: Validation exception
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
      security:
        - petstore_auth:
            - write:pets
            - read:pets
  /pet/findByStatus:
    get:
      tags:
        - pet
      summary: Finds Pets by status.
      description: Multiple status values can be provided with comma separated strings.
      operationId: findPetsByStatus
      parameters:
        - name: status
          in: query
          description: Status values that need to be considered for filter
          required: false
          explode: true
          schema:
            type: string
            default: available
            enum:
              - available
              - pending
              - sold
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
            application/xml:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
        '400':
          description: Invalid status value
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
      security:
        - petstore_auth:
            - write:pets
            - read:pets
  /pet/findByTags:
    get:
      tags:
        - pet
      summary: Finds Pets by tags.
      description: Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
      operationId: findPetsByTags
      parameters:
        - name: tags
          in: query
          description: Tags to filter by
          required: false
          explode: true
          schema:
            type: array
            items:
              type: string
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
            application/xml:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
        '400':
          description: Invalid tag value
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
      security:
        - petstore_auth:
            - write:pets
            - read:pets
  /pet/search:
    query:
      tags:
        - pet
      summary: Advanced pet search with complex criteria
      description: |-
        Search for pets using complex criteria sent in the request body.
        The QUERY method is a new HTTP method in OAS 3.2 that allows sending
        a request body with search parameters, providing more flexibility than GET.

        This endpoint demonstrates the QUERY HTTP method introduced in OAS 3.2.0
        per draft-ietf-httpbis-safe-method-w-body.
      operationId: searchPets
      parameters:
        - name: limit
          in: query
          description: Maximum number of results to return
          required: false
          schema:
            type: integer
            default: 20
            maximum: 100
        - name: offset
          in: query
          description: Number of results to skip for pagination
          required: false
          schema:
            type: integer
            default: 0
            minimum: 0
      requestBody:
        description: Complex search criteria for finding pets
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Filter by pet name (supports wildcards with *)
                  example: "Fluffy*"
                species:
                  type: string
                  description: Filter by species
                  enum:
                    - cat
                    - dog
                    - bird
                    - fish
                    - rabbit
                    - other
                  example: "cat"
                ageRange:
                  type: object
                  description: Filter by age range
                  properties:
                    min:
                      type: integer
                      minimum: 0
                      description: Minimum age in years
                    max:
                      type: integer
                      minimum: 0
                      description: Maximum age in years
                  example:
                    min: 1
                    max: 5
                status:
                  type: array
                  description: Filter by status (multiple values allowed)
                  items:
                    type: string
                    enum:
                      - available
                      - pending
                      - sold
                  example: ["available", "pending"]
                tags:
                  type: array
                  description: Filter by tags (AND logic - pet must have all tags)
                  items:
                    type: string
                  example: ["friendly", "indoor", "trained"]
                priceRange:
                  type: object
                  description: Filter by price range
                  properties:
                    min:
                      type: number
                      format: float
                      minimum: 0
                    max:
                      type: number
                      format: float
                      minimum: 0
                  example:
                    min: 100.0
                    max: 500.0
                sortBy:
                  type: string
                  description: Sort results by field
                  enum:
                    - name
                    - age
                    - price
                    - status
                  default: name
                  example: "price"
                sortOrder:
                  type: string
                  description: Sort order
                  enum:
                    - asc
                    - desc
                  default: asc
                  example: "asc"
            examples:
              searchFriendlyCats:
                summary: Search for friendly cats
                description: Find available cats under 5 years old with friendly temperament
                value:
                  species: "cat"
                  ageRange:
                    min: 0
                    max: 5
                  status: ["available"]
                  tags: ["friendly"]
                  sortBy: "age"
                  sortOrder: "asc"
              searchAffordableDogs:
                summary: Search for affordable dogs
                description: Find dogs within a budget range
                value:
                  species: "dog"
                  priceRange:
                    min: 100
                    max: 300
                  status: ["available"]
                  sortBy: "price"
                  sortOrder: "asc"
      responses:
        '200':
          description: Search results with pagination metadata
          content:
            application/json:
              schema:
                type: object
                properties:
                  results:
                    type: array
                    items:
                      $ref: '#/components/schemas/Pet'
                  total:
                    type: integer
                    description: Total number of matching results
                  limit:
                    type: integer
                    description: Maximum results per page
                  offset:
                    type: integer
                    description: Current offset
                  hasMore:
                    type: boolean
                    description: Whether there are more results available
              examples:
                searchResults:
                  summary: Example search results
                  value:
                    results:
                      - id: 10
                        name: "Fluffy"
                        category:
                          id: 1
                          name: "Cats"
                        status: "available"
                        tags:
                          - id: 1
                            name: "friendly"
                          - id: 2
                            name: "indoor"
                        photoUrls:
                          - "https://example.com/photos/fluffy.jpg"
                    total: 42
                    limit: 20
                    offset: 0
                    hasMore: true
        '400':
          description: Invalid search criteria
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '413':
          description: Request payload too large
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
      security:
        - petstore_auth:
            - read:pets
  /pet/{petId}:
    get:
      tags:
        - pet
      summary: Find pet by identifier.
      description: Returns a single pet.
      operationId: getPetById
      parameters:
        - name: petId
          in: path
          description: ID of pet to return
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'
            application/xml:
              schema:
                $ref: '#/components/schemas/Pet'
        '400':
          description: Invalid ID supplied
        '404':
          description: Pet not found
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
      security:
        - api_key: []
        - petstore_auth:
            - write:pets
            - read:pets
    post:
      tags:
        - pet
      summary: Updates a pet in the store with form data.
      description: update a pet via the form data.
      operationId: updatePetWithForm
      parameters:
        - name: petId
          in: path
          description: ID of pet that needs to be updated
          required: true
          schema:
            type: integer
            format: int64
        - name: name
          in: query
          description: Name of pet that needs to be updated
          schema:
            type: string
        - name: status
          in: query
          description: Status of pet that needs to be updated
          schema:
            type: string
      responses:
        '200':
          description: successfully updated
        '400':
          description: Invalid input
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
      security:
        - petstore_auth:
            - write:pets
            - read:pets
    delete:
      tags:
        - pet
      summary: Deletes a pet.
      description: delete a pet.
      operationId: deletePet
      parameters:
        - name: api_key
          in: header
          description: ''
          required: false
          schema:
            type: string
        - name: petId
          in: path
          description: Pet id to delete
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '200':
          description: successful operation
        '400':
          description: Invalid pet value
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
      security:
        - petstore_auth:
            - write:pets
            - read:pets
  /pet/{petId}/uploadImage:
    post:
      tags:
        - pet
      summary: Uploads an image.
      description: Upload an image of pet.
      operationId: uploadFile
      parameters:
        - name: petId
          in: path
          description: ID of pet to update
          required: true
          schema:
            type: integer
            format: int64
        - name: additionalMetadata
          in: query
          description: Additional Metadata
          required: false
          schema:
            type: string
      requestBody:
        content:
          application/octet-stream:
            schema:
              type: string
              format: binary
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiResponse'
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
      security:
        - petstore_auth:
            - write:pets
            - read:pets
  /store/inventory:
    get:
      tags:
        - store
      summary: Returns pet inventories by status.
      description: Returns a map of status codes to quantities.
      operationId: getInventory
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                type: object
                additionalProperties:
                  type: integer
                  format: int32
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
      security:
        - api_key: []
  /store/order:
    post:
      tags:
        - store
      summary: Place an order for a pet.
      description: Place a new order in the store.
      operationId: placeOrder
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Order'
          application/xml:
            schema:
              $ref: '#/components/schemas/Order'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/Order'
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '400':
          description: Invalid input
        '422':
          description: Validation exception
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
  /store/order/search:
    query:
      tags:
        - store
      summary: Search orders with complex filters
      description: |-
        Search for orders using complex criteria in the request body.
        Demonstrates the QUERY HTTP method for advanced order filtering.

        The QUERY method allows passing complex search parameters in a structured
        request body while maintaining the safe and idempotent semantics of GET.
      operationId: searchOrders
      parameters:
        - name: page
          in: query
          description: Page number for pagination
          schema:
            type: integer
            default: 1
            minimum: 1
        - name: pageSize
          in: query
          description: Number of results per page
          schema:
            type: integer
            default: 20
            minimum: 1
            maximum: 100
      requestBody:
        description: Order search criteria
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                orderId:
                  type: integer
                  format: int64
                  description: Search by specific order ID
                petId:
                  type: integer
                  format: int64
                  description: Filter by pet ID
                status:
                  type: array
                  description: Filter by order status
                  items:
                    type: string
                    enum:
                      - placed
                      - approved
                      - delivered
                  example: ["approved", "delivered"]
                dateRange:
                  type: object
                  description: Filter by ship date range
                  properties:
                    from:
                      type: string
                      format: date-time
                      description: Start date (inclusive)
                    to:
                      type: string
                      format: date-time
                      description: End date (inclusive)
                  example:
                    from: "2024-01-01T00:00:00Z"
                    to: "2024-12-31T23:59:59Z"
                quantityRange:
                  type: object
                  description: Filter by quantity range
                  properties:
                    min:
                      type: integer
                      minimum: 0
                    max:
                      type: integer
                      minimum: 0
                  example:
                    min: 1
                    max: 10
                complete:
                  type: boolean
                  description: Filter by completion status
                  example: true
                sortBy:
                  type: string
                  enum:
                    - id
                    - shipDate
                    - quantity
                    - status
                  default: shipDate
                  description: Field to sort by
                sortOrder:
                  type: string
                  enum:
                    - asc
                    - desc
                  default: desc
                  description: Sort direction
            examples:
              recentCompletedOrders:
                summary: Recent completed orders
                description: Find recently delivered orders from the last month
                value:
                  status: ["delivered"]
                  complete: true
                  dateRange:
                    from: "2024-11-01T00:00:00Z"
                    to: "2024-11-30T23:59:59Z"
                  sortBy: "shipDate"
                  sortOrder: "desc"
              bulkOrders:
                summary: Bulk orders
                description: Find orders with quantity greater than 5
                value:
                  quantityRange:
                    min: 5
                  status: ["approved", "delivered"]
                  sortBy: "quantity"
                  sortOrder: "desc"
      responses:
        '200':
          description: Search results with pagination
          content:
            application/json:
              schema:
                type: object
                properties:
                  orders:
                    type: array
                    items:
                      $ref: '#/components/schemas/Order'
                  pagination:
                    type: object
                    properties:
                      page:
                        type: integer
                      pageSize:
                        type: integer
                      totalPages:
                        type: integer
                      totalResults:
                        type: integer
              examples:
                orderResults:
                  summary: Example order search results
                  value:
                    orders:
                      - id: 10
                        petId: 198772
                        quantity: 7
                        shipDate: "2024-11-15T10:30:00Z"
                        status: "delivered"
                        complete: true
                      - id: 11
                        petId: 198773
                        quantity: 3
                        shipDate: "2024-11-14T14:20:00Z"
                        status: "delivered"
                        complete: true
                    pagination:
                      page: 1
                      pageSize: 20
                      totalPages: 3
                      totalResults: 45
        '400':
          description: Invalid search parameters
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '413':
          description: Request payload too large
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
      security:
        - api_key: []
  /store/order/{orderId}:
    get:
      tags:
        - store
      summary: Find purchase order by identifier.
      description: For valid response try integer IDs with value <= 5 or > 10. Other values will generate exceptions.
      operationId: getOrderById
      parameters:
        - name: orderId
          in: path
          description: ID of order that needs to be fetched
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
            application/xml:
              schema:
                $ref: '#/components/schemas/Order'
        '400':
          description: Invalid ID supplied
        '404':
          description: Order not found
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
    delete:
      tags:
        - store
      summary: Delete purchase order by identifier.
      description: For valid response try integer IDs with value < 1000. Anything above 1000 or non-integers will generate API errors.
      operationId: deleteOrder
      parameters:
        - name: orderId
          in: path
          description: ID of the order that needs to be deleted
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '200':
          description: successful operation
        '400':
          description: Invalid ID supplied
        '404':
          description: Order not found
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
  /user:
    post:
      tags:
        - user
      summary: Create user.
      description: This can only be done by the logged in user.
      operationId: createUser
      requestBody:
        description: Created user object
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
          application/xml:
            schema:
              $ref: '#/components/schemas/User'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/User'
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
            application/xml:
              schema:
                $ref: '#/components/schemas/User'
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
  /user/createWithList:
    post:
      tags:
        - user
      summary: Creates list of users with given input array.
      description: Creates list of users with given input array.
      operationId: createUsersWithListInput
      requestBody:
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/User'
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
            application/xml:
              schema:
                $ref: '#/components/schemas/User'
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
  /user/login:
    get:
      tags:
        - user
      summary: Logs user into the system.
      description: log user into the system.
      operationId: loginUser
      parameters:
        - name: username
          in: query
          description: The user name for login
          required: false
          schema:
            type: string
        - name: password
          in: query
          description: The password for login in clear text
          required: false
          schema:
            type: string
      responses:
        '200':
          description: successful operation
          headers:
            X-Rate-Limit:
              description: calls per hour allowed by the user
              schema:
                type: integer
                format: int32
            X-Expires-After:
              description: date in UTC when token expires
              schema:
                type: string
                format: date-time
          content:
            application/xml:
              schema:
                type: string
            application/json:
              schema:
                type: string
        '400':
          description: Invalid username/password supplied
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
  /user/logout:
    get:
      tags:
        - user
      summary: Logs out current logged in user session.
      description: Log user out of system.
      operationId: logoutUser
      parameters: []
      responses:
        '200':
          description: successful operation
        default:
          description: successful operation
  /user/{username}:
    get:
      tags:
        - user
      summary: Get user by user name.
      description: Get user details based on username.
      operationId: getUserByName
      parameters:
        - name: username
          in: path
          description: The name that needs to be fetched. Use user1 for testing
          required: true
          schema:
            type: string
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
            application/xml:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          description: Invalid username supplied
        '404':
          description: User not found
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
    put:
      tags:
        - user
      summary: Update user.
      description: This can only be done by the logged in user.
      operationId: updateUser
      parameters:
        - name: username
          in: path
          description: name that need to be deleted
          required: true
          schema:
            type: string
      requestBody:
        description: Update an existent user in the store
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
          application/xml:
            schema:
              $ref: '#/components/schemas/User'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/User'
      responses:
        '200':
          description: successful operation
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
    delete:
      tags:
        - user
      summary: Delete user.
      description: This can only be done by the logged in user.
      operationId: deleteUser
      parameters:
        - name: username
          in: path
          description: The name that needs to be deleted
          required: true
          schema:
            type: string
      responses:
        '200':
          description: successful operation
        '400':
          description: Invalid username supplied
        '404':
          description: User not found
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
components:
  schemas:
    Order:
      type: object
      properties:
        id:
          type: integer
          format: int64
          examples: [10]
        petId:
          type: integer
          format: int64
          examples: [198772]
        quantity:
          type: integer
          format: int32
          examples: [7]
        shipDate:
          type: string
          format: date-time
        status:
          type: string
          description: Order Status
          examples: [approved]
          enum:
            - placed
            - approved
            - delivered
        complete:
          type: boolean
      xml:
        name: order
    Customer:
      type: object
      properties:
        id:
          type: integer
          format: int64
          examples: [100000]
        username:
          type: string
          examples: [fehguy]
        address:
          type: array
          xml:
            name: addresses
            wrapped: true
          items:
            $ref: '#/components/schemas/Address'
      xml:
        name: customer
    Address:
      type: object
      properties:
        street:
          type: string
          examples: [437 Lytton]
        city:
          type: string
          examples: [Palo Alto]
        state:
          type: string
          examples: [CA]
        zip:
          type: string
          examples: ['94301']
      xml:
        name: address
    Category:
      type: object
      properties:
        id:
          type: integer
          format: int64
          examples: [1]
        name:
          type: string
          examples: [Dogs]
      xml:
        name: category
    User:
      type: object
      properties:
        id:
          type: integer
          format: int64
          examples: [10]
        username:
          type: string
          examples: [theUser]
        firstName:
          type: string
          examples: [John]
        lastName:
          type: string
          examples: [James]
        email:
          type: string
          examples: [john@email.com]
        password:
          type: string
          examples: ['12345']
        phone:
          type: string
          examples: ['12345']
        userStatus:
          type: integer
          description: User Status
          format: int32
          examples: [1]
      xml:
        name: user
    Tag:
      type: object
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
      xml:
        name: tag
    Pet:
      required:
        - name
        - photoUrls
      type: object
      properties:
        id:
          type: integer
          format: int64
          examples: [10]
        name:
          type: string
          examples: [doggie]
        category:
          $ref: '#/components/schemas/Category'
        photoUrls:
          type: array
          xml:
            wrapped: true
          items:
            type: string
            xml:
              name: photoUrl
        tags:
          type: array
          xml:
            wrapped: true
          items:
            $ref: '#/components/schemas/Tag'
        status:
          type: string
          description: pet status in the store
          enum:
            - available
            - pending
            - sold
      xml:
        name: pet
    ApiResponse:
      type: object
      properties:
        code:
          type: integer
          format: int32
        type:
          type: string
        message:
          type: string
      xml:
        name: '##default'
    Error:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
      required:
        - code
        - message
  requestBodies:
    Pet:
      description: Pet object that needs to be added to the store
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Pet'
        application/xml:
          schema:
            $ref: '#/components/schemas/Pet'
    UserArray:
      description: List of user object
      content:
        application/json:
          schema:
            type: array
            items:
              $ref: '#/components/schemas/User'
  securitySchemes:
    petstore_auth:
      type: oauth2
      flows:
        implicit:
          authorizationUrl: https://petstore3.swagger.io/oauth/authorize
          scopes:
            "write:pets": modify pets in your account
            "read:pets": read your pets
    api_key:
      type: apiKey
      name: api_key
      in: header
`;

export default selectOpenAPI320PetstoreYAML;
