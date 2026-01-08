// Temporary stub file - Replace with your MongoDB API client
// This file prevents import errors while migrating away from base44

console.warn('base44Client.js is deprecated. Please migrate to your MongoDB API.');

export const base44 = {
  auth: {
    isAuthenticated: async () => {
      console.warn('base44.auth.isAuthenticated() called - needs MongoDB implementation');
      return false;
    },
    me: async () => {
      console.warn('base44.auth.me() called - needs MongoDB implementation');
      return null;
    }
  },
  entities: {
    Notification: {
      filter: async () => [],
      update: async () => ({}),
      create: async () => ({})
    },
    ModerationLog: {
      filter: async () => [],
      create: async () => ({})
    }
  },
  appLogs: {
    logUserInApp: async () => {}
  }
};

export default base44;
