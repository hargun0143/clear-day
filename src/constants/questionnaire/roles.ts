export interface RoleOption {
  id: string;
  label: string;
}

export const ROLES: readonly RoleOption[] = [
  { id: "school-student", label: "School student" },
  { id: "college-student", label: "College student" },
  { id: "office-worker", label: "Office worker" },
  { id: "work-from-home", label: "Work from home" },
  { id: "homemaker", label: "Homemaker" },
  { id: "outdoor-worker", label: "Outdoor worker" },
  { id: "senior", label: "Senior" },
] as const;
