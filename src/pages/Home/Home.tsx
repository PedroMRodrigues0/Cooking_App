import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

// Firebase
import { getAuth, User } from "firebase/auth";
import { db } from "../../../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// Components
import ListHome from "../../components/ListHome";

// Types
import { HomeStackNavigationProp } from "../../Routes/types";
import { Recipe, UserType } from "./types";

const Home = () => {
  const navigation = useNavigation<HomeStackNavigationProp>();
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [suggestRecipes, setSuggestRecipes] = useState<Recipe[]>([]);
  const [userData, setUserData] = useState<UserType | null>(null);
  const auth = getAuth();
  const user = auth.currentUser;

  const isFocused = useIsFocused();

  // Fetch recent recipes from Firestore
  const fetchRecentRecipes = async () => {
    if (!user) return;
    try {
      const recipesCol = collection(db, "recipe");
      const q = query(recipesCol, where("userId", "==", user.uid));
      const recipeSnapshot = await getDocs(q);
      const recipesList: Recipe[] = recipeSnapshot.docs.map((doc) => {
        const data = doc.data() as Recipe;
        return { ...data, id: doc.id };
      });

      // Sort by date in descending order and take the first 5
      const sortedRecipes = recipesList.sort((a, b) => b.date - a.date);
      const topFiveRecipes = sortedRecipes.slice(0, 5);
      setRecentRecipes(topFiveRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };
  // Fetch recent recipes from the collection suggestRecipe in Firestore
  const fetchSuggestRecipes = async () => {
    if (!user) return;
    try {
      const recipesCol = collection(db, "suggestRecipe");
      const recipeSnapshot = await getDocs(recipesCol);
      const recipesList: Recipe[] = recipeSnapshot.docs.map((doc) => {
        const data = doc.data() as Recipe;
        return { ...data, id: doc.id };
      });

      // Sort by date in descending order and take the first 5
      const sortedRecipes = recipesList.sort((a, b) => b.date - a.date);
      const topFiveRecipes = sortedRecipes.slice(0, 11);
      setSuggestRecipes(topFiveRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  // Fetch user data from Firestore
  const fetchUserdata = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserType;
        setUserData(userData); // Set user data into state
      } else {
        console.log("No such user!");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    fetchRecentRecipes();
    fetchSuggestRecipes();
    fetchUserdata();
  }, [isFocused]);

  return (
    <SafeAreaView className=" h-full bg-neutral-50">
      <StatusBar style="dark" />
      <ScrollView
        className=" w-full h-full mb-[-34px]"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex w-full h-full ">
          <LottieView
            autoPlay
            source={require("../../../assets/BackgroundAnimation.json")}
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              transform: [{ scale: 1.5 }],
            }}
          />
          <View className="Header flex flex-row w-full h-20 p-3 items-center ">
            {userData?.gender === "female" ? (
              <Image
                source={require("../../../assets/FemaleAvatar.jpg")}
                className="flex h-12 w-12 bg-gray-500 rounded-md"
              ></Image>
            ) : (
              <Image
                source={require("../../../assets/MaleAvatar.jpg")}
                className="flex h-12 w-12 bg-gray-500 rounded-md"
              ></Image>
            )}

            <View className="flex h-12 w-24 justify-end ml-2">
              <Text className=" text-gray-600">Olá</Text>
              <Text className=" font-semibold text-[#302C2C]">
                {userData?.name}
              </Text>
            </View>
          </View>

          <View className="Categories flex w-full  h-64 p-3  ">
            <Text className=" text-4xl text-[#302C2C] font-bold">
              Não sabe o que cozinhar?
            </Text>
            <Text className=" text-lg text-[#6c6a6a] font-semibold mb-6">
              Gere a sua receita!
            </Text>
            <View className="flex flex-row w-full items-center justify-center ">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("GenerateRecipes", { type: "peixe" })
                }
                className="flex h-20 w-28  "
              >
                <LinearGradient
                  className=" w-full h-full p-2 justify-between bg-[#d5efff]  rounded-xl items-center"
                  colors={["#d5efff", "#a5c6de"]}
                >
                  <Image
                    className=" h-12 w-12"
                    source={require("../../../assets/fish.png")}
                  ></Image>
                  <Text className=" text-[#302C2C]">Peixe</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("GenerateRecipes", { type: "carne" })
                }
                className="flex h-20 w-28 ml-4 "
              >
                <LinearGradient
                  colors={["#ffbaba", "#f57575"]}
                  className="w-full h-full p-2 justify-between bg-[#ffbaba] rounded-xl  items-center"
                >
                  <Image
                    className=" h-12 w-12"
                    source={require("../../../assets/meat.png")}
                  ></Image>
                  <Text className=" text-[#302C2C]">Carne</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("GenerateRecipes", {
                    type: "vegetariano",
                  })
                }
                className="flex h-20 w-28 ml-4 "
              >
                <LinearGradient
                  colors={["#d2efc7", "#94ce82"]}
                  className=" w-full h-full p-2 justify-between bg-[#d2efc7] rounded-xl  items-center"
                >
                  <Image
                    className=" h-12 w-12"
                    source={require("../../../assets/carrot.png")}
                  ></Image>
                  <Text className=" text-[#302C2C]">Vegetariano</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Suggest added recipes */}
          <View className="AddRecent flex w-full p-3 ">
            <Text className="text-lg text-[#302C2C] font-bold mb-3">
              Sugestões
            </Text>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={suggestRecipes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ListHome
                  navigation={navigation}
                  data={item}
                  data_name={item.name}
                  data_image={item.image}
                  data_type={item.type}
                />
              )}
            />
          </View>

          {/* Recent added recipes */}
          <View className="AddRecent flex w-full p-3 ">
            <Text className="text-lg text-[#302C2C] font-bold mb-3">
              Adicionados Recentemente
            </Text>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={recentRecipes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ListHome
                  navigation={navigation}
                  data={item}
                  data_name={item.name}
                  data_image={item.image}
                  data_type={item.type}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
