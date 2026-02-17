import { Text } from "react-native";


type HeaderTabsProps = {
    TabTittle: string;
};

const HeaderTabsContent = ({TabTittle}: HeaderTabsProps) => {
    return (
        <>
            <Text style={{ textAlign: "center", color: "#fff", fontSize: 24 }}>
                {TabTittle}
            </Text>
        </>
    )
}

export default HeaderTabsContent