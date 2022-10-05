export interface Secret {
  key: string;
  value: string;
  username: string;
}

export interface RecentProcessModel {
  processGroupIdentifier: string;
  processModelIdentifier: string;
  processModelDisplayName: string;
}
