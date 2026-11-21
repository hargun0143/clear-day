export interface City {
  id: string;
  name: string;
  state: string;
  popular: boolean;
}

export const CITIES: readonly City[] = [
  { id: "delhi", name: "Delhi", state: "Delhi", popular: true },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", popular: true },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", popular: true },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", popular: true },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", popular: false },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", popular: false },
  { id: "pune", name: "Pune", state: "Maharashtra", popular: false },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", popular: false },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", popular: false },
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh", popular: false },
  { id: "patna", name: "Patna", state: "Bihar", popular: false },
  { id: "chandigarh", name: "Chandigarh", state: "Chandigarh", popular: false },
  { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh", popular: false },
  { id: "kanpur", name: "Kanpur", state: "Uttar Pradesh", popular: false },
  { id: "varanasi", name: "Varanasi", state: "Uttar Pradesh", popular: false },
  { id: "gurugram", name: "Gurugram", state: "Haryana", popular: false },
  { id: "noida", name: "Noida", state: "Uttar Pradesh", popular: false },
  {
    id: "ghaziabad",
    name: "Ghaziabad",
    state: "Uttar Pradesh",
    popular: false,
  },
  { id: "nagpur", name: "Nagpur", state: "Maharashtra", popular: false },
  {
    id: "visakhapatnam",
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    popular: false,
  },
  { id: "guwahati", name: "Guwahati", state: "Assam", popular: false },
  { id: "indore", name: "Indore", state: "Madhya Pradesh", popular: false },
  {
    id: "thiruvananthapuram",
    name: "Thiruvananthapuram",
    state: "Kerala",
    popular: false,
  },
] as const;
