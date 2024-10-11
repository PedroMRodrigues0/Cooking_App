import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

// Types
import {
  AuthStackParamList,
  HomeStackParamList,
  RecipeListStackParamList,
} from "./types";

//Pages
import RecipeDetails from "../pages/RecipeDetails/RecipeDetails";
import RecipeList from "../pages/RecipeList/RecipeList";
import Home from "../pages/Home/Home";
import GenerateRecipe from "../pages/Home/GenerateRecipe";
import Intro from "../pages/Authenticate/Intro";
import Login from "../pages/Authenticate/Login";
import Register from "../pages/Authenticate/Register";

const StackHome = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <StackHome.Navigator>
      <StackHome.Screen
        options={{
          headerShown: false,
        }}
        name="HomePage"
        component={Home}
      />
      <StackHome.Screen
        options={{
          headerBackTitleVisible: false,
          headerTitle: "",
          headerTintColor: "#302C2C",
          headerShadowVisible: false,
        }}
        name="GenerateRecipes"
        component={GenerateRecipe}
      />
      <StackHome.Screen
        options={{
          headerShown: false,
          headerShadowVisible: false,
          animation: "slide_from_bottom",
        }}
        name="RecipeDetails"
        component={RecipeDetails}
      />
    </StackHome.Navigator>
  );
}

const StackRecipeList = createNativeStackNavigator<RecipeListStackParamList>();

export function RecipeListStack() {
  return (
    <StackRecipeList.Navigator>
      <StackRecipeList.Screen
        options={{
          headerTitle: "Lista de Receitas",
        }}
        name="RecipeList"
        component={RecipeList}
      />
      <StackRecipeList.Screen
        options={{
          headerShown: false,
          headerShadowVisible: false,
          animation: "slide_from_bottom",
        }}
        name="RecipeDetails"
        component={RecipeDetails}
      />
    </StackRecipeList.Navigator>
  );
}

const StackAuth = createNativeStackNavigator<AuthStackParamList>();

export function AuthenticateStack() {
  return (
    <NavigationContainer>
      <StackAuth.Navigator>
        <StackAuth.Screen
          options={{
            headerShown: false,
          }}
          name="IntroPage"
          component={Intro}
        />
        <StackAuth.Screen
          options={{
            headerShown: false,
          }}
          name="LoginPage"
          component={Login}
        />
        <StackAuth.Screen
          name="RegisterPage"
          options={{
            headerShown: false,
          }}
          component={Register}
        />
      </StackAuth.Navigator>
    </NavigationContainer>
  );
}
