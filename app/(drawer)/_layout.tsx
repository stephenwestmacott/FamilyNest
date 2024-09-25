import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { View } from "@/components/Themed";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QrCode from "@/components/QrCode";

// Define Profile type based on your table schema
type Profile = {
  id: string;
  email: string;
  name: string;
  // Add other profile fields here
};

const CustomDrawerContent = (props: any) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) {
          Alert.alert("Error Fetching Session", sessionError.message);
          return;
        }

        if (session?.user) {
          const { data: profileData, error } = await supabase
            .from("Profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error) {
            Alert.alert("Error Fetching Profile", error.message);
          } else {
            setProfile(profileData as Profile);
          }
        } else {
          Alert.alert("User Not Found");
        }
      } catch (error) {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    };

    fetchProfileData();
  }, []);

  const doLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert("Error Signing Out", error.message);
      } else {
        // Clear AsyncStorage to remove any persisted sessions
        await AsyncStorage.clear();
        console.log("User signed out and AsyncStorage cleared");
        // Redirect to the login screen after sign-out
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred while signing out.");
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen options={{ headerShown: true, title: "Settings" }} />
        <View style={{ padding: 16 }}>
          <Text>Profile:</Text>
          <Text>
            {profile ? JSON.stringify(profile, null, 2) : "Loading profile..."}
          </Text>
          <QrCode familyID={profile?.id || "hi"} />
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
