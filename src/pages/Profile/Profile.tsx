import { View, Image, Text, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

// Firebase
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

// Types
import { UserType } from "../Home/types";

// Icons
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Profile = () => {
  const [userData, setUserData] = useState<UserType | null>(null);
  const auth = getAuth();
  const user = auth.currentUser;

  const isFocused = useIsFocused();

  const SignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        Alert.alert("Desconectado com sucesso!");
      })
      .catch((error) => {
        console.log(error);
      });
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
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserdata();
  }, [isFocused]);

  return (
    <View className=" flex h-full w-full bg-neutral-50">
      <StatusBar style="dark" />
      <View className="items-center border-b border-neutral-200 h-[410px]">
        <Image
          source={require("../../../assets/perfil.jpg")}
          className=" w-full h-[250px] opacity-90 rounded-br-[50px] rounded-bl-[50px]"
        />
        <View className=" absolute h-24 w-24 justify-center items-center rounded-2xl bg-neutral-50 top-[205px]">
          {userData?.gender === "female" ? (
            <Image
              source={require("../../../assets/FemaleAvatar.jpg")}
              className="h-20 w-20 rounded-2xl"
            ></Image>
          ) : (
            <Image
              source={require("../../../assets/MaleAvatar.jpg")}
              className="h-20 w-20 rounded-2xl"
            ></Image>
          )}
        </View>
        <Text className=" text-lg font-semibold mt-16">
          {userData ? `${userData.name} ${userData.surname}` : ""}
        </Text>
        <View className="flex-1 w-full items-end justify-center px-8">
          <TouchableOpacity
            onPress={() => SignOut()}
            className=" items-center h-12 justify-center rounded-lg bg-[#302C2C] p-3"
          >
            <MaterialIcons name="logout" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 items-center gap-y-5 p-5  ">
        <View className="MainContainer w-full ">
          <View className="IdentContainer w-16 items-center p-2 bg-white border-b border-neutral-100 rounded-tl-xl rounded-tr-xl">
            <Text className=" text-gray-500">Email</Text>
          </View>
          <View className="InformationContainer p-4 w-full  rounded-bl-xl rounded-r-xl bg-white">
            <Text className=" font-semibold text-[#302C2C]">
              {userData?.email}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;
