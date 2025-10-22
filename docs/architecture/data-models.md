# Data Models

## Owner

  * **Purpose:** Represents the business owner who signs up and manages products.

  * **Key Attributes:**

      * `id`: `UUID` - Unique identifier
      * `email`: `String` - Owner's login email
      * `hashedPassword`: `String` - For authentication
      * `businessName`: `String` - Used for display and subdomain generation
      * `subdomain`: `String` - Unique subdomain assigned to the owner
      * `facebookPageId`: `String` (Optional) - Linked Facebook Page ID for chatbot
      * `facebookPageToken`: `String` (Optional, Encrypted) - Secure token for Messenger API access

  * **TypeScript Interface:**

    ```typescript
    interface Owner {
      id: string; // UUID
      email: string;
      businessName: string;
      subdomain: string;
      facebookPageId?: string;
      // Note: hashedPassword and facebookPageToken are backend-only
    }
    ```

  * **Relationships:**

      * One Owner has many Products.

## Product

  * **Purpose:** Represents a product listed by a business owner.

  * **Key Attributes:**

      * `id`: `UUID` - Unique identifier
      * `ownerId`: `UUID` - Foreign key linking to the Owner
      * `title`: `String` - Product name
      * `price`: `String` - Product price (Using String for simplicity, validated via CHECK constraint)
      * `imageUrl`: `String` - URL of the uploaded product image

  * **TypeScript Interface:**

    ```typescript
    interface Product {
      id: string; // UUID
      ownerId: string; // UUID
      title: string;
      price: string; // Using String type
      imageUrl: string;
    }
    ```

  * **Relationships:**

      * Many Products belong to one Owner.

-----
