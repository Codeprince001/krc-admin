import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  Announcement,
  AnnouncementsResponse,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
} from "@/types";

export const announcementsService = {
  async getAnnouncements(
    page = 1,
    limit = 10,
    search?: string
  ): Promise<AnnouncementsResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    const url = `${endpoints.announcements}?${params.toString()}`;
    const response = await apiClient.get<any>(url);
    
    // Transform backend response format { announcements, pagination } 
    // to frontend expected format { data, meta }
    if (response && typeof response === 'object') {
      if ('announcements' in response && 'pagination' in response) {
        // Transform announcement objects: imageUrl -> image
        const transformedAnnouncements = response.announcements.map((announcement: any) => ({
          ...announcement,
          image: announcement.imageUrl || undefined,
          // Remove fields that don't exist in backend
          isActive: true, // Default value since backend doesn't have this field
        }));
        
        return {
          data: transformedAnnouncements,
          meta: {
            page: response.pagination.page,
            limit: response.pagination.limit,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
          },
        };
      }
      // If already in correct format, return as is
      if ('data' in response && 'meta' in response) {
        return response;
      }
    }
    
    return response;
  },

  async getAnnouncementById(id: string): Promise<Announcement> {
    const response = await apiClient.get<any>(`${endpoints.announcements}/${id}`);
    // Transform backend response: imageUrl -> image
    if (response && typeof response === 'object') {
      return {
        ...response,
        image: response.imageUrl || undefined,
        isActive: true, // Default value since backend doesn't have this field
      } as Announcement;
    }
    return response;
  },

  async createAnnouncement(
    data: CreateAnnouncementRequest
  ): Promise<Announcement> {
    const response = await apiClient.post<any>(
      endpoints.announcements,
      data
    );
    const announcement = (response as any).announcement || response;
    // Transform backend response: imageUrl -> image
    if (announcement && typeof announcement === 'object') {
      return {
        ...announcement,
        image: announcement.imageUrl || undefined,
        isActive: true, // Default value since backend doesn't have this field
      } as Announcement;
    }
    return announcement;
  },

  async updateAnnouncement(
    id: string,
    data: UpdateAnnouncementRequest
  ): Promise<Announcement> {
    const response = await apiClient.patch<any>(`${endpoints.announcements}/${id}`, data);
    // Transform backend response: imageUrl -> image
    if (response && typeof response === 'object') {
      return {
        ...response,
        image: response.imageUrl || undefined,
        isActive: true, // Default value since backend doesn't have this field
      } as Announcement;
    }
    return response;
  },

  async deleteAnnouncement(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.announcements}/${id}`);
  },
};

