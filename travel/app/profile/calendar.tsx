import LoadingIndicator from "@/components/LoadingIndicator";
import { useEffect, useState } from "react";
import { View, Text, Dimensions, FlatList, ScrollView } from "react-native";
import { Agenda, Calendar } from 'react-native-calendars';
import { API_URL, useAuth } from "../context/AuthContext";
import axios from "axios";
import { AttractionParams } from "../(tabs)";
import Colors from "@/constants/Colors";
import { dateParser } from "@/components/Parsers";
import { AttractionCard } from "@/components/AttractionCard";
const windowWidth = Dimensions.get('window').width;

type AttractionHash = {
    [key: string]: AttractionParams[];
};

type CaldendarDate = {
    [key: string]: { selected: boolean, selectedColor: string, textColor:string, start:boolean, end:boolean };
};

export default function UserCalendar() {
    const [selected, setSelected] = useState((new Date()).toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false)
    const { onRefreshToken } = useAuth();
    const [markedDates, setMarkedDates] = useState<CaldendarDate>();
    const [attractions, setAttractions] = useState<AttractionParams[]>();
    const [scheduledAttractions, setScheduledAttractions] = useState<AttractionHash>({})

    const getScheduledAttractions = async () => {
        setLoading(true)
        await onRefreshToken!();
        try {
            const attractions = await axios.get(`${API_URL}/attractions/scheduled-list?size=50`);
            if (attractions.data) {
                const dates: CaldendarDate = {};
                let hash: AttractionHash = {}
                for (const attraction of attractions.data) {
                    const parsed_attraction: AttractionParams = {
                        attraction_id: attraction.attraction_id,
                        attraction_name: attraction.attraction_name,
                        likes_count: attraction.liked_count,
                        done_count: attraction.done_count,
                        avg_rating: attraction.avg_rating,
                        city: attraction.city,
                        country: attraction.country,
                        photo: attraction.photo,
                    }
                    const date = attraction.scheduled_day.split('T')[0]
                    if (date >= selected) {
                        dates[date] = { start: true, end: true, selected: true, selectedColor:Colors.light.primary, textColor:"white" }
                        if (hash[date]) {
                            hash[date].push(parsed_attraction)
                        } else {
                            hash[date] = [parsed_attraction]
                        }
                    }
                }
                setScheduledAttractions(hash)
                setMarkedDates(dates)
                
            }
        } catch (e) {
            alert(e);
        }
        setLoading(false)
    }

    useEffect(() => {
        if (scheduledAttractions[selected]) {
            setAttractions(scheduledAttractions[selected])
        }
    }, [scheduledAttractions]);

    useEffect(() => {
        getScheduledAttractions();
    }, []);

    const handleDayPress = (day: string) => {
        setAttractions([])
        setSelected(day)
        if (scheduledAttractions[day]) {
            setAttractions(scheduledAttractions[day])
        } else {
            setAttractions([])
        }
    }

    return (
        <View style={{ alignItems: "center", justifyContent: "flex-start", flex: 1 }}>
            <Calendar
                style={{ width: windowWidth }}
                markingType={'multi-period'}
                initialDate={new Date().toDateString()}
                minDate={new Date().toDateString()}
                maxDate={'2032-05-30'}
                markedDates={markedDates}
                onDayPress={day => {
                    handleDayPress(day.dateString)
                }}
                monthFormat={'yyyy/MM'}
                firstDay={1}
                onPressArrowLeft={subtractMonth => subtractMonth()}
                onPressArrowRight={addMonth => addMonth()}
                enableSwipeMonths={true}
            />
            <View style={{ flex: 1, width: windowWidth, paddingHorizontal: 20, paddingTop: 10 }}>
                {selected && (
                    <Text style={{ fontSize: 25, alignSelf:"center" }}>{dateParser(selected)}</Text>
                )}
                {attractions?.length ? (
                    <ScrollView>
                        <View style={{ marginTop: 5 }}></View>
                        {Object.entries(scheduledAttractions).map(([date,value], index) => (
                            <>
                                {selected == date && (
                                    <>
                                        {value.map((att, index) => (
                                            <AttractionCard key={att.attraction_id} data={att}></AttractionCard>
                                        ))}
                                    </>
                                )}
                            </>
                        ))}
                    </ScrollView>
                ) : 
                (
                    <Text style={{fontSize:40, fontStyle:"italic"}}> No attractions scheduled for this day</Text>
                )
                }
            </View>

            {loading && (
                <LoadingIndicator />
            )}
        </View>
    )
}