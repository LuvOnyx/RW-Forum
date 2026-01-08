{
  "name": "Application",
  "type": "object",
  "properties": {
    "discord_name": {
      "type": "string",
      "description": "Discord username"
    },
    "age": {
      "type": "number"
    },
    "timezone": {
      "type": "string"
    },
    "rp_experience": {
      "type": "string",
      "description": "Previous RP experience"
    },
    "character_backstory": {
      "type": "string",
      "description": "Character backstory"
    },
    "why_join": {
      "type": "string",
      "description": "Why do you want to join"
    },
    "rules_agreement": {
      "type": "boolean",
      "default": false
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "approved",
        "denied",
        "interview"
      ],
      "default": "pending"
    },
    "reviewer_notes": {
      "type": "string"
    }
  },
  "required": [
    "discord_name",
 