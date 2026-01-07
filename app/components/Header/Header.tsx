import { MaterialIcons } from '@expo/vector-icons';
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../styles/global";

import HeaderIndexContent from './components/HeaderIndexContent';
import HeaderTabsContent from './components/HeaderTabsContent';

type HeaderProps = {
    showIndexContent: boolean;
    showTabsContent: boolean;
    TabTittle: string;
};


export default function Header({
    showIndexContent = true,
    showTabsContent = false,
    TabTittle
}: HeaderProps) {
    const navigation = useNavigation();

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    return (
        <View
            style={[
                styles.header,
                globalStyles.row,
                globalStyles.itemscenter,
                globalStyles.spacebetween
            ]}
        >
            {showIndexContent && <HeaderIndexContent />}
            {showTabsContent && <HeaderTabsContent TabTittle={TabTittle}/>}

            <MaterialIcons
                onPress={openDrawer}
                name="menu"
                size={30}
                color="#fff"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 130,
        backgroundColor: "rgba(37, 97, 236, 1)",
        padding: 20,
    }
})