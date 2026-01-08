{
  "name": "Reply",
  "type": "object",
  "properties": {
    "post_id": {
      "type": "string",
      "description": "Post this reply belongs to"
    },
    "content": {
      "type": "string"
    },
    "author_name": {
      "type": "string"
    },
    "author_email": {
      "type": "string"
    }
  },
  "required": [
    "post_id",
    "content"
  ],
  "rls": {
    "create": {
      "created_by": "{{user.email}}"
    },
    "read": {},
    "update": {
      "$or": [
        {
          "created_by": "{{user.email}}"
        },
        {
          "user_condition": {
            "role": "admin"
          }
        }
      ]
    },
    "delete": {
      "$or": [
        {
          "created_by": "{{user.email}}"
        },
        {
          "user_condition": {
 