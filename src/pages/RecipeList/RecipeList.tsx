import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  RefreshControl,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

// Firebase
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";

// Types
import { Recipe } from "./types";
import { RecipeListStackNavigationProp } from "../../Routes/types";

// Icons
import Feather from "@expo/vector-icons/Feather";
import Octicons from "@expo/vector-icons/Octicons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const RecipeList = () => {
  const navigation = useNavigation<RecipeListStackNavigationProp>();
  const [isClicked, setIsclicked] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | null>(null);
  const [filterByType, setFilterByType] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  const slideAnim = useSharedValue(0); // Reanimated shared value

  const isFocused = useIsFocused();

  useEffect(() => {
    onRefresh();
  }, [isFocused]);

  useEffect(() => {
    slideAnim.value = withTiming(isClicked ? 1 : 0, {
      duration: 300,
      easing: Easing.ease,
    });
  }, [isClicked]);

  useEffect(() => {
    filterAndSortRecipes();
    console.log("despertou o filter");
  }, [searchTerm, sortBy, filterByType, recipes]);

  async function fetchRecipes() {
    const auth = getAuth(); // Get the Firebase Auth instance
    const user = auth.currentUser; // Get the currently authenticated user

    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    // Query the Firestore for recipes by the authenticated user
    const recipesCol = collection(db, "recipe");
    const q = query(recipesCol, where("userId", "==", user.uid)); // Filter by userId
    const recipeSnapshot = await getDocs(q);

    // Fetch suggested recipes
    const suggestRecipesCol = collection(db, "suggestRecipe");
    const suggestQ = query(suggestRecipesCol); // Fetch all suggested recipes
    const suggestRecipeSnapshot = await getDocs(suggestQ);

    // Combine recipe and suggestRecipe data
    const recipeList: Recipe[] = recipeSnapshot.docs.map((doc) => {
      const data = doc.data() as Recipe;
      return {
        ...data,
        id: doc.id,
      };
    });

    const suggestRecipeList: Recipe[] = suggestRecipeSnapshot.docs.map(
      (doc) => {
        const data = doc.data() as Recipe;
        return {
          ...data,
          id: doc.id,
          isSuggested: true, // Flag to differentiate between user recipes and suggested ones
        };
      }
    );

    const combinedList = [...recipeList, ...suggestRecipeList];

    setRecipes(combinedList);
    setFilteredRecipes(combinedList);
  }

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      const recipeDoc = doc(db, "recipe", recipeId);
      await deleteDoc(recipeDoc);

      setRecipes((prevRecipes) => prevRecipes.filter((r) => r.id !== recipeId));
      setFilteredRecipes((prevFiltered) =>
        prevFiltered.filter((r) => r.id !== recipeId)
      );

      console.log("Recipe deleted successfully!");
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  // Toggle animation click
  const ToggleClick = () => {
    setIsclicked(!isClicked);
  };

  // height for slide animation
  const animatedStyle = useAnimatedStyle(() => {
    const heightInterpolation = interpolate(slideAnim.value, [0, 1], [0, 60]);
    return {
      height: heightInterpolation,
      overflow: "hidden",
    };
  });

  console.log("renderizou");
  const filterAndSortRecipes = () => {
    let filteredList = recipes;

    // Filter by search term
    if (searchTerm) {
      filteredList = filteredList.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterByType) {
      filteredList = filteredList.filter(
        (recipe) => recipe.type === filterByType
      );
    }

    setFilteredRecipes(filteredList);
  };

  const ToggleClearFilter = () => {
    console.log("entrei no clean");
    setFilterByType(null);
    setSortBy(null);
    setSearchTerm("");
    setFilteredRecipes(recipes);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchRecipes();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View className="w-full h-full p-3 bg-neutral-100">
      <StatusBar style="dark" />
      <View className="SearchContainer flex-row justify-between w-full mb-6 mt-2">
        <View className="flex-1 flex-row items-center bg-white px-2 rounded-lg">
          <Feather name="search" size={20} color="#302C2C" />
          <TextInput
            placeholder="Pesquisar"
            className="flex-1 p-3 h-10"
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
        </View>
        <TouchableOpacity
          onPress={() => ToggleClick()}
          className="flex p-2 bg-white rounded-lg ml-4"
        >
          <Octicons name="filter" size={24} color="#302C2C" />
        </TouchableOpacity>
      </View>

      {/* Filter options */}
      <Animated.View style={animatedStyle}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          className="gap-x-2"
        >
          {filterByType != null || sortBy != null || searchTerm != "" ? (
            <TouchableOpacity
              onPress={() => ToggleClearFilter()}
              className="p-2 h-9 border bg-[#302C2C] border-[#302C2C] rounded-lg"
            >
              <Text className="text-white">Limpar Filtro</Text>
            </TouchableOpacity>
          ) : (
            <></>
          )}

          <TouchableOpacity
            onPress={() => setFilterByType("peixe")}
            className="p-2 h-9 flex-row gap-x-1 items-center border border-[#302C2C] rounded-lg"
          >
            <Text>Peixe</Text>
            <Ionicons name="fish" size={20} color="#302C2C" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilterByType("carne")}
            className="p-2 h-9 flex-row gap-x-1 items-center border border-[#302C2C] rounded-lg"
          >
            <Text>Carne</Text>
            <MaterialCommunityIcons
              name="food-drumstick"
              size={19}
              color="#302C2C"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilterByType("vegetariano")}
            className="p-2 h-9 flex-row gap-x-1 items-center border border-[#302C2C] rounded-lg"
          >
            <Text>Vegetariano</Text>
            <FontAwesome6 name="carrot" size={18} color="#302C2C" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilterByType("pastelaria")}
            className="p-2 h-9 flex-row gap-x-1 items-center border border-[#302C2C] rounded-lg"
          >
            <Text>Pastelaria</Text>
            <MaterialCommunityIcons
              name="food-croissant"
              size={20}
              color="#302C2C"
            />
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* List of Items */}
      <View className="ListContainer flex-1">
        <FlatList
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <TouchableOpacity
                  onPress={() => handleDeleteRecipe(item.id)}
                  className=" h-[100px] w-[100px] bg-red-400 justify-center items-center rounded-tr-md rounded-br-md"
                >
                  <FontAwesome name="trash-o" size={35} color="white" />
                </TouchableOpacity>
              )}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("RecipeDetails", { item })}
                className="flex flex-row w-full mb-3 rounded-md bg-white justify-between border border-gray-100"
              >
                <Image
                  source={{ uri: item.image }}
                  className=" w-28 h-[100px] rounded-md"
                />
                <View className="flex-1 flex-row p-2 justify-between bg-white rounded-tr-md rounded-br-md">
                  <View className="flex-1">
                    <Text className=" text-base font-medium text-[#302C2C]">
                      {item.name}
                    </Text>
                  </View>
                  {item.type === "vegetariano" && (
                    <View className="flex self-end px-1 py-1 border rounded-lg bg-[#C5D6C0] border-[#519240]">
                      <Text className="text-xs text-[#519240]">
                        {item.type}
                      </Text>
                    </View>
                  )}
                  {item.type === "carne" && (
                    <View className="flex self-end px-1 py-1 border rounded-lg bg-[#f6bfbf] border-[#EA7777]">
                      <Text className="text-xs text-[#EA7777]">
                        {item.type}
                      </Text>
                    </View>
                  )}
                  {item.type === "peixe" && (
                    <View className="flex self-end px-1 py-1 border rounded-lg bg-[#B8D4E7] border-[#57ADE8]">
                      <Text className="text-xs text-[#57ADE8]">
                        {item.type}
                      </Text>
                    </View>
                  )}
                  {item.type === "pastelaria" && (
                    <View className="flex self-end px-1 py-1 border rounded-lg bg-[#EAE2C9] border-[#F0B349]">
                      <Text className="text-xs text-[#F0B349]">
                        {item.type}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      </View>
    </View>
  );
};

export default RecipeList;
