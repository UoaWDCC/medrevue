export type TeamMember = {
  name: string;
  role: string;
  category: string;
  image: string;
  displayOrder: number;
};

export type Team = TeamMember[];
