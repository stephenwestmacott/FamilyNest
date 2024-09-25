import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase";
import { router } from "expo-router";

export default function CreateFamilyPage() {
  const [familyName, setFamilyName] = useState("");
  const [loading, setLoading] = useState(false);

  const createFamily = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    if (familyName.length === 0) {
      Alert.alert("Error", "Family Name cannot be empty");
      return;
    }

    setLoading(true);

    // Insert into Families table; trigger handles the junction insertion
    const { data: newFamily, error: familyError } = await supabase
      .from("Families")
      .insert([{ name: familyName, creator_id: session.user.id }])
      .select("family_id")
      .single();

    if (newFamily) {
      await supabase.from("ProfileFamilyJunction").insert({
        profile_id: session.user.id,
        family_id: newFamily.family_id,
        role: "admin",
      });
    }

    if (familyError) {
      Alert.alert("Error", familyError.message);
    } else {
      Alert.alert("Success", "Family created successfully");
      router.replace("/(drawer)/(tabs)/grocery");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Family</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={setFamilyName}
        value={familyName}
        placeholder="Family Name"
      />
      <TouchableOpacity
        onPress={createFamily}
        disabled={loading}
        style={styles.buttonContainer}
      >
        <Text style={styles.buttonText}>Create Family</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    padding: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textInput: {
    borderColor: "#ecbcb6",
    borderRadius: 4,
    borderWidth: 1,
    padding: 12,
    margin: 8,
    width: "80%",
  },
  buttonContainer: {
    backgroundColor: "#ecbcb6",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
