import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efefefff",
    },

    row: {
        flexDirection: "row",
    },

    itemscenter: {
        alignItems: "center",
    },

    spacebetween: {
        justifyContent: "space-between",
    },

    text: {
        fontSize: 16,
        color: "#787878ff"
    },

    mintext: {
        fontSize: 12,
        color: "#787878ff"
    },

    mintitle: {
        fontSize: 20,
        color: "#000"
    },

    title: {
        fontSize: 28,
        color: "#000"
    },
})