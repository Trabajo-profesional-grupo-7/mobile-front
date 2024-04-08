import { ActivityIndicator, Dimensions, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Chip } from 'react-native-paper';
import { AttractionCard } from '@/components/AttractionCard';
import { API_URL, useAuth } from '../context/AuthContext';
import axios from 'axios';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface AttractionParams {
    id: string; 
    displayName: { text: string; }; 
    likes_count: string; 
    done_count: string; 
    avg_rating: string; 
}

export default function SearchResult() {
    const params = useLocalSearchParams();

    const [attractions, setAttractions] = useState([]);
    const {onRefreshToken} = useAuth();

    const getAttractions = async () => {
        await onRefreshToken!;
        try {
            const result = await axios.post(`${API_URL}/attractions/search?attraction=${params.searchTerm}`);
            if (result.data) {
                const parsedPlaces = result.data.places.map((place: AttractionParams) => ({
                    id: place.id,
                    displayName: place.displayName.text,
                    likes_count: place.likes_count,
                    done_count: place.done_count,
                    avg_rating: place.avg_rating
                  }));
                setAttractions(parsedPlaces)
            }
              
        } catch (e) {
            alert(e);
        }
    }
    
    const renderAttraction = ({item}:{item:{displayName:string, id:string,likes_count:number,done_count:number,avg_rating:number}}) => {
        return (
            <AttractionCard data={item}></AttractionCard>
        )
    }

    const renderLoader = () => {
        return (
            <View style={{margin:15}}>
            <ActivityIndicator size="large" color={Colors.light.primary}/>
            </View>
        )
    }

    const loadMoreAttractions = () => {
        //getAttractions()
    }

    useEffect(() => {
        getAttractions()
    }, []);

    return (
        <>
            <View style={styles.container}>
                <Text style={{fontSize: 25, fontWeight: 'bold', marginBottom:10, marginLeft:10}}>Search results</Text>
                <FlatList 
                    data={attractions} 
                    renderItem={renderAttraction}
                    style={{width:"100%"}}
                    ListFooterComponent={renderLoader}
                    onEndReached={loadMoreAttractions}
                    onEndReachedThreshold={0}
                >
                </FlatList>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:10
  }
});
