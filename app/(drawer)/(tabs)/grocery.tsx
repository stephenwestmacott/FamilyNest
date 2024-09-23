import { StyleSheet } from "react-native";
import { View } from "@/components/Themed";
import List from "@/components/List";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <List />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
