import { Button, ButtonProps, Text, Dimensions, TouchableOpacity, View, StyleSheet } from "react-native";

import Colors from "@/constants/Colors";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const colors = Colors.light

const AccountButton = (props: ButtonProps) => {
    const {title, onPress} = props;
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.secondary,
        paddingVertical: 10,
        borderRadius:20,
        width:windowWidth*0.5,
        marginVertical: 5,
        alignItems:"center"
    },
    buttonText: {
      fontSize: 20,
      color:colors.text
    },
  });

export default AccountButton;
