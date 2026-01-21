import { Text, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { globalStyles } from "../styles/global";
import * as Progress from 'react-native-progress';

// Tipagem
type ProgressItemProps = {
    icon: any;
    label: string;
    spent: number;
    limit: number;
};

// Coloração condicional
const progressValue = 0.9;

const getProgressColor = (progress: number) => {
    if (progress < 0.5) return "#22c55e"; 
    if (progress < 0.8) return "#eab308"; 
    return "#ef4444";     
};


export default function ProgressItem ({icon, label, spent, limit}: ProgressItemProps) {
    return (
        <View style={{ gap: 8, marginBottom: 20 }}>

            <View style={[globalStyles.row, globalStyles.spacebetween]}>
                <MaterialIcons name={icon} size={30} />
                <Text>{label}</Text>
                <Text>{limit}</Text>
            </View>

            <View style={[globalStyles.itemscenter, globalStyles.row]}>
                <Progress.Bar
                    progress={progressValue}
                    width={null}
                    height={20}
                    borderRadius={20}
                    color={getProgressColor(progressValue)}
                    unfilledColor="#f0f1f3ff"   // fundo da barra (cinza claro)
                    borderWidth={1}
                    borderColor="#d1d5db"
                    animated
                    style={{
                        flex: 1,
                    }}
                />
            </View>

            <View style={[globalStyles.row, globalStyles.spacebetween]}>
                <Text style={globalStyles.mintext}>Restam: {limit - spent}</Text>
                <Text style={globalStyles.mintext}>80% utilizado</Text>
            </View>
            
        </View>
    )
}