import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";

export default function ComandasScreen({ navigation }) {
  const [comandas, setComandas] = useState([]);

  const fetchComandas = async () => {
    try {
      const res = await api.get("/comandas");
      setComandas(res.data);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível buscar comandas");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchComandas);
    fetchComandas();
    return unsubscribe;
  }, [navigation]);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("SignInScreen");
  };

  return (
    <View style={styles.container}>
  <TouchableOpacity
    style={styles.newButton}
    onPress={() => navigation.navigate("CreateComanda")}
  >
    <Text style={styles.newButtonText}>Nova Comanda</Text>
  </TouchableOpacity>

  <FlatList
    data={comandas}
    keyExtractor={(item) => item._id}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate("ComandaDetalhes", {
            comandaId: item._id,
            comandaName: item.name,
          })
        }
      >
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </TouchableOpacity>
    )}
    ListEmptyComponent={<Text>Nenhuma comanda</Text>}
  />
</View>
);

}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, paddingTop: 40 },

  newButton: {
    backgroundColor: "#11c211ff",
    width: 200,
    height: 45,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
  },
  newButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  item: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
  },

  name: { fontSize: 16, fontWeight: "bold" },
  date: { fontSize: 12, color: "#666", marginTop: 6 },
});

