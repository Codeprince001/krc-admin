import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  Group,
  GroupsResponse,
  CreateGroupRequest,
  UpdateGroupRequest,
  ModerationQueueResponse,
  ReportedPostsResponse,
  GroupPost,
  GroupPostReport,
  ApprovePostRequest,
  RejectPostRequest,
  UpdateReportStatusRequest,
  ReportStatus,
} from "@/types";

export const groupsService = {
  async getGroups(
    page = 1,
    limit = 10,
    search?: string
  ): Promise<GroupsResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    const url = `${endpoints.groups}?${params.toString()}`;
    const response = await apiClient.get<any>(url);
    
    // Transform backend response format
    if (response && typeof response === 'object') {
      if ('groups' in response && 'pagination' in response) {
        const transformedGroups = response.groups.map((group: any) => ({
          ...group,
          category: group.type || group.category,
          image: group.coverUrl || group.imageUrl || group.image,
          isActive: group.isActive ?? true, // Default to true if not provided
          memberCount: group.memberCount || 0,
        }));
        
        return {
          data: transformedGroups,
          meta: {
            page: response.pagination.page,
            limit: response.pagination.limit,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
          },
        };
      }
      if ('data' in response && 'meta' in response) {
        // Transform individual items
        const transformedData = response.data.map((group: any) => ({
          ...group,
          category: group.type || group.category,
          image: group.coverUrl || group.imageUrl || group.image,
          isActive: group.isActive ?? true, // Default to true if not provided
          memberCount: group.memberCount || 0,
        }));
        return {
          data: transformedData,
          meta: response.meta,
        };
      }
    }
    
    return response;
  },

  async getGroupById(id: string): Promise<Group> {
    return apiClient.get<Group>(`${endpoints.groups}/${id}`);
  },

  async createGroup(data: CreateGroupRequest): Promise<Group> {
    // Backend expects: name, description, type, coverImage
    const response = await apiClient.post<any>(endpoints.groups, data);
    const group = (response as any).group || response;
    // Transform back to frontend format
    return {
      ...group,
      category: group.type || group.category,
      image: group.coverUrl || group.imageUrl || group.image,
      isActive: group.isActive ?? true, // Default to true if not provided
      memberCount: group.memberCount || 0,
    } as Group;
  },

  async updateGroup(id: string, data: UpdateGroupRequest): Promise<Group> {
    // Transform frontend format to backend format
    const backendData: any = {};
    if (data.name) backendData.name = data.name;
    if (data.description !== undefined) backendData.description = data.description;
    if (data.type) backendData.type = data.type;
    if (data.coverImage !== undefined) backendData.coverImage = data.coverImage;
    
    const response = await apiClient.put<any>(`${endpoints.groups}/${id}`, backendData);
    // Transform back to frontend format
    return {
      ...response,
      category: response.type || response.category,
      image: response.coverUrl || response.imageUrl || response.image,
      isActive: response.isActive ?? true, // Default to true if not provided
      memberCount: response.memberCount || 0,
    } as Group;
  },

  async deleteGroup(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.groups}/${id}`);
  },

  // Moderation Methods
  async getModerationQueue(
    page = 1,
    limit = 20,
    groupId?: string
  ): Promise<ModerationQueueResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (groupId) params.append("groupId", groupId);
    return apiClient.get<ModerationQueueResponse>(
      `${endpoints.groups}/moderation/queue?${params.toString()}`
    );
  },

  async getReportedPosts(
    page = 1,
    limit = 20,
    status?: ReportStatus
  ): Promise<ReportedPostsResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (status) params.append("status", status);
    return apiClient.get<ReportedPostsResponse>(
      `${endpoints.groups}/moderation/reported?${params.toString()}`
    );
  },

  async approvePost(
    postId: string,
    data: ApprovePostRequest
  ): Promise<GroupPost> {
    return apiClient.post<GroupPost>(
      `${endpoints.groups}/posts/${postId}/approve`,
      data
    );
  },

  async rejectPost(
    postId: string,
    data: RejectPostRequest
  ): Promise<GroupPost> {
    return apiClient.post<GroupPost>(
      `${endpoints.groups}/posts/${postId}/reject`,
      data
    );
  },

  async updateReportStatus(
    reportId: string,
    data: UpdateReportStatusRequest
  ): Promise<GroupPostReport> {
    return apiClient.patch<GroupPostReport>(
      `${endpoints.groups}/reports/${reportId}`,
      data
    );
  },
};

