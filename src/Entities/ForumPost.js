{
  "name": "ForumPost",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Post title"
    },
    "content": {
      "type": "string",
      "description": "Post content"
    },
    "category_id": {
      "type": "string",
      "description": "Category this post belongs to"
    },
    "author_name": {
      "type": "string",
      "description": "Author display name"
    },
    "author_email": {
      "type": "string"
    },
    "views": {
      "type": "number",
      "default": 0
    },
    "replies": {
      "type": "number",
      "default": 0
    },
    "is_pinned": {
      "type": "boolean",
      "default": false
    },
    "is_locked": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "title",
    "content",
    "category_id"
  ],
  "rls": {
 