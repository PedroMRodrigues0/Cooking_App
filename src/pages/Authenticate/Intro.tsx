import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthStackNavigationProp } from "../../Routes/types";

const Intro = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();

  return (
    <SafeAreaView>
      <StatusBar style="dark" />
      <View className="flex w-full h-full">
        <View className=" w-full h-96 ">
          <LottieView
            autoPlay
            source={require("../../../assets/IntroAnimation.json")}
            style={{ width: "100%", height: 384 }}
          />
        </View>
        <View className="px-4 mt-4">
          <Text className="text-4xl font-bold text-[#302C2C] text-center">
            Bem-vindo à sua Cozinha Inteligente!
          </Text>
          <Text className=" text-center text-md leading-5 font-semibold text-gray-400 mt-2">
            Está sem ideias? Nós ajudamos a decidir o que cozinhar, gerando uma
            receita aleatória das suas coleções!
          </Text>
        </View>
        <View className="flex-1 p-8 items-center">
          <TouchableOpacity
            onPress={() => navigation.navigate("LoginPage")}
            className="flex mt-4 p-5 rounded-[50px] bg-orange-300"
          >
            <Text className=" text-lg font-semibold text-[#302C2C] ">
              Começar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Intro;
