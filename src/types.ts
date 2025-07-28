export interface InformationSystem {
  /** Имя сервиса */
  service_name: string;
  /** Система */
  information_system: string;
  /** Наличие мониторинга */
  monitoring: boolean;
  /** Наличие трассировки */
  observability: boolean;
  /** Включена ли в пайплайне функция юнит тестирования */
  unit_testing_enabled: boolean;
  /** Статус тестирования юнит тестов */
  unit_testing: string;
  /** Дата проверки */
  update_date: string | null;
  /** Framework/технология на котором написан проект */
  description: string | null;
  /** Ссылка на репозиторий сервиса */
  git_url: string | null;
  /** Ветка которая проверялась */
  git_branch: string | null;
  /** Ссылка на пайплайн в котором была проверка */
  ci_pipeline_url: string | null;
  /** Jira ticket на заявку */
  cm_key: string | null;
  /** Итоговый статус проверки */
  qg_status: string | null;
}

export interface Service {
  /** Система */
  information_system: string;
  /** Имя сервиса */
  service_name: string;
  /** Наличие мониторинга */
  monitoring: boolean;
  /** Наличие трассировки */
  observability: boolean;
  /** Включена ли в пайплайне функция юнит тестирования */
  unit_testing_enabled: boolean;
  /** Статус тестирования юнит тестов */
  unit_testing: string;
  /** Дата проверки */
  update_date: string | null;
  /** Framework/технология на котором написан проект */
  description: string | null;
  /** Ссылка на репозиторий сервиса */
  git_url: string | null;
  /** Ветка которая проверялась */
  git_branch: string | null;
  /** Ссылка на пайплайн в котором была проверка */
  ci_pipeline_url: string | null;
  /** Jira ticket на заявку */
  cm_key: string | null;
  /** Итоговый статус проверки */
  qg_status: string | null;
  platform: string | null;
  zone: string | null;
}

export interface TechPattern {
  pattern: RegExp;
  normalizeVersion?: (version: string) => string;
}

export interface TechVersion {
  version: string;
  count: number;
}

export interface TechInfo {
  name: string;
  count: number;
  services: Set<string>;
  versions: TechVersion[];
  quadrant: string;
}

export interface RadarQuadrant {
  subject: string;
  value: number;
  totalServices: number;
  technologies: string;
}

export interface TechStackData {
  name: string;
  versions: string[];
  passed: number;
  blocked: number;
  total: number;
  passRate: number;
  blockRate: number;
  coverage: number;
} 