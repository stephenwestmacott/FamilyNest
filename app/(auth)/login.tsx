import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, View, Text, Image } from "react-native";
import { supabase } from "../lib/supabase";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Dimensions } from "react-native";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // For confirming password
  const [loading, setLoading] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false); // To track if it's sign-up mode

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert("Sign In Error", error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Sign Up Error", error.message);
    } else {
      Alert.alert(
        "Verify Your Email",
        "A verification link has been sent to your email. Please verify your email to complete the registration process.",
        [{ text: "OK", onPress: () => setIsSignUpMode(false) }]
      );
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
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>

      {isSignUpMode && (
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
      )}

      {!isSignUpMode ? (
        <>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <TouchableOpacity
              disabled={loading}
              onPress={() => signInWithEmail()}
              style={styles.buttonContainer}
            >
              <Text style={styles.buttonText}>SIGN IN</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.verticallySpaced}>
            <TouchableOpacity
              disabled={loading}
              onPress={() => setIsSignUpMode(true)} // Activate sign-up mode
              style={styles.buttonContainer}
            >
              <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            disabled={loading}
            onPress={() => signUpWithEmail()}
            style={[styles.buttonContainer, styles.submitButton]}
          >
            <Text style={styles.buttonText}>SUBMIT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={loading}
            onPress={() => setIsSignUpMode(false)} // Cancel sign-up mode
            style={[styles.buttonContainer, styles.cancelButton]}
          >
            <Text style={styles.buttonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      )}
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#4CAF50", // Green for submit
    width: Dimensions.get("window").width / 2 - 30,
  },
  cancelButton: {
    backgroundColor: "#F44336", // Red for cancel
    width: Dimensions.get("window").width / 2 - 30,
  },
});
