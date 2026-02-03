import { MaterialIcons } from '@expo/vector-icons';
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { StyleSheet, View } from "react-native";
import { globalStyles } from "../../styles/global";
import HeaderIndexContent from './components/HeaderIndexContent';
import HeaderTabsContent from './components/HeaderTabsContent';

type HeaderProps = {
    showIndexContent: boolean;
    showTabsContent: boolean;
    TabTitle: string;
    month?: number;
    year?: number;
    onChangePeriod?: (month: number, year: number) => void;
};

const Header = ({
    showIndexContent = true,
    showTabsContent = false,
    TabTitle,
    month,
    year,
    onChangePeriod

}: HeaderProps) => {

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

export default Header;

const styles = StyleSheet.create({
    header: {
        height: 130,
        backgroundColor: "rgba(37, 97, 236, 1)",
        padding: 20,
    }
});
