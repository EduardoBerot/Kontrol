import { StyleSheet, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import globalStyles from '@/styles/global';
import HeaderIndexContent from './Header/components/HeaderIndexContent';
import HeaderTabsContent from './Header/components/HeaderTabsContent';

// Tipagem
type HeaderProps = {
    showIndexContent: boolean;
    showTabsContent: boolean;
    TabTitle: string;
    month?: number;
    year?: number;
    onChangePeriod?: (month: number, year: number) => void;
};


const Header = ({ showIndexContent = true, showTabsContent = false, TabTitle, month, year, onChangePeriod}: HeaderProps) => {
    // Hooks
    const navigation = useNavigation();

    // Abrir menu lateral (drawer)
    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    // Render
    return (
        <View style={[styles.header, globalStyles.row, globalStyles.itemscenter, globalStyles.spacebetween]}>

            {showIndexContent && (
                <HeaderIndexContent
                    month={month!}
                    year={year!}
                    onChangePeriod={onChangePeriod!}
                />
            )}

            {showTabsContent && <HeaderTabsContent TabTittle={TabTitle} />}
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
        backgroundColor: "#3560e3",
        padding: 20,
    }
});

export default Header;
