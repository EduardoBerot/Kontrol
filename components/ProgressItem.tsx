import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from "react-native";
import * as Progress from 'react-native-progress';
import globalStyles from '@/styles/global';
import formatCurrency from '@/utils/FormatCurrency';

// Tipagem
type ProgressItemProps = {
    icon: any;
    label: string;
    spent: string;
    limit: string;
    color: string;
};

// Coloração condicional
const getProgressColor = (progress: number) => {
    if (progress < 0.5) return "#22c55e";
    if (progress < 0.8) return "#eab308";
    return "#ef4444";
};

const ProgressItem = ({ icon, label, spent, limit, color }: ProgressItemProps) => {

    const normalizeNumber = (value: string) =>
        Number(
            value
                .replace(/\./g, '')
                .replace(',', '.')
                .replace(/[^\d.-]/g, '')
        );

    const spentValue = normalizeNumber(spent);
    const limitValue = normalizeNumber(limit);

    const progress = limitValue > 0 ? spentValue / limitValue : 0;
    const percentSpent = Math.min(progress * 100, 100);
    const remainingValue = limitValue - spentValue;

    return (
        <View style={[styles.card]}>

            {/* Header */}
            <View style={[globalStyles.row, globalStyles.spacebetween, styles.header]}>
                <View style={[globalStyles.row, styles.left]}>
                    <View style={[styles.iconBox, { backgroundColor: `${color}20` }]}>
                        <MaterialIcons name={icon} size={22} color={color} />
                    </View>
                    <Text style={styles.label}>{label}</Text>
                </View>

                <Text style={styles.limit}>
                    {formatCurrency(limitValue)}
                </Text>
            </View>

            {/* Progress bar */}
            <View style={[globalStyles.itemscenter, globalStyles.row]}>
                <Progress.Bar
                    progress={progress}
                    width={null}
                    height={14}
                    borderRadius={10}
                    color={getProgressColor(progress)}
                    unfilledColor="#f1f5f9"
                    borderWidth={0}
                    animated
                    style={{ flex: 1 }}
                />
            </View>

            {/* Footer */}
            <View style={[globalStyles.row, globalStyles.spacebetween, styles.footer]}>
                <Text style={styles.remaining}>
                    Restam: {formatCurrency(remainingValue)}
                </Text>
                <Text style={styles.percent}>
                    {Math.round(percentSpent)}%
                </Text>
            </View>

        </View>
    );
};

export default ProgressItem;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        gap: 12
    },

    header: {
        alignItems: "center"
    },

    left: {
        alignItems: "center",
        gap: 10
    },

    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827"
    },

    limit: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151"
    },

    footer: {
        alignItems: "center"
    },

    remaining: {
        fontSize: 13,
        color: "#6b7280"
    },

    percent: {
        fontSize: 13,
        fontWeight: "600",
        color: "#374151"
    }
});
