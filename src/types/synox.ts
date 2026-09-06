export interface SynoxParamInfo {
  name: string;
  desc: string;
  example: string;
}

export interface SynoxItem {
  id: string;
  name: string;
  path: string;
  post: boolean;
  desc: string;
  needsApiKey: boolean;
  subfolder: string | null;
  paramInfo?: SynoxParamInfo[];
}

export interface SynoxCategory {
  name: string;
  post: boolean;
  path: boolean;
  subfolder: string | null;
  items: SynoxItem[];
}

export interface SynoxRegistryResponse {
  statusCode: number;
  creator: string;
  endpoints: SynoxCategory[];
}

export interface SynoxServerStatus {
  statusCode: number;
  creator: string;
  status: boolean;
  server: {
    active: boolean;
    uptimeMs: number;
    totalEndpoints: number;
    totalCategories: number;
    nodeVersion: string;
    memoryUsedMB: number;
  };
  timestamp: string;
}
