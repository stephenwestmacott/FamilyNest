import { User } from "@supabase/supabase-js";
import { Stack } from "expo-router";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { supabase } from "./lib/supabase";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  // Ensure that user state can be null or a User object
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user); // Works if state type is User | null
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
    <Modal animationType="slide">
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen options={{ headerShown: true, title: "Settings" }} />
        <View style={{ padding: 16 }}>
          <Text>{JSON.stringify(user, null, 2)}</Text>
          <TouchableOpacity onPress={doLogout} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
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
  textInput: {
    borderColor: "#000968",
    borderRadius: 4,
    borderStyle: "solid",
    borderWidth: 1,
    padding: 12,
    margin: 8,
  },
});
