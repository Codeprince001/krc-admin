import { apiClient } from "../client";

export enum EmailTemplateType {
  WELCOME = 'WELCOME',
  ORDER_CONFIRMATION = 'ORDER_CONFIRMATION',
  ORDER_STATUS_UPDATE = 'ORDER_STATUS_UPDATE',
  ORDER_SHIPPED = 'ORDER_SHIPPED',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  ORDER_REFUNDED = 'ORDER_REFUNDED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  CUSTOM = 'CUSTOM',
}

export interface EmailTemplate {
  type: EmailTemplateType;
  name: string;
  description: string;
  subject: string;
  body: string;
  isCustomized: boolean;
  isActive: boolean;
  customTemplateId?: string;
  updatedAt?: string;
  defaultSubject?: string;
  defaultBody?: string;
  availableVariables?: string[];
}

export interface CreateEmailTemplateDto {
  type: EmailTemplateType;
  name: string;
  subject: string;
  body: string;
  description?: string;
}

export interface UpdateEmailTemplateDto {
  name?: string;
  subject?: string;
  body?: string;
  description?: string;
  isActive?: boolean;
}

export interface PreviewResult {
  subject: string;
  body: string;
  sampleContext: Record<string, any>;
}

const BASE_URL = '/admin/email-templates';

export const emailTemplatesService = {
  async getAll(): Promise<EmailTemplate[]> {
    return apiClient.get<EmailTemplate[]>(BASE_URL);
  },

  async getTypes(): Promise<{ value: string; label: string }[]> {
    return apiClient.get<{ value: string; label: string }[]>(`${BASE_URL}/types`);
  },

  async getByType(type: EmailTemplateType): Promise<EmailTemplate> {
    return apiClient.get<EmailTemplate>(`${BASE_URL}/${type}`);
  },

  async create(data: CreateEmailTemplateDto): Promise<EmailTemplate> {
    return apiClient.post<EmailTemplate>(BASE_URL, data);
  },

  async update(id: string, data: UpdateEmailTemplateDto): Promise<EmailTemplate> {
    return apiClient.patch<EmailTemplate>(`${BASE_URL}/${id}`, data);
  },

  async resetToDefault(type: EmailTemplateType): Promise<EmailTemplate> {
    return apiClient.post<EmailTemplate>(`${BASE_URL}/${type}/reset`, {});
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`${BASE_URL}/${id}`);
  },

  async preview(subject: string, body: string, sampleData?: Record<string, any>): Promise<PreviewResult> {
    return apiClient.post<PreviewResult>(`${BASE_URL}/preview`, { subject, body, sampleData });
  },
};
