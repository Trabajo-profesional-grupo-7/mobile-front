import { useState } from "react";
import { View, Text } from "react-native";
import {Calendar} from 'react-native-calendars';

export default function UserCalendar() {
    const [selected, setSelected] = useState('');


    return (
        <View style={{alignItems:"center", justifyContent:"center", flex:1}}>
            <Text style={{fontSize:40}}>Calendar</Text>
            <Calendar
                onDayPress={day => {
                    setSelected(day.dateString);
                }}
                markedDates={{
                    [selected]: {selected: true, disableTouchEvent: true, selectedColor: 'orange'}
                }}
            />
        </View>
    )
}