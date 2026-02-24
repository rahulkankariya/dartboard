export interface Employee {
  id: string;
  name: string;
  title: string;
  managerId: string | null;
  children?: Employee[]; // Self-referencing recursive type
}

export interface ExternalUser {
  id: string;
  name: string;
  email: string;
  title?: string;
}