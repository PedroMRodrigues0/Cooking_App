import {
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../../firebase/firebase";
import { getAuth, User } from "firebase/auth";

// Icons
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

// Define the valid recipe types
type RecipeType = "peixe" | "carne" | "vegetariano" | "pastelaria";

const AddRecipe = () => {
  const [image, setImage] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState<string[]>([""]); // Initialize with one empty step

  const auth = getAuth();
  const user: User | null = auth.currentUser;

  // Define the default image URLs
  const defaultImages: Record<RecipeType, string> = {
    peixe:
      "https://firebasestorage.googleapis.com/v0/b/cookingapp2-1871c.appspot.com/o/recipes%2F1728504346451.jpg?alt=media&token=aa87a315-14b1-4ddb-852e-b0785de7bb86",
    carne:
      "https://firebasestorage.googleapis.com/v0/b/cookingapp2-1871c.appspot.com/o/recipes%2F1728504301755.jpg?alt=media&token=94fcfcd6-2845-488f-a82b-323d429acc48",
    vegetariano:
      "https://firebasestorage.googleapis.com/v0/b/cookingapp2-1871c.appspot.com/o/recipes%2F1728504194331.jpg?alt=media&token=8657bfd2-88af-4fd3-90e5-c3285a1c295b",
    pastelaria:
      "https://firebasestorage.googleapis.com/v0/b/cookingapp2-1871c.appspot.com/o/recipes%2F1728504254467.jpg?alt=media&token=3157690f-cff1-4ac5-956a-af22a68ea735",
  };

  // Add a new step
  const addStep = () => {
    setSteps([...steps, ""]);
  };

  // Update a specific step
  const updateStep = (text: string, index: number) => {
    const newSteps = [...steps];
    newSteps[index] = text;
    setSteps(newSteps);
  };

  // Remove a specific step
  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  // Handle recipe type selection and check icon opacity
  const handleCheck = (index: number) => {
    setSelected(index === selected ? null : index);
  };

  // Determine the opacity for the recipe type icons
  const getOpacity = (index: number) => {
    return selected === null
      ? "opacity-100"
      : selected === index
      ? "opacity-100"
      : "opacity-25";
  };

  // Pick an image from the gallery
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Upload the selected image to Firebase
  async function uploadImage(uri: any) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `recipes/${Date.now()}.jpg`);

      console.log("Uploading image...");
      await uploadBytes(storageRef, blob);
      console.log("Upload complete");

      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  }

  // Add the new recipe to Firestore
  async function addRecipe(imageURL: any) {
    if (!user) return;
    try {
      await addDoc(collection(db, "recipe"), {
        name: name,
        type: type,
        ingredients: ingredients,
        steps: steps, // Add steps to the recipe data
        image: imageURL,
        date: Date.now(),
        userId: user.uid,
      });
      console.log("Receita criada com sucesso!");
      Alert.alert("Sucesso!", "Receita criada com sucesso!");
      resetFields();
    } catch (error) {
      console.error("Error adding recipe: ", error);
    }
  }

  // Handle recipe submission
  async function handleAddRecipe() {
    try {
      let imageURL;

      if (image) {
        // If an image is selected, upload it and get the URL
        imageURL = await uploadImage(image);
      } else {
        // Use the default image URL from Firebase storage
        imageURL = defaultImages[type as RecipeType];
      }

      await addRecipe(imageURL);
    } catch (e) {
      console.log("error: ", e);
    }
  }

  // Reset form fields after submitting the recipe
  const resetFields = async () => {
    setImage(null);
    setName("");
    setType("");
    setIngredients("");
    setSteps([""]); // Reset steps
    setSelected(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="bg-neutral-50"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex w-full items-center bg-neutral-50 p-6 h-[360px]">
          {image ? (
            <Image
              source={{ uri: image }}
              className="h-64 w-80 rounded-md mb-3"
            />
          ) : (
            <View className="h-64 w-80 rounded-md items-center justify-center mb-3">
              <Image
                source={require("../../../assets/plateFood.png")}
                style={{ height: "100%", width: "80%", borderRadius: 8 }}
                resizeMode="cover"
              />
            </View>
          )}
          <TouchableOpacity
            className="p-3 bg-[#302C2C] rounded-2xl"
            onPress={pickImage}
          >
            <Entypo name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex flex-1 p-5 w-full rounded-tl-3xl rounded-tr-3xl bg-neutral-100">
          <Text className="font-semibold text-base text-[#302C2C] mb-4">
            Insira o nome da receita
          </Text>
          <TextInput
            onChangeText={(e) => setName(e)}
            placeholder="Nome"
            value={name}
            className="h-10 w-full p-2 border border-neutral-400 rounded-md mb-10"
          />

          {/* Recipe Type */}
          <Text className="font-semibold text-base text-[#302C2C] mb-4">
            Selecione o tipo de receita
          </Text>
          <View className="flex flex-row w-full p-2 items-center justify-center gap-x-3">
            <TouchableOpacity
              onPress={() => {
                handleCheck(1);
                setType("peixe");
              }}
              className={`h-[75px] w-[75px] bg-[#d5efff] rounded-full items-center justify-center ${getOpacity(
                1
              )}`}
            >
              <Ionicons name="fish" size={35} color="#302C2C" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleCheck(2);
                setType("carne");
              }}
              className={`h-[75px] w-[75px] bg-[#ffbaba] rounded-full items-center justify-center ${getOpacity(
                2
              )}`}
            >
              <MaterialCommunityIcons
                name="food-turkey"
                size={35}
                color="#302C2C"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleCheck(3);
                setType("vegetariano");
              }}
              className={`h-[75px] w-[75px] bg-[#d2efc7] rounded-full items-center justify-center ${getOpacity(
                3
              )}`}
            >
              <FontAwesome6 name="carrot" size={28} color="#302C2C" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleCheck(4);
                setType("pastelaria");
              }}
              className={`h-[75px] w-[75px] bg-[#ffe47ab7] rounded-full items-center justify-center ${getOpacity(
                4
              )}`}
            >
              <MaterialCommunityIcons
                name="food-croissant"
                size={35}
                color="#302C2C"
              />
            </TouchableOpacity>
          </View>

          {/* Ingredients Section */}
          <Text className="font-semibold text-base text-[#302C2C] mt-6 mb-3">
            Ingredientes
          </Text>
          <TextInput
            onChangeText={(e) => setIngredients(e)}
            multiline={true}
            value={ingredients}
            numberOfLines={4}
            textAlignVertical="top"
            className="h-32 bg-white p-4 rounded-md border border-neutral-200"
          />

          {/* Steps Section */}
          <Text className="font-semibold text-base text-[#302C2C] mt-6 mb-3">
            Preparação
          </Text>
          {steps.map((step, index) => (
            <View key={index} className="flex-row items-center mb-3">
              <View className=" full w-full bg-white border border-neutral-200 rounded-md">
                <View className="flex-row p-3 justify-between">
                  <View className=" h-11 w-11 p-3 px-4 rounded-md self-start bg-[#302C2C] items-center justify-center">
                    <Text className="text-white">{index + 1} </Text>
                  </View>
                  <View className=" flex-row gap-x-1">
                    {index > 0 && (
                      <TouchableOpacity
                        onPress={() => removeStep(index)}
                        className=" bg-red-500 h-11 w-11 rounded-md items-center justify-center"
                      >
                        <FontAwesome name="trash-o" size={21} color="white" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={addStep}
                      className="flex h-11 w-11 p-3 bg-[#302C2C] rounded-md items-center justify-center"
                    >
                      <Feather name="plus" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
                <TextInput
                  onChangeText={(text) => updateStep(text, index)}
                  value={step}
                  placeholder={`Passo ${index + 1}`}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="h-32 bg-white p-2 rounded-md "
                />
              </View>
            </View>
          ))}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleAddRecipe}
            className="flex w-32 self-center p-3 bg-[#302C2C] rounded-md items-center justify-center mt-6"
          >
            <Text className="text-white">Criar Receita</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddRecipe;
