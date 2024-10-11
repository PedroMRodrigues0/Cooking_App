import LottieView from "lottie-react-native";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { AuthStackNavigationProp } from "../../Routes/types";

// Firebase
import { auth } from "../../../firebase/firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

// Icons
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

// Helper function to validate email format
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const Login = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor preencha todos os campos.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Erro", "Por favor insira um endereço de email válido.");
      return;
    }

    setLoading(true);
    try {
      // Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (error: any) {
      let errorMessage = "Falha no login, tente novamente.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "Utilizador não encontrado.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Palavra-passe incorreta.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Endereço de email inválido.";
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (email) {
      if (!isValidEmail(email)) {
        Alert.alert("Erro", "Por favor insira um endereço de email válido.");
        return;
      }

      sendPasswordResetEmail(auth, email)
        .then(() => {
          Alert.alert("Email enviado!", "Verifique a sua caixa de correio.");
        })
        .catch((error) => {
          let errorMessage = "Erro ao enviar o email de recuperação.";
          if (error.code === "auth/user-not-found") {
            errorMessage = "Utilizador não encontrado.";
          }
          Alert.alert("Erro", errorMessage);
        });
    } else {
      Alert.alert("Email em falta", "Por favor insira o seu endereço de Email");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="w-full h-full bg-black">
          <LottieView
            autoPlay
            source={require("../../../assets/BackgroundAnimation.json")}
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              transform: [{ scale: 1.5 }], // Scaled to cover the screen
            }}
          />
          <View className="w-full items-center p-5">
            <Text className="font-bold text-xl text-[#302C2C]">
              Iniciar Sessão
            </Text>
          </View>
          <View>
            <LottieView
              autoPlay
              style={{ height: 300, width: "100%" }}
              source={require("../../../assets/LoginAnimation.json")}
            />
          </View>
          <View className="p-6 items-center gap-y-5">
            <TextInput
              className="border border-gray-500 h-11 w-80 p-3 rounded-lg"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
            <View className="flex-row items-center border border-gray-500 h-11 w-80 p-3 rounded-lg">
              <TextInput
                className="flex-1"
                placeholder="Password"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Entypo
                  name={passwordVisible ? "eye" : "eye-with-line"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => handleForgotPassword()}
              disabled={loading}
            >
              <Text className="underline">Esqueceu-se da palavra-passe?</Text>
            </TouchableOpacity>
            <View className="flex-row gap-x-3">
              <TouchableOpacity
                className="flex-row items-center p-3 bg-orange-300 rounded-lg"
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#302C2C" />
                ) : (
                  <>
                    <Text className="font-semibold text-[#302C2C]">
                      Iniciar Sessão
                    </Text>
                    <AntDesign
                      name="arrowright"
                      size={20}
                      color="#302C2C"
                      style={{ marginLeft: 2 }}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex-1 flex-row items-end justify-center p-5 gap-x-1">
            <Text>Ainda não tem conta?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("RegisterPage")}
            >
              <Text className="underline">Registar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
