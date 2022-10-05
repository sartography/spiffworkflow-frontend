export interface SecretAllowedProcessModel {
  id: number;
  secret_id: number;
  allowed_relative_path: string;
}

export interface Secret {
  id: number;
  key: string;
  value: string;
  creator_user_id: string;
  allowed_processes: SecretAllowedProcessModel[];
}

export interface RecentProcessModel {
  processGroupIdentifier: string;
  processModelIdentifier: string;
  processModelDisplayName: string;
}
