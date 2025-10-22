# External APIs

## Facebook Messenger API

  * **Purpose:** Receive messages and send chatbot responses (Stories 2.1-2.4).
  * **Documentation:** [https://developers.facebook.com/docs/messenger-platform/](https://developers.facebook.com/docs/messenger-platform/)
  * **Base URL(s):** `https://graph.facebook.com/v<API_VERSION>/me/messages`.
  * **Authentication:** Page Access Token (obtained via OAuth, Story 2.1). Securely stored.
  * **Rate Limits:** Standard limits apply; unlikely issue for prototype.
  * **Key Endpoints Used:**
      * `POST /me/messages`: To send messages.
      * Webhook Endpoint (Our Chatbot Function): To receive messages.
  * **Integration Notes:** Requires Facebook App setup, webhook config, permissions request, verification. App approval may be needed.

-----
