import { Alert } from "react-native";

export const confirmActionAlert = () => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      "Confirm Action",
      "Are you sure you want to proceed?",
      [
        {
          text: "Cancel",
          onPress: () => resolve(false),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => resolve(true),
        },
      ],
      { cancelable: false }
    );
  });
};
