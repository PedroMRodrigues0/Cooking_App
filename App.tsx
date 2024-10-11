import React, { useEffect, useState } from "react";
import MyTabs from "./src/Routes/BottomTabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthenticateStack } from "./src/Routes/routes";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { View } from "react-native";
import LottieView from "lottie-react-native";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  // Listen to authentication state changes
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set the user state to the logged-in user
        setLoading(false);
      } else {
        setUser(null); // No user is signed in
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [auth]);

  return (
    <GestureHandlerRootView>
      {!loading ? (
        user ? (
          <MyTabs />
        ) : (
          <AuthenticateStack />
        )
      ) : (
        <View className=" w-full h-full items-center justify-center">
          <LottieView
            autoPlay
            style={{
              width: "100%",
              height: 384,
              backgroundColor: "white",
            }}
            source={require("./assets/loading.json")}
          />
        </View>
      )}
    </GestureHandlerRootView>
  );
}
