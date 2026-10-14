export type SupportCategory = 
  | 'all'
  | 'update'
  | 'bsod'
  | 'network'
  | 'audio'
  | 'activation'
  | 'performance'
  | 'surface';

export interface ErrorCodeInfo {
  code: string;
  name: string;
  category: 'Update' | 'BSOD / Kernel' | 'Activation' | 'Filesystem' | 'Driver / Device';
  subsystem: string;
  summary: string;
  commonCauses: string[];
  recommendedCommand?: string;
  commandType?: 'cmd' | 'powershell';
  steps: string[];
}

export interface TroubleshootStep {
  id: string;
  question: string;
  description: string;
  recommendedAction?: {
    label: string;
    command?: string;
    details: string;
  };
  options: {
    label: string;
    nextStepId?: string;
    resolved?: boolean;
    escalate?: boolean;
  }[];
}

export interface TroubleshootFlow {
  id: string;
  title: string;
  category: SupportCategory;
  estimatedTime: string;
  severity: 'Low' | 'Moderate' | 'Critical';
  summary: string;
  rootStepId: string;
  steps: Record<string, TroubleshootStep>;
}

export interface DriverItem {
  id: string;
  name: string;
  category: 'Graphics' | 'Audio' | 'Network' | 'Chipset' | 'Surface Firmware';
  deviceModel: string;
  version: string;
  releaseDate: string;
  size: string;
  os: 'Windows 11 (24H2 / 23H2)' | 'Windows 10 / 11' | 'Windows 11 (ARM64)';
  wingetId?: string;
  checksum: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: SupportCategory;
  readingTime: string;
  lastUpdated: string;
  views: number;
  helpfulCount: number;
  excerpt: string;
  sections: {
    heading: string;
    content: string;
    callout?: string;
    terminalSnippet?: string;
  }[];
}

export interface SupportTicket {
  ticketId: string;
  name: string;
  email: string;
  windowsVersion: string;
  category: string;
  subject: string;
  description: string;
  createdAt: string;
  status: 'Open' | 'In Queue' | 'Assigned' | 'Resolved';
  assignedEngineer?: string;
  priority: 'Normal' | 'High' | 'Critical';
}

export interface DiagnosticCheckItem {
  id: string;
  name: string;
  category: string;
  status: 'pending' | 'running' | 'passed' | 'warning' | 'error';
  metric: string;
  details: string;
  recommendation?: string;
}
