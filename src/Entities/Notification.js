{
  "name": "Notification",
  "type": "object",
  "properties": {
    "user_email": {
      "type": "string",
      "description": "Email of user receiving notification"
    },
    "type": {
      "type": "string",
      "enum": [
        "reply",
        "mention",
        "quote",
        "announcement"
      ],
      "description": "Type of notification"
    },
    "title": {
      "type": "string"
    },
    "message": {
      "type": "string"
    },
    "link": {
      "type": "string",
      "description": "URL to navigate to"
    },
    "is_read": {
      "type": "boolean",
      "default": false
    },
    "related_post_id": {
      "type": "string"
    },
    "related_user_email": {
      "type": "string",
      "description": "User who triggered the notification"
    }
  },
  "required": [
    "user_email",
    "type",
    "title",
    "message"
  ]
}