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

export default function JoinFamilyPage() {
  const [familyId, setFamilyId] = useState("");
  const [loading, setLoading] = useState(false);

  const joinFamily = async () => {
    if (familyId.length === 0) {
      Alert.alert("Error", "Family ID cannot be empty");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("ProfileFamilyJunction") // Replace with your actual junction table name
      .insert([{ profile_id: supabase.auth.user()?.id, family_id: familyId }]);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Successfully joined the family");
      router.push("/(drawer)/(tabs)/grocery");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join an Existing Family</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={setFamilyId}
        value={familyId}
        placeholder="Family ID"
      />
      <TouchableOpacity
        onPress={joinFamily}
        disabled={loading}
        style={styles.buttonContainer}
      >
        <Text style={styles.buttonText}>Join Family</Text>
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
