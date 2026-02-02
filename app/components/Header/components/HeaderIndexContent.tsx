import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Modal, Text, StyleSheet, Pressable, View, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";



// Tipagem
type Transaction = {
  date: string;
};

type Props = {
  month: number;
  year: number;
  onChangePeriod: (month: number, year: number) => void;
  transactionsVersion: number;
};


// Lista os mêses do ano
const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const HeaderIndexContent = ({ month, year, transactionsVersion, onChangePeriod }: Props) => {

  // Hooks
  const [visible, setVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [availableMonths, setAvailableMonths] = useState<number[]>([]);

  // Atualiza estado quando mudar pelo Index
  useEffect(() => {
    setSelectedMonth(month);
    setSelectedYear(year);
  }, [month, year]);


  // Carrega meses que possuem lançamentos no ano selecionado
  const loadAvailableMonths = async (selectedYear: number) => {
    try {
      const data = await AsyncStorage.getItem("transactions");
      if (!data) {
        setAvailableMonths([]);
        return;
      }
      const transactions: Transaction[] = JSON.parse(data);
      const monthsWithData = transactions
        .filter(item => {
          const date = new Date(item.date);
          return date.getFullYear() === selectedYear;
        })
        .map(item => new Date(item.date).getMonth());
      const uniqueMonths = Array.from(new Set(monthsWithData)).sort((a, b) => a - b);
      setAvailableMonths(uniqueMonths);
    } catch (err) {
      console.log("Erro ao carregar meses disponíveis", err);
      setAvailableMonths([]);
    }
  };


  // Sempre que abrir o modal ou trocar o ano, recarrega os meses válidos
  useEffect(() => {
    if (visible) {
      loadAvailableMonths(selectedYear);
    }
  }, [visible, selectedYear, transactionsVersion]);


  const onSelectMonth = (index: number) => {
    setSelectedMonth(index);
    onChangePeriod(index, selectedYear); 
    setVisible(false);
  };

  const changeYear = (value: number) => {
    const newYear = selectedYear + value;
    setSelectedYear(newYear);
    onChangePeriod(selectedMonth, newYear);
  };


  // Render
  return (
    <>
      <MaterialIcons name="person" size={30} color="#fff" />

      <Pressable
        onPress={() => setVisible(true)}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <Text style={{ color: "#fff", fontSize: 24 }}>
          {months[selectedMonth]} {selectedYear}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={25} color="#fff" />
      </Pressable>

      <Modal transparent visible={visible} animationType="fade">
        <Pressable onPress={() => setVisible(false)} style={styles.overlay}>
          <View style={styles.modal}>

            {/* Controle de ano */}
            <View style={styles.yearControl}>
              <Pressable onPress={() => changeYear(-1)}>
                <MaterialIcons name="chevron-left" size={28} />
              </Pressable>

              <Text style={styles.yearText}>{selectedYear}</Text>

              <Pressable onPress={() => changeYear(1)}>
                <MaterialIcons name="chevron-right" size={28} />
              </Pressable>
            </View>

            {/* 🔹 Meses disponíveis no ano */}
            <FlatList
              data={availableMonths.map(index => ({
                index,
                name: months[index]
              }))}
              numColumns={3}
              keyExtractor={(item) => String(item.index)}
              columnWrapperStyle={{ justifyContent: "flex-start", gap: 12 }}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onSelectMonth(item.index)}
                  style={[
                    styles.monthItem,
                    item.index === selectedMonth && styles.monthSelected
                  ]}
                >
                  <Text
                    style={[
                      styles.monthText,
                      item.index === selectedMonth && styles.monthTextSelected
                    ]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              )}
              ListEmptyComponent={
                <Text style={{ textAlign: "center", color: "#666" }}>
                  Nenhum lançamento neste ano
                </Text>
              }
            />

          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default HeaderIndexContent;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: 20,
  },
  yearControl: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  yearText: {
    fontSize: 20,
    fontWeight: "600",
  },
  monthItem: {
    width: "30%",          // largura fixa para formar 3 colunas reais
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center", // botão alinhado certinho
    justifyContent: "center",
  },

  monthText: {
    fontSize: 14,
    textAlign: "center",  // texto centralizado
  },


  monthSelected: {
    backgroundColor: "#2563eb",
  },
  monthTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
});
