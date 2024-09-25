import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";

export default function FamilySetupPage() {
  const navigateToCreateFamily = () => {
    router.push("/(family)/create");
  };

  const navigateToJoinFamily = () => {
    router.push("/(family)/join");
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/images/Logo_Nero AI_Standard_x4_upscayl_4x_realesrgan-x4plus-anime.png")}
      />
      <Text style={styles.title}>Setup Your Family!</Text>
      <TouchableOpacity
        onPress={navigateToCreateFamily}
        style={styles.buttonContainer}
      >
        <Text style={styles.buttonText}>Create New Family</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={navigateToJoinFamily}
        style={styles.buttonContainer}
      >
        <Text style={styles.buttonText}>Join Existing Family</Text>
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
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
