import { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { API_URL, useAuth } from "../context/AuthContext";
import axios from "axios";
import { AttractionParams, sanitizeString } from "../(tabs)";
import { AttractionCard } from "@/components/AttractionCard";
import Colors from "@/constants/Colors";
const attractionsPerPage = 10

export default function DoneAttractions() {
    const [attractions, setAttractions] = useState([]);
    const [noMoreAttractions, setNoMoreAttractions] = useState(false)
    const {onRefreshToken} = useAuth();

    const getDoneAttractions = async () => {
        await onRefreshToken!();
        try {
            const result = await axios.get(`${API_URL}/attractions/done-list`)
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

    const renderAttraction = ({item}:{item:{attraction_name:string, attraction_id:string,likes_count:string,done_count:string,avg_rating:string, city:string, country: string, photo:string}}) => {
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
        getDoneAttractions();
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