import { Text, View, StyleSheet } from "react-native";
import { globalStyles } from "../styles/global";
import Header from "../components/Header/Header";

export default function Form() {
  return (
    <View
      style={globalStyles.container}
    >
      <Header showIndexContent={false} showTabsContent={true} TabTittle="Editar Categorias"/>
      <Text style={globalStyles.text}>Cadastre abaixo</Text>
    </View>
  );
}

const styles = StyleSheet.create ({

})
