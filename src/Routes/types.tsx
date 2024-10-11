import { StackNavigationProp } from "@react-navigation/stack";
import { Recipe } from "../pages/RecipeList/types";

export type HomeStackParamList = {
  HomePage: undefined;
  GenerateRecipes: { type: string };
  RecipeDetails: { item: Recipe };
};

export type RecipeListStackParamList = {
  RecipeList: undefined;
  RecipeDetails: { item: Recipe };
};

export type AuthStackParamList = {
  IntroPage: undefined;
  LoginPage: undefined;
  RegisterPage: undefined;
};

//Type for RecipeDetails component
export type CombinedStackParamList = HomeStackParamList &
  RecipeListStackParamList;

export type HomeStackNavigationProp = StackNavigationProp<HomeStackParamList>;

export type RecipeListStackNavigationProp =
  StackNavigationProp<RecipeListStackParamList>;

export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;
