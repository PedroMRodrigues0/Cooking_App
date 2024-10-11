import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, ScrollView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { AuthStackNavigationProp } from "../../Routes/types";

// Firebase
import { auth, db } from "../../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Icons
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

// Helper function to validate email format
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const Register = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const [selectedGender, setSelectedGender] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation and Registration Handler
  const handleRegister = async () => {
    // Validate all required fields
    if (
      !name ||
      !surname ||
      !email ||
      !password ||
      !confirmPassword ||
      !selectedGender
    ) {
      Alert.alert("Erro", "Por favor preencha todos os campos.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Erro", "Por favor insira um endereço de email válido.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A palavra-passe deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As palavras-passe não coincidem!");
      return;
    }

    setLoading(true);

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save additional user information (name, surname, gender) in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        surname: surname,
        gender: selectedGender,
        email: email,
        createdAt: Date.now(),
      });

      Alert.alert("Conta criada com sucesso!");
      navigation.goBack(); // Navigate back to the login screen
    } catch (error: any) {
      let errorMessage = "Erro ao criar conta.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "O email já está em uso.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A palavra-passe é demasiado fraca.";
      }
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full h-full">
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
            <View className="items-center px-5">
              <Text className="font-bold text-xl mt-5 mb-5 text-[#302C2C]">
                Crie a sua Conta
              </Text>

              <LottieView
                autoPlay
                style={{ height: 300, width: "100%" }}
                source={require("../../../assets/LoginAnimation.json")}
              />
              <View className="p-6">
                {/* Name and Surname Fields */}
                <View className="NameSurnameContainer flex-row">
                  <TextInput
                    className="border border-gray-500 p-3 h-11 rounded-lg mr-2 w-[49%]"
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                    editable={!loading}
                  />
                  <TextInput
                    className="border border-gray-500 p-3 h-11 rounded-lg w-[49%]"
                    placeholder="Apelido"
                    value={surname}
                    onChangeText={setSurname}
                    editable={!loading}
                  />
                </View>

                {/* Gender Selection */}
                <View className="GenderContainer flex-row py-4 self-start items-start">
                  <View className="flex-row items-center gap-x-3 mr-8">
                    <TouchableOpacity
                      className={`border-[4px] border-[#302C2C] rounded-full items-center justify-center h-6 w-6`}
                      onPress={() => setSelectedGender("male")}
                    >
                      {selectedGender === "male" && (
                        <AntDesign
                          name="checkcircle"
                          size={11}
                          color="#302C2C"
                        />
                      )}
                    </TouchableOpacity>
                    <Text className="text-[#302C2C] font-semibold">
                      Masculino
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-x-3">
                    <TouchableOpacity
                      className={`border-[4px] border-[#302C2C] rounded-full items-center justify-center h-6 w-6`}
                      onPress={() => setSelectedGender("female")}
                    >
                      {selectedGender === "female" && (
                        <AntDesign
                          name="checkcircle"
                          size={11}
                          color="#302C2C"
                        />
                      )}
                    </TouchableOpacity>
                    <Text className="text-[#302C2C] font-semibold">
                      Feminino
                    </Text>
                  </View>
                </View>

                {/* Email Field */}
                <TextInput
                  className="border border-gray-500 p-3 h-11 mb-5 rounded-lg"
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                {/* Password Field */}
                <View className="flex-row items-center border mb-5 border-gray-500 h-11 p-3 rounded-lg">
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

                {/* Confirm Password Field */}
                <View className="flex-row items-center mb-6 border border-gray-500 h-11 p-3 rounded-lg">
                  <TextInput
                    className="flex-1"
                    placeholder="Confirm Password"
                    secureTextEntry={!confirmPasswordVisible}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  >
                    <Entypo
                      name={confirmPasswordVisible ? "eye" : "eye-with-line"}
                      size={20}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>

                {/* Buttons */}
                <View className="flex-row">
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-3 w-[49%] items-center rounded-lg mr-2 bg-[#302C2C]"
                    disabled={loading}
                  >
                    <Text className="text-white font-semibold">
                      Iniciar Sessão
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleRegister}
                    className="p-3 w-[49%] items-center rounded-lg bg-orange-300"
                    disabled={loading}
                  >
                    <Text className="font-semibold text-[#302C2C]">
                      {loading ? "A Criar..." : "Registar"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
