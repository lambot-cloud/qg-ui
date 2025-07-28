export interface Service {
  information_system: string;
  service_name: string;
  monitoring: boolean | null;
  observability: boolean | null;
  unit_testing_enabled: boolean | null;
  unit_testing: string | null;
  update_date: string | null;
  description: string | null;
  git_url: string | null;
  git_branch: string | null;
  ci_pipeline_url: string | null;
  qg_status: string | null;
}

export interface ServiceInfra {
  information_system: string;
  service_name: string;
  platform: string | null;
  zone: string | null;
}

export interface ServiceGroup {
  information_system: string;
  services: Service[];
}

// Combined interface for UI display
export interface ServiceWithInfra extends Service {
  platform?: string | null;
  zone?: string | null;
} 