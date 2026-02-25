export interface Employee {
  id: string;
  userId?: string;
  name: string;
  title: string;
  managerId: string | null;
  children?: Employee[]; // Self-referencing recursive type
}

export interface ExternalUser {
  id: string;
  firstName: string; 
  lastName: string;
  email: string;
  desingation?: string; // Matching the typo 'desingation' to fix the error
}