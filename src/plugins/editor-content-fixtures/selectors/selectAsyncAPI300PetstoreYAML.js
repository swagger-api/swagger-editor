const selectAsyncAPI300PetstoreYAML = () => `asyncapi: 3.0.0
info:
  title: Petstore
  version: 1.0.0
  description: The PetStore running in Kafka
channels:
  petstore.order.added:
    address: petstore.order.added
    messages:
      publish.message:
        title: New order for pet
        summary: A new order for a pet was added.
        name: Order
        contentType: application/json
        payload:
          $ref: '#/components/schemas/Order'
  petstore.order.deleted:
    address: petstore.order.deleted
    messages:
      publish.message:
        name: OrderId
        contentType: application/json
        payload:
          type: integer
          format: int64
  petstore.pet.added:
    address: petstore.pet.added
    messages:
      publish.message:
        name: Pet
        contentType: application/json
        payload:
          $ref: '#/components/schemas/Pet'
  petstore.pet.changed:
    address: petstore.pet.changed
    messages:
      publish.message:
        name: Pet
        contentType: application/json
        payload:
          $ref: '#/components/schemas/Pet'
  petstore.pet.deleted:
    address: petstore.pet.deleted
    messages:
      publish.message:
        name: PetId
        contentType: application/json
        payload:
          type: integer
          format: int64
operations:
  petstore.order.added.publish:
    action: receive
    channel:
      $ref: '#/channels/petstore.order.added'
    messages:
      - $ref: '#/channels/petstore.order.added/messages/publish.message'
  petstore.order.deleted.publish:
    action: receive
    channel:
      $ref: '#/channels/petstore.order.deleted'
    messages:
      - $ref: '#/channels/petstore.order.deleted/messages/publish.message'
  petstore.pet.added.publish:
    action: receive
    channel:
      $ref: '#/channels/petstore.pet.added'
    messages:
      - $ref: '#/channels/petstore.pet.added/messages/publish.message'
  petstore.pet.changed.publish:
    action: receive
    channel:
      $ref: '#/channels/petstore.pet.changed'
    messages:
      - $ref: '#/channels/petstore.pet.changed/messages/publish.message'
  petstore.pet.deleted.publish:
    action: receive
    channel:
      $ref: '#/channels/petstore.pet.deleted'
    messages:
      - $ref: '#/channels/petstore.pet.deleted/messages/publish.message'
components:
  schemas:
    Inventory:
      type: object
      additionalProperties:
        type: integer
        format: int64
    Order:
      type: object
      properties:
        id:
          type: integer
          format: int64
          example: 10
        petId:
          type: integer
          format: int64
          example: 198772
        quantity:
          type: integer
          format: int32
          example: 7
        shipDate:
          type: string
          format: date-time
        status:
          type: string
          description: Order Status
          example: approved
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
          example: 100000
        username:
          type: string
          example: fehguy
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
          example: 437 Lytton
        city:
          type: string
          example: Palo Alto
        state:
          type: string
          example: CA
        zip:
          type: string
          example: '94301'
      xml:
        name: address
    Category:
      type: object
      properties:
        id:
          type: integer
          format: int64
          example: 1
        name:
          type: string
          example: Dogs
      xml:
        name: category
    User:
      type: object
      properties:
        id:
          type: integer
          format: int64
          example: 10
        username:
          type: string
          example: theUser
        firstName:
          type: string
          example: John
        lastName:
          type: string
          example: James
        email:
          type: string
          example: john@email.com
        password:
          type: string
          example: '12345'
        phone:
          type: string
          example: '12345'
        userStatus:
          type: integer
          description: User Status
          format: int32
          example: 1
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
          example: 10
        name:
          type: string
          example: doggie
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
`;

export default selectAsyncAPI300PetstoreYAML;
