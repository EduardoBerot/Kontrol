import { Text, View, StyleSheet } from "react-native";
import { globalStyles } from "../styles/global";

// Tipagem
type InfoBoxProps = {
    label: string;
    value: string;
    color?: string;
};

export default function InfoBox({ label, color, value }: InfoBoxProps) {
    return (
        <View style={[styles.contentboxinfo, globalStyles.itemscenter]}>
            <Text style={globalStyles.mintext}>{label}</Text>
            <Text style={[globalStyles.mintitle, { color }]}>{value}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  contentboxinfo: {
    flex: 1
  },
})