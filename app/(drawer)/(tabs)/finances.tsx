import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import QRCodeStyled from "react-native-qrcode-styled";
import { useEffect } from "react";
import { fetchUserID } from "../../../api/supabaseUtil";
import QrCode from "@/components/QrCode";

export default function TabThreeScreen() {
  useEffect(() => {
    fetchUserID();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finances</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
