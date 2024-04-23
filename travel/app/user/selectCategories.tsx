import LoadingIndicator from "@/components/LoadingIndicator";
import { router, useLocalSearchParams } from "expo-router";
import { SetStateAction, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Colors from '@/constants/Colors';
const colors = Colors.light;
import { API_URL, useAuth } from '../context/AuthContext';
import AccountButton from "@/components/AccountButton";
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import axios from "axios";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



export default function SelectCategories() {
    const params = useLocalSearchParams();
    const email = params.email as string;
    const date = params.date as string;
    const username = params.username as string;
    const password = params.password as string;

    const [categories, setCategories] = useState<string[]>([]);
    const [selected, setSelected] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const {onRegister} = useAuth();

    useEffect(() => {

        const getCategories = async () => {
            setIsLoading(true)
            try {
                const result = await axios.get(`${API_URL}/metadata`)
                const formattedCategories = result.data.detail.attraction_types.map((category: string) => {
                    return category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ');
                });
                setCategories(formattedCategories)
            } catch (e) {
                alert(e)
            }
            setIsLoading(false)
        }
        getCategories()
    }, []);

    const register = async () => {
        setIsLoading(true);
        try {
            const result = await onRegister!(email, password, username, date, [""]);
            if (result && result.error) {
              console.log(result);
              alert("Error registering")
            } else {
              console.log(result);
              alert("Account succesfully registered")
              router.back();
            }
        } catch (e) {
            alert(e)
        }
        setIsLoading(false);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select categories</Text>
            <View style={{width:"75%"}}>
                <MultipleSelectList 
                    setSelected={(val: SetStateAction<string[]>) => setSelected(val)} 
                    data={categories} 
                    save="value"
                    onSelect={() => console.log(selected)} 
                    label="Categories"
                />
            </View>

            <View style={{marginBottom:"20%"}}>
              <AccountButton title="Sign up" onPress={register}/>
            </View>
            {isLoading && (
              <LoadingIndicator/>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: Math.round(windowHeight)
    },
    title: {
      fontSize: 40,
      fontWeight: 'bold',
    },
    separator: {
      marginVertical: 30,
      width: '80%',
      marginTop:230
    },
    input: {
      height: windowHeight*0.05,
      width: windowWidth*0.6,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderRadius:10,    
    },
});
  