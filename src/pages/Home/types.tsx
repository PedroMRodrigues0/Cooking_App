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

export interface UserType {
  name: string;
  surname: string;
  email: string;
  gender: string;
}
