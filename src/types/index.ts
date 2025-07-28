export interface Service {
  service_name: string;
  information_system: string;
  qg_status?: string;
  description?: string;
  framework?: string;
  last_check_date?: string;
  monitoring: boolean;
  observability: boolean;
  unit_testing_enabled: boolean;
  unit_testing: string;
  update_date: string;
  git_url: string;
  git_branch: string;
  ci_pipeline_url: string;
}

export interface InformationSystem {
  id: string;
  name: string;
  error?: string;
  information_system: string;
  service_name?: string;
  qg_status?: string;
  framework?: string;
  version?: string;
}

export interface SystemWithServices extends InformationSystem {
  services: Service[];
}

export interface TrustedImage {
  image_name: string;
  image_url: string;
  image_status: string;
}

export interface GroupedTrustedImage {
  image_name: string;
  images: TrustedImage[];
} 