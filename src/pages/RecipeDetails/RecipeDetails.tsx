import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TextInput,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BlurView } from "expo-blur";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase"; // Adjust the import according to your file structure
import { StatusBar } from "expo-status-bar";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { CombinedStackParamList } from "../../Routes/types";
import { StackNavigationProp } from "@react-navigation/stack";

type RecipeDetailsNavigationProp = StackNavigationProp<
  CombinedStackParamList,
  "RecipeDetails"
>;

type RecipeDetailsRouteProp = RouteProp<
  CombinedStackParamList,
  "RecipeDetails"
>;

interface RecipeDetailsProps {
  route: RecipeDetailsRouteProp;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({ route }) => {
  const navigation = useNavigation<RecipeDetailsNavigationProp>();
  const { item } = route.params;
  const [ingredients, setIngredients] = useState(item.ingredients); // State to hold ingredients
  const [steps, setSteps] = useState(item.steps); // State to hold steps
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility for ingredients
  const [stepsModalVisible, setStepsModalVisible] = useState(false); // State to control modal visibility for steps

  // Function to format the date
  const formatDate = (timestamp: any) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const handleSaveIngredients = async () => {
    try {
      const recipeRef = doc(db, "recipe", item.id);
      await updateDoc(recipeRef, { ingredients });
      Alert.alert("Success", "Ingredients updated successfully!");
      setModalVisible(false); // Close the modal
    } catch (error) {
      console.error("Error updating ingredients: ", error);
      Alert.alert("Error", "Could not update ingredients.");
    }
  };

  const handleSaveSteps = async () => {
    try {
      const recipeRef = doc(db, "recipe", item.id);
      await updateDoc(recipeRef, { steps });
      Alert.alert("Success", "Steps updated successfully!");
      setStepsModalVisible(false); // Close the modal
    } catch (error) {
      console.error("Error updating steps: ", error);
      Alert.alert("Error", "Could not update steps.");
    }
  };

  const addStep = () => {
    setSteps([...steps, ""]); // Add a new empty step
  };

  const updateStep = (text: string, index: number) => {
    const newSteps = [...steps];
    newSteps[index] = text;
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  return (
    <ScrollView className="flex w-full h-full bg-neutral-50">
      <StatusBar style="dark" />
      <View className="absolute z-10 mt-14 ml-4 rounded-md overflow-hidden ">
        <BlurView
          intensity={50}
          tint="light"
          className="w-full h-full rounded-md"
        >
          <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={30} color="white" />
          </TouchableOpacity>
        </BlurView>
      </View>

      <Image
        source={{ uri: item.image }}
        className="w-full h-[400px] rounded-br-[40px] rounded-bl-[40px]"
      />

      <View className="absolute top-[360px] left-10 right-10 z-20 p-4 items-center bg-white rounded-2xl justify-center shadow-md">
        <Text className="text-xl text-[#302C2C] font-semibold">
          {item.name}
        </Text>
        <View className="flex-row w-64 justify-between mt-4 ">
          <View className="flex-row items-center">
            <AntDesign name="calendar" size={20} color="#302C2C" />
            <Text className="ml-1 text-gray-500">{formatDate(item.date)}</Text>
          </View>
          <View className="flex-row items-center">
            {item.type === "peixe" && (
              <Ionicons name="fish" size={20} color="#302C2C" />
            )}
            {item.type === "carne" && (
              <MaterialCommunityIcons
                name="food-turkey"
                size={20}
                color="#302C2C"
              />
            )}
            {item.type === "vegetariano" && (
              <FontAwesome6 name="carrot" size={20} color="#302C2C" />
            )}
            {item.type === "pastelaria" && (
              <MaterialCommunityIcons
                name="food-croissant"
                size={20}
                color="#302C2C"
              />
            )}
            <Text className="ml-1 text-gray-500">{item.type}</Text>
          </View>
        </View>
      </View>

      <View className="flex-1 mt-24 px-5">
        {/* Ingredients Section */}
        <Text className="font-semibold text-base text-[#302C2C] mt-6 mb-3">
          Ingredientes
        </Text>
        <View className="w-full p-2 bg-white border border-neutral-100 mb-5 rounded-xl">
          <TouchableOpacity
            className="justify-center items-center p-2 bg-[#302C2C] rounded-xl self-end"
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="edit" size={20} color="white" />
          </TouchableOpacity>
          <Text>{ingredients}</Text>
        </View>

        {/* Steps Section */}
        <Text className="font-semibold text-base text-[#302C2C] mt-6 mb-3">
          Preparação
        </Text>
        <View className="w-full p-2 bg-white border border-neutral-100 mb-5 rounded-xl">
          <TouchableOpacity
            className="justify-center items-center p-2 bg-[#302C2C] rounded-xl self-end"
            onPress={() => setStepsModalVisible(true)}
          >
            <MaterialIcons name="edit" size={20} color="white" />
          </TouchableOpacity>
          {steps.map((step, index) => (
            <Text key={index}>{`${index + 1}. ${step}`}</Text>
          ))}
        </View>
      </View>

      {/* Modal for editing ingredients */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          className="flex-1 justify-center items-center bg-transparent"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <View className="w-80 bg-white p-5 rounded-xl shadow-lg">
            <Text className="text-lg font-semibold">Editar Ingredientes</Text>
            <TextInput
              multiline
              value={ingredients}
              onChangeText={setIngredients}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                padding: 10,
                marginTop: 10,
              }}
              placeholder="Enter ingredients"
            />
            <View className="flex justify-end flex-row p-2 ">
              <TouchableOpacity
                className="h-10 p-2 justify-center items-center rounded-md bg-green-300"
                onPress={handleSaveIngredients}
              >
                <Text className="font-semibold text-[#302C2C]">Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="h-10 p-2 justify-center items-center rounded-md ml-2 bg-red-300"
                onPress={() => setModalVisible(false)}
              >
                <Text className="font-semibold text-[#302C2C]">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for editing steps */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={stepsModalVisible}
        onRequestClose={() => setStepsModalVisible(false)}
      >
        <View
          className="flex-1 justify-center items-center bg-transparent"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <View className="w-80 bg-white p-5 rounded-xl shadow-lg">
            <Text className="text-lg font-semibold mb-4">Editar Passos</Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              className=" max-h-96"
            >
              {steps.map((step, index) => (
                <View key={index} className="flex-row items-center mb-3">
                  <Text className="text-[#302C2C]">{index + 1}. </Text>
                  <TextInput
                    onChangeText={(text) => updateStep(text, index)}
                    value={step}
                    placeholder={`Passo ${index + 1}`}
                    className="flex-1 bg-white p-2 border border-neutral-300 rounded-md"
                  />
                  {index > 0 && (
                    <TouchableOpacity
                      onPress={() => removeStep(index)}
                      className="ml-3 bg-red-400 p-2 rounded-md"
                    >
                      <FontAwesome name="trash-o" size={25} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>
            <View className="flex flex-row mt-10 justify-between ">
              <TouchableOpacity
                onPress={addStep}
                className=" flex p-2 px-3 bg-[#302C2C] rounded-md items-center justify-center"
              >
                <Feather name="plus" size={20} color="white" />
              </TouchableOpacity>
              <View className=" flex-row">
                <TouchableOpacity
                  className="h-10 p-2 justify-center items-center rounded-md bg-green-300"
                  onPress={handleSaveSteps}
                >
                  <Text className="font-semibold text-[#302C2C]">Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="h-10 p-2 justify-center items-center rounded-md ml-2 bg-red-300"
                  onPress={() => setStepsModalVisible(false)}
                >
                  <Text className="font-semibold text-[#302C2C]">Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default RecipeDetails;
