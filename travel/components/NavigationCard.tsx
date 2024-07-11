import { Ionicons } from "@expo/vector-icons";
import {
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  StyleSheet,
} from "react-native";
const width = Dimensions.get("window").width;

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  text: string;
}

const NavigationCard = ({ onPress, icon, text }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: width - 8 * 3,
        padding: 8 * 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "transparent",
          alignItems: "center",
        }}
      >
        <Ionicons
          name={icon}
          color={"#a6683f"}
          size={8 * 5}
          style={styles.iconContainer}
        />
        <Text
          style={{
            paddingLeft: 8 * 2,
            fontSize: 8 * 2.5,
            fontWeight: "bold",
          }}
        >
          {text}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward-outline"
        color={"gray"}
        size={8 * 4}
        style={{ paddingRight: 8 * 2 }}
      />
    </TouchableOpacity>
  );
};

export default NavigationCard;

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: "#fab78c",
    padding: 8,
    borderRadius: 50,
    opacity: 1,
  },
});
