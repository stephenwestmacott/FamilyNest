import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { View } from "@/components/Themed";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Text, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
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
  current_family: string;
  profile_picture_url: string;
};

const CustomDrawerContent = (props: any) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null
  );

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
          setSelectedFamily(profileData?.current_family);
          setProfile(profileData);
          setName(profileData?.name);
          setEmail(session.user.email || "");
          setProfilePictureUrl(profileData?.profile_picture_url);
        }
      } else {
        Alert.alert("User Not Found");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const doLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert("Error Signing Out", error.message);
      } else {
        await AsyncStorage.clear();
        console.log("User signed out and AsyncStorage cleared");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred while signing out.");
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen options={{ headerShown: true, title: "Settings" }} />
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: profilePictureUrl || "" }}
            style={styles.profileImage}
          />
          <Text style={styles.profileText}>Name: {name || ""}</Text>
          <Text style={styles.profileText}>Email: {email || ""}</Text>
          <Text style={styles.profileText}>
            Selected Family: {selectedFamily || "hi"}
          </Text>
          <QrCode familyID={selectedFamily || "hi"} />
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
  profileContainer: {
    padding: 16,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  buttonContainer: {
    backgroundColor: "#e8b9b4",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    width: "100%",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
});
