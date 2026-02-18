import { StyleSheet, Text, View } from "react-native";
import globalStyles from "@/styles/global";

// Tipagem
type InfoBoxProps = {
    label: string;
    value: any;
    color?: string;
};

const InfoBox = ({ label, color, value }: InfoBoxProps) => {
    
    // Render
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
});

export default InfoBox