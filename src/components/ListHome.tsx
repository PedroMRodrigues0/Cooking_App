import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

// Pages
import { Recipe } from "../pages/Home/types";

interface ListHomeProps {
  navigation?: any;
  data: Recipe;
  data_name: string;
  data_type: string;
  data_image: string;
}

const ListHome: React.FC<ListHomeProps> = ({
  navigation,
  data,
  data_name,
  data_type,
  data_image,
}) => {
  return (
    <>
      <TouchableOpacity
        onPress={() => navigation.navigate("RecipeDetails", { item: data })}
        className="flex h-52 w-36 rounded-md  overflow-hidden relative ml-2 mr-2"
      >
        <Image
          source={{ uri: data_image }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
        <View className=" h-full w-full p-1 justify-between">
          <View className="flex h-12 items-center justify-center p-1 bg-white opacity-80 rounded-md">
            <Text className=" text-center text-xs">{data_name}</Text>
          </View>
          {data_type === "vegetariano" && (
            <View className="flex self-end px-1 py-1 border rounded-lg bg-[#C5D6C0] border-[#519240]">
              <Text className="text-xs text-[#519240]">{data_type}</Text>
            </View>
          )}
          {data_type === "carne" && (
            <View className="flex self-end px-1 py-1 border rounded-lg bg-[#f6bfbf] border-[#EA7777]">
              <Text className="text-xs text-[#EA7777]">{data_type}</Text>
            </View>
          )}
          {data_type === "peixe" && (
            <View className="flex self-end px-1 py-1 border rounded-lg bg-[#B8D4E7] border-[#57ADE8]">
              <Text className="text-xs text-[#57ADE8]">{data_type}</Text>
            </View>
          )}
          {data_type === "pastelaria" && (
            <View className="flex self-end px-1 py-1 border rounded-lg bg-[#EAE2C9] border-[#F0B349]">
              <Text className="text-xs text-[#F0B349]">{data_type}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};

export default ListHome;
