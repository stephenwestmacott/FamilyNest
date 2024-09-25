import { StyleSheet } from "react-native";
import { View } from "@/components/Themed";
import QRCodeStyled from "react-native-qrcode-styled";

interface QrCodeProps {
  familyID: string;
}

const QrCode = ({ familyID }: QrCodeProps) => {
  return (
    <View style={styles.container}>
      <QRCodeStyled
        data={familyID}
        style={{ backgroundColor: "white" }}
        padding={20}
        pieceSize={8}
        pieceScale={1.04}
        gradient={{
          type: "linear",
          options: {
            colors: ["#000", "#ecbcb6"],
          },
        }}
      />
    </View>
  );
};

export default QrCode;

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
