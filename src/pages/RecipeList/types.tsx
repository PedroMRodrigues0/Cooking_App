export interface Recipe {
  id: string;
  name: string;
  type: string;
  image: string;
  ingredients: string;
  steps: string[];
  date: number;
  userId: string;
}
