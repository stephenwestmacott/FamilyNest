import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, View, Text, Image } from "react-native";
import { supabase } from "../lib/supabase";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Link, router } from "expo-router";

//async function CreateUserinDB() {await supabase.from("users").insert([{ email: user.email, display_name: user.displayName }]);}

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // For confirming password
  const [displayName, setDisplayName] = useState(""); // For display name
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    // Check if email is valid
    if (!email.includes("@")) {
      Alert.alert("Error", "Invalid email address");
      return;
    }

    // Check if display name is not empty
    if (displayName.length === 0) {
      Alert.alert("Error", "Display Name cannot be empty");
      return;
    }

    // Check if display name is longer than 25 characters
    if (displayName.length > 25) {
      Alert.alert("Error", "Display Name must 25 characters or less");
      return;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // Check if password is at least 8 characters long
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: displayName,
        },
      },
    });

    if (error) {
      Alert.alert("Sign Up Error", error.message);
    } else {
      Alert.alert(
        "Verify Your Email",
        "A verification link has been sent to your email. Please verify your email to complete the registration process."
      );
      router.push("/(auth)/signin");
    }
    setLoading(false);
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View>
        <Image
          style={{ width: 200, height: 200, alignSelf: "center" }}
          source={require("../../assets/images/Logo_Nero AI_Standard_x4_upscayl_4x_realesrgan-x4plus-anime.png")}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setDisplayName(text)}
          value={displayName}
          placeholder="Display Name"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry={true}
          placeholder="Confirm Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TouchableOpacity
          disabled={loading}
          onPress={() => signUpWithEmail()}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.verticallySpaced}>
        <Text>Already have an account?</Text>
        <Link href="/(auth)/signin">Sign In</Link>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
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
    backgroundColor: "#ecbcb6",
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
    borderColor: "#ecbcb6",
    borderRadius: 4,
    borderStyle: "solid",
    borderWidth: 1,
    padding: 12,
    margin: 8,
  },
});
