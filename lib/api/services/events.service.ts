import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  Event,
  EventsResponse,
  CreateEventRequest,
  UpdateEventRequest,
} from "@/types";

export const eventsService = {
  async getEvents(
    page = 1,
    limit = 10,
    search?: string,
    category?: string,
    status?: string
  ): Promise<EventsResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (status) params.append("status", status);
    const url = `${endpoints.events}?${params.toString()}`;
    const response = await apiClient.get<any>(url);
    
    // Transform backend response to frontend format
    // Backend returns: { events: [...], pagination: {...} }
    // Frontend expects: { data: [...], meta: {...} }
    if (response && typeof response === 'object') {
      // Check if response has events and pagination (backend format)
      if ('events' in response && 'pagination' in response) {
        const transformedEvents = response.events.map((event: any) => ({
          ...event,
          image: event.imageUrl || event.image,
          requiresRegistration: event.requiresRegistration ?? true,
          registeredCount: event._count?.registrations || event.registeredCount || 0,
        }));
        
        return {
          data: transformedEvents,
          meta: {
            page: response.pagination.page,
            limit: response.pagination.limit,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
          },
        };
      }
      
      // If already in correct format, transform events
      if ('data' in response && 'meta' in response) {
        const transformedEvents = (response.data || []).map((event: any) => ({
          ...event,
          image: event.imageUrl || event.image,
          requiresRegistration: event.requiresRegistration ?? true,
          registeredCount: event._count?.registrations || event.registeredCount || 0,
        }));
        
        return {
          data: transformedEvents,
          meta: response.meta,
        };
      }
    }
    
    // Fallback
    return {
      data: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  },

  async getEventById(id: string): Promise<Event> {
    return apiClient.get<Event>(`${endpoints.events}/${id}`);
  },

  async createEvent(data: CreateEventRequest): Promise<Event> {
    return apiClient.post<Event>(endpoints.events, data);
  },

  async updateEvent(id: string, data: UpdateEventRequest): Promise<Event> {
    return apiClient.patch<Event>(`${endpoints.events}/${id}`, data);
  },

  async deleteEvent(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.events}/${id}`);
  },
};

