import { MaterialIcons } from '@expo/vector-icons';
import { Text } from "react-native";



export default function HeaderIndexContent() {


    return (
        <>
            <MaterialIcons name="person" size={30} color="#fff" />
            <Text style={{ textAlign: "center", color: "#fff", fontSize: 24 }}>
                Janeiro
                <MaterialIcons name="arrow-drop-down" size={25} />
            </Text>
        </>
    )
}
