import { MaterialIcons } from '@expo/vector-icons';
import { Text } from "react-native";


type HeaderTabsProps = {
    TabTittle: string;
};

export default function HeaderTabsContent({TabTittle}: HeaderTabsProps) {
    return (
        <>
            <Text style={{ textAlign: "center", color: "#fff", fontSize: 24 }}>
                {TabTittle}
            </Text>
        </>
    )
}
