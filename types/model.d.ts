export interface Tag {
  key: string;
  value: string;
}
export interface ModelVersion {
  name: string;
  version: string;
  creation_timestamp: string;
  last_updated_timestamp: string;
  current_stage: string;
  description: string;
  source: string;
  run_id: string;
  status: string;
  tags: Tag[];
  run_link: string;
}
export interface Model {
  enableSchedule?: boolean;
  _id: string;
  name: string;
  description: string;
  owner_id: string;
  __v: number;
  alt_name: string;
  tags?: Tag[];
  isFavorite?: boolean;
  latest_versions?: ModelVersion[];
  creation_timestamp?: string;
  last_updated_timestamp?: string;
}
export interface NewModelData {
  name: string;
  description: string;
  tags: Tag[];
}
export interface UpdateModelData {
  name: string;
  description: string;
}
export interface UpdateModelData {
  name: string;
  description: string;
}

export interface SetModelTagData {
  name: string;
  key: string;
  value: string;
}

export interface DeleteModelTagData {
  name: string;
  key: string;
}

export interface ScriptModel {
  _id: string;
  version: string;
  model_id: string;
  model_version: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
