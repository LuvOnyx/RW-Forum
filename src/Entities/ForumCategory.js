{
  "name": "ForumCategory",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Category name"
    },
    "description": {
      "type": "string",
      "description": "Category description"
    },
    "icon": {
      "type": "string",
      "description": "Icon name from lucide-react"
    },
    "order": {
      "type": "number",
      "default": 0
    },
    "post_count": {
      "type": "number",
      "default": 0
    }
  },
  "required": [
    "name"
  ],
  "rls": {
    "create": {
      "user_condition": {
        "role": "admin"
      }
    },
    "read": {},
    "update": {
      "user_condition": {
        "role": "admin"
      }
    },
    "delete": {
      "user_condition": {
        "role": "admin"
      }
    }
  }
}