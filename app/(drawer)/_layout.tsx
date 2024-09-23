import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { View } from "@/components/Themed";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Image, Text } from "react-native-elements";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

// Define User type
type User = {
  id: string;
  email: string;
  // Add other user fields here
};

const CustomDrawerContent = (props: any) => {
  const [user, setUser] = useState<User | null>(null); // Set User | null

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user as User);
      } else {
        Alert.alert("Error Accessing User");
      }
    });
  }, []);

  const doLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error Signing Out User", error.message);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen options={{ headerShown: true, title: "Settings" }} />
        <View style={{ padding: 16 }}>
          <Text>{JSON.stringify(user, null, 2)}</Text>
          <TouchableOpacity onPress={doLogout} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerTitle: "FamilyNest",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#e8b9b4" },
        }}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 50,
  },
  buttonContainer: {
    backgroundColor: "#000968",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 8,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
