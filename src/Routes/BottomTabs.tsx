import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

// Pages
import { HomeStack, RecipeListStack } from "./routes";
import Profile from "../pages/Profile/Profile";
import AddRecipe from "../pages/AddRecipes/AddRecipes";

// Icons
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#302C2C",
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color="#302C2C"
              />
            ),
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Tab.Screen
          name="AddRecepie"
          component={AddRecipe}
          options={{
            tabBarIcon: ({ focused }) => (
              <AntDesign
                name={focused ? "plussquare" : "plussquareo"}
                size={24}
                color="#302C2C"
              />
            ),
            headerTitle: "Criar Receita",
          }}
        />
        <Tab.Screen
          name="RecepieList"
          component={RecipeListStack}
          options={{
            tabBarIcon: () => (
              <AntDesign name="bars" size={29} color="#302C2C" />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Perfil"
          component={Profile}
          options={{
            tabBarIcon: ({ focused }) => (
              <Feather name="user" size={24} color="#302C2C" />
            ),
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
