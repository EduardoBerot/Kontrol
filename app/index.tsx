import { Text, View, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function Index() {
  type InfoBoxProps = {
    label: string;
    value: string;
    color?: string;
  };

  type HeaderProps = {
    profileimg: string;
    month: string;
  };

  const InfoBox = ({ label, value, color }: InfoBoxProps) => (
    <View style={styles.contentboxinfo}>
      <Text style={styles.mintext}>{label}</Text>
      <Text style={[styles.mintitle, { color }]}>{value}</Text>
    </View>
  );

  const Header = ({ profileimg, month }: HeaderProps) => (
    <View style={[styles.header, styles.row]}>
      <Text style={{ textAlign: "center" }}>
        <Icon name="person" size={30} />
      </Text>
      <Text style={[{ textAlign: "center"}, styles.title]}>
        {month}
        <Icon name="arrow-drop-down" size={25}/>
      </Text>
      <Text style={{ textAlign: "center" }}>
        <Icon name="menu" size={30} />
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header profileimg="Img" month="Janeiro" />
      <View style={[styles.content, styles.row]}>
        <View style={styles.contentbox}>
          <Text style={styles.text}>Saldo total</Text>
          <Text style={styles.title}>R$ 8.900,87</Text>
          <View style={[styles.contentboxinfo, styles.row]}>
            <InfoBox label="Receitas" value="R$ 4.500" color="green" />
            <InfoBox label="Despesas" value="R$ -4.500" color="red" />
          </View>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  row: {
    flexDirection: "row"
  },

  container: {
    flex: 1,
    backgroundColor: "#efefefff"
  },

  header: {
    flex: 0.17,
    backgroundColor: "rgba(37, 97, 236, 1)",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
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

  content: {
    flex: 0.8,
    justifyContent: "center"
  },

  contentbox: {
    flex: 0.8,
    backgroundColor: "#fff",
    borderRadius: 20,
    height: 148,
    top: -48,
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 10,
  },

  contentboxinfo: {
    flex: 1,
    alignItems: "center",
  }
})
