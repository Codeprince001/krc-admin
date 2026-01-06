const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3009/api";

export const endpoints = {
  // Auth
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    profile: `${API_BASE_URL}/auth/profile`,
    logout: `${API_BASE_URL}/auth/logout`,
    refresh: `${API_BASE_URL}/auth/refresh`,
  },
  // Admin
  admin: {
    dashboard: `${API_BASE_URL}/admin/dashboard`,
    analytics: {
      users: `${API_BASE_URL}/admin/analytics/users`,
      revenue: `${API_BASE_URL}/admin/analytics/revenue`,
      content: `${API_BASE_URL}/admin/analytics/content`,
      community: `${API_BASE_URL}/admin/analytics/community`,
    },
    systemHealth: `${API_BASE_URL}/admin/system/health`,
    activityLog: `${API_BASE_URL}/admin/activity-log`,
  },
  // Users
  users: {
    list: `${API_BASE_URL}/users`,
    stats: `${API_BASE_URL}/users/stats`,
    detail: (id: string) => `${API_BASE_URL}/users/${id}`,
    updateRole: (id: string) => `${API_BASE_URL}/users/${id}/role`,
    toggleStatus: (id: string) => `${API_BASE_URL}/users/${id}/toggle-status`,
    delete: (id: string) => `${API_BASE_URL}/users/${id}`,
  },
  // Content modules
  books: `${API_BASE_URL}/books`,
  sermons: `${API_BASE_URL}/sermons`,
  devotionals: `${API_BASE_URL}/devotionals`,
  announcements: `${API_BASE_URL}/announcements`,
  events: `${API_BASE_URL}/events`,
  prayerRequests: `${API_BASE_URL}/prayer-requests`,
  testimonies: `${API_BASE_URL}/testimonies`,
  groups: `${API_BASE_URL}/groups`,
  orders: `${API_BASE_URL}/orders`,
  giving: `${API_BASE_URL}/giving`,
  payments: `${API_BASE_URL}/payments`,
  media: `${API_BASE_URL}/media`,
  notifications: `${API_BASE_URL}/notifications`,
  counseling: `${API_BASE_URL}/counseling`,
  games: `${API_BASE_URL}/games`,
  wordsOfWisdom: `${API_BASE_URL}/words-of-wisdom`,
  wordsOfKnowledge: `${API_BASE_URL}/words-of-knowledge`,
};

