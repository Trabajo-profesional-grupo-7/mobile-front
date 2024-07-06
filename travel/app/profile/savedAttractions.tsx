import { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { API_URL, useAuth } from "../context/AuthContext";
import axios from "axios";
import { AttractionParams, sanitizeString } from "../(tabs)";
import { AttractionCard } from "@/components/AttractionCard";
import Colors from "@/constants/Colors";
const attractionsPerPage = 10

export default function SavedAttractions() {
    const [attractions, setAttractions] = useState([]);
    const [noMoreAttractions, setNoMoreAttractions] = useState(false)
    const {onRefreshToken} = useAuth();

    const getSavedAttractions = async () => {
        await onRefreshToken!();
        try {
            const result = await axios.get(`${API_URL}/attractions/save-list`)
            if (result.data) {
                const parsedPlaces: [] = result.data.map((place: AttractionParams) => ({
                    attraction_id: place.attraction_id,
                    attraction_name: sanitizeString(place.attraction_name),
                    city: place.city,
                    country: place.country,
                    photo: place.photo
                }));
                if (parsedPlaces.length < attractionsPerPage) {
                    setNoMoreAttractions(true)
                }
                setAttractions([
                    ...attractions,
                    ...parsedPlaces
                ])
            }
        } catch (e) {
            alert(e)
        }
    }

    const renderAttraction = ({item}:{item:AttractionParams}) => {
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
        
    }

    useEffect(() => {
        getSavedAttractions();
      }, []);

    return (
        <View style={{paddingTop:10}}>
            <FlatList 
                data={attractions} 
                renderItem={renderAttraction}
                style={{width:"100%"}}
                ListFooterComponent={noMoreAttractions ? null : renderLoader}
                onEndReached={noMoreAttractions ? null : loadMoreAttractions}
                onEndReachedThreshold={0}
            >
            </FlatList>
        </View>
    )
}