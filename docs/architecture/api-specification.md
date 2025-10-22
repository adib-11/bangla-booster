# API Specification

## REST API Specification

```yaml
openapi: 3.0.0
info:
  title: AI Chat-Web Platform API
  version: 1.0.0
  description: API for managing products and owner accounts for the prototype.
servers:
  - url: /api # Assuming Next.js API routes base path
    description: Development server

paths:
  /auth/signup:
    post:
      summary: Register a new business owner (Story 1.2)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
      responses:
        '201':
          description: Owner created successfully
        '400':
          description: Invalid input or email already exists
  /auth/login:
    post:
      summary: Log in an existing business owner
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
      responses:
        '200':
          description: Login successful (returns session token/cookie)
        '401':
          description: Unauthorized
  /owner/subdomain:
    post:
      summary: Set owner's business name and generate subdomain (Story 1.3)
      security:
        - cookieAuth: [] # Or appropriate auth scheme
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                businessName:
                  type: string
      responses:
        '200':
          description: Subdomain set successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  subdomain:
                    type: string
        '400':
          description: Invalid business name or subdomain already taken
        '401':
          description: Unauthorized
  /products:
    post:
      summary: Add a new product (Story 1.5)
      security:
        - cookieAuth: []
      requestBody:
        required: true
        content:
          # Assuming image upload is handled separately (e.g., via presigned URL)
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
                price:
                  type: string # Using String based on previous discussion
                imageUrl:
                  type: string
                  format: url
      responses:
        '201':
          description: Product created successfully
        '400':
          description: Invalid input
        '401':
          description: Unauthorized
    get:
      summary: Get products for a specific owner/subdomain (Story 1.6)
      parameters:
        - name: subdomain
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: List of products
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'
        '404':
          description: Subdomain/Owner not found

  # Chatbot webhook endpoint is separate (e.g., /api/webhook/messenger)

components:
  schemas:
    Product:
      type: object
      properties:
        id:
          type: string
          format: uuid
        ownerId:
          type: string
          format: uuid
        title:
          type: string
        price:
          type: string # Consistent with request body
        imageUrl:
          type: string
          format: url
  securitySchemes:
    cookieAuth: # Example using cookies via NextAuth.js
      type: apiKey
      in: cookie
      name: next-auth.session-token # Adjust name as needed
```

-----
