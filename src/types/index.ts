// Tipos base para o sistema de contextos
export interface Context {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  tags: string[];
  isActive: boolean;
  color?: ContextColor;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Information {
  id: string;
  contextId: string;
  type: InformationType;
  title: string;
  content: string;
  metadata: Record<string, any>;
  tags: string[];
  priority: Priority;
  isCompleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type InformationType = 'note' | 'link' | 'file' | 'task' | 'reminder';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type ContextColor = 
  | 'work' 
  | 'study' 
  | 'personal' 
  | 'health' 
  | 'finance' 
  | 'custom';

// Tipos para a interface do usuário
export interface ContextState {
  activeContext: Context | null;
  contexts: Context[];
  information: Information[];
  isLoading: boolean;
  error: string | null;
}

export interface ContextAction {
  type: string;
  payload?: any;
}

// Tipos para APIs
export interface CreateContextRequest {
  name: string;
  description: string;
  parentId?: string;
  tags: string[];
  color?: ContextColor;
  icon?: string;
}

export interface UpdateContextRequest extends Partial<CreateContextRequest> {
  id: string;
}

export interface CreateInformationRequest {
  contextId: string;
  type: InformationType;
  title: string;
  content: string;
  tags: string[];
  priority: Priority;
  metadata?: Record<string, any>;
}

export interface UpdateInformationRequest extends Partial<CreateInformationRequest> {
  id: string;
}

// Tipos para filtros e busca
export interface SearchFilters {
  contextId?: string;
  type?: InformationType;
  tags?: string[];
  priority?: Priority;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SearchResult {
  information: Information[];
  total: number;
  page: number;
  limit: number;
}

// Tipos para estatísticas
export interface ContextStats {
  contextId: string;
  contextName: string;
  totalInformation: number;
  completedTasks: number;
  pendingTasks: number;
  lastActivity: Date;
  timeSpent: number; // em minutos
}

export interface DashboardStats {
  totalContexts: number;
  activeContexts: number;
  totalInformation: number;
  recentActivity: Information[];
  contextStats: ContextStats[];
}

// Tipos para configurações
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  defaultContextColor: ContextColor;
  autoSave: boolean;
  notifications: boolean;
  shortcuts: Record<string, string>;
}

// Tipos para notificações
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  contextId?: string;
  createdAt: Date;
  isRead: boolean;
}