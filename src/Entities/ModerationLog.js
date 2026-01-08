{
  "name": "ModerationLog",
  "type": "object",
  "properties": {
    "moderator_email": {
      "type": "string"
    },
    "moderator_name": {
      "type": "string"
    },
    "action": {
      "type": "string",
      "enum": [
        "pin",
        "unpin",
        "lock",
        "unlock",
        "delete_post",
        "delete_reply",
        "edit_post",
        "edit_reply",
        "ban_user",
        "unban_user"
      ]
    },
    "target_type": {
      "type": "string",
      "enum": [
        "post",
        "reply",
        "user"
      ]
    },
    "target_id": {
      "type": "string"
    },
    "target_title": {
      "type": "string"
    },
    "reason": {
      "type": "string"
    },
    "details": {
      "type": "string"
    }
  },
 