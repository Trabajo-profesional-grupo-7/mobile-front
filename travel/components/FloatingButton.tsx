import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, TouchableOpacity } from "react-native";
const windowHeight = Dimensions.get("window").height;
const colors = Colors.light;

interface Props {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  }

const FloatingButton = ({icon, onPress}:Props) => {
  return (
    <TouchableOpacity
      style={{
        position: "absolute",
        zIndex: 1,
        width: 70,
        height: 70,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.secondary,
        borderRadius: 50,
        right: 30,
        top: windowHeight - 200,
        elevation: 3,
      }}
      onPress={onPress}
    >
      <Ionicons name={icon} size={35} />
    </TouchableOpacity>
  );
};

export default FloatingButton;
