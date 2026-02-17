import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efefefff",
    },

    indexcontent: {
        justifyContent: "center",
        top: -30,
        flexDirection: "row"
    },

    content: {
        alignItems: "center"
    },

    contentbox: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 10,
        marginBottom: 20
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

export default globalStyles