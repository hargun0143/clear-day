export interface RoleTopic {
  id: string;
  slotHint: "Morning" | "Afternoon" | "Evening";
  detail: string;
}

export const STATIC_ROLE_TOPICS: Record<string, RoleTopic> = {
  "office-worker:ac-yes": {
    id: "role-office-ac-yes",
    slotHint: "Afternoon",
    detail:
      "Spend lunch and work breaks inside the air-conditioned office away from roadside traffic.",
  },
  "office-worker:ac-partial": {
    id: "role-office-ac-partial",
    slotHint: "Afternoon",
    detail:
      "Work in the enclosed or air-conditioned section of your office during peak outdoor hours.",
  },
  "office-worker:ac-no": {
    id: "role-office-ac-no",
    slotHint: "Afternoon",
    detail:
      "Keep office doors closed toward busy roads and take lunch breaks away from street traffic.",
  },
  "work-from-home:closed": {
    id: "role-wfh-closed",
    slotHint: "Afternoon",
    detail:
      "Keep your workroom door closed to maintain a low-dust workspace during the day.",
  },
  "work-from-home:ac": {
    id: "role-wfh-ac",
    slotHint: "Afternoon",
    detail:
      "Keep your home-office AC on recirculate during daytime work hours.",
  },
  "homemaker:dry-sweep": {
    id: "role-homemaker-dry-sweep",
    slotHint: "Morning",
    detail:
      "Switch daytime floor sweeping to damp wiping so settled household dust stays down.",
  },
  "homemaker:wet-mop": {
    id: "role-homemaker-wet-mop",
    slotHint: "Morning",
    detail:
      "Schedule damp mopping in the morning or afternoon when outdoor traffic settles.",
  },
  "homemaker:vacuum": {
    id: "role-homemaker-vacuum",
    slotHint: "Afternoon",
    detail:
      "Run the vacuum cleaner during mid-afternoon hours with exterior doors closed.",
  },
};
