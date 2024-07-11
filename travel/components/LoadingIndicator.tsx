import { View, StyleSheet, ActivityIndicator } from "react-native";

const LoadingIndicator = () => {
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
};

export default LoadingIndicator;
