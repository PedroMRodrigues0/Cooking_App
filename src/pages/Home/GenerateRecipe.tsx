import { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import LottieView from "lottie-react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, RouteProp } from "@react-navigation/native";
import {
  HomeStackNavigationProp,
  HomeStackParamList,
} from "../../Routes/types";
import { Recipe } from "./types";

// Firebase
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { getAuth } from "firebase/auth";

type GenerateRecipeRouteProp = RouteProp<HomeStackParamList, "GenerateRecipes">;

interface GenerateRecipeProps {
  route: GenerateRecipeRouteProp;
}

const GenerateRecipe: React.FC<GenerateRecipeProps> = ({ route }) => {
  const navigation = useNavigation<HomeStackNavigationProp>();
  const { type } = route.params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  // Function to fetch recipes by type and display a random one
  const fetchRandomRecipe = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Simulate the loading time (2 seconds)
      setTimeout(async () => {
        // Query Firestore to get recipes by the selected type from the user's collection
        const userRecipesQuery = query(
          collection(db, "recipe"),
          where("type", "==", type),
          where("userId", "==", user.uid)
        );
        const userRecipeSnapshot = await getDocs(userRecipesQuery);

        // Query Firestore to get suggested recipes by the selected type from the suggestRecipe collection
        const suggestRecipesQuery = query(
          collection(db, "suggestRecipe"),
          where("type", "==", type)
        );
        const suggestRecipeSnapshot = await getDocs(suggestRecipesQuery);

        // Extract the recipes from both query results
        const userRecipes: Recipe[] = userRecipeSnapshot.docs.map((doc) => ({
          ...(doc.data() as Recipe),
        }));

        const suggestRecipes: Recipe[] = suggestRecipeSnapshot.docs.map(
          (doc) => ({
            ...(doc.data() as Recipe),
          })
        );

        // Combine user and suggested recipes
        const combinedRecipes = [...userRecipes, ...suggestRecipes];

        if (combinedRecipes.length === 0) {
          Alert.alert(
            "Nenhuma receita foi encontrada",
            "Nenhuma receita foi encontrada para a categoria selecionada."
          );
          setIsLoading(false);
          return;
        }

        // Pick a random recipe from the combined list
        const randomRecipe =
          combinedRecipes[Math.floor(Math.random() * combinedRecipes.length)];

        // Set the recipe to state for display
        setRecipe(randomRecipe);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching recipes: ", error);
      Alert.alert("Erro", "Falha ao tentar buscar dados de receita.");
      setIsLoading(false);
    }
  };
  return (
    <View className="flex w-full h-full bg-white">
      <StatusBar style="dark" />
      <View className="TextContainer p-5">
        <Text className="font-semibold text-5xl text-[#302C2C]">
          O que vai cozinhar hoje?
        </Text>
      </View>
      {isLoading === true ? (
        <View className="MainContainer flex-1">
          <LottieView
            autoPlay
            style={{
              width: "100%",
              height: 384,
              backgroundColor: "white",
            }}
            source={require("../../../assets/loading.json")}
          />
        </View>
      ) : recipe ? (
        <View className="MainContainer p-3 flex-1">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("RecipeDetails", { item: recipe })
            }
            className="flex rounded-md  overflow-hidden relative ml-2 mr-2"
          >
            <Image
              source={{ uri: recipe.image }}
              className="absolute inset-0 w-full h-full"
              resizeMode="cover"
            />
            <View className=" h-full w-full p-4 justify-between">
              <View className="flex h-12 items-center justify-center p-1 bg-white opacity-80 rounded-md">
                <Text className=" text-lg font-semibold">{recipe.name}</Text>
              </View>
              {recipe.type === "vegetariano" && (
                <View className="flex self-end px-1 py-1 border rounded-lg bg-[#C5D6C0] border-[#519240]">
                  <Text className="text-lg text-[#519240]">{recipe.type}</Text>
                </View>
              )}
              {recipe.type === "carne" && (
                <View className="flex self-end px-1 py-1 border rounded-lg bg-[#f6bfbf] border-[#EA7777]">
                  <Text className="text-lg text-[#EA7777]">{recipe.type}</Text>
                </View>
              )}
              {recipe.type === "peixe" && (
                <View className="flex self-end px-1 py-1 border rounded-lg bg-[#B8D4E7] border-[#57ADE8]">
                  <Text className="text-lg text-[#57ADE8]">{recipe.type}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="MainContainer flex-1">
          <Image
            className=" h-96 w-full"
            source={require("../../../assets/GenerateImage.jpg")}
          />
        </View>
      )}

      <View className="ButtonContainer p-5 items-center">
        {type === "peixe" && (
          <TouchableOpacity
            onPress={() => fetchRandomRecipe()}
            className="flex-row p-2 justify-between bg-[#bbe1fb] rounded-xl gap-x-3 items-center"
          >
            <Text className=" font-semibold text-lg text-[#302C2C]">
              Gerar Receita
            </Text>
            <Image
              className=" h-12 w-12"
              source={require("../../../assets/fish.png")}
            ></Image>
          </TouchableOpacity>
        )}
        {type === "carne" && (
          <TouchableOpacity
            onPress={() => fetchRandomRecipe()}
            className="flex-row p-2 justify-between bg-[#ff7f7f] rounded-xl gap-x-3 ml-4 items-center"
          >
            <Text className=" font-semibold text-lg text-[#302C2C]">
              Gerar Receita
            </Text>
            <Image
              className=" h-12 w-12"
              source={require("../../../assets/meat.png")}
            ></Image>
          </TouchableOpacity>
        )}

        {type === "vegetariano" && (
          <TouchableOpacity
            onPress={() => fetchRandomRecipe()}
            className="flex-row p-2 justify-between bg-[#B9DAB0] rounded-xl gap-x-3 ml-4 items-center"
          >
            <Text className=" font-semibold text-lg text-[#302C2C]">
              Gerar Receita
            </Text>
            <Image
              className=" h-12 w-12"
              source={require("../../../assets/carrot.png")}
            ></Image>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default GenerateRecipe;
