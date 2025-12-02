import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, TouchableOpacity, Alert, StyleSheet } from "react-native";
import api from "../../services/api";
import CreateProductScreen from "./CreateProductScreen";

export default function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchProducts);
    fetchProducts();
    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (id) => {
    Alert.alert("Excluir produto", "Tem certeza que deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/products/${id}`);
            fetchProducts(); // atualiza a lista
          } catch {
            Alert.alert("Erro", "Não foi possível excluir o produto.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerButtons}>
        <Button title="Novo Produto" onPress={() => navigation.navigate("CreateProduct")} />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>R$ {item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item._id)}>
              <Text style={styles.delete}>🗑️</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Nenhum produto cadastrado</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40, backgroundColor: "#f9f9f9" },
  headerButtons: { marginBottom: 10, alignItems: "flex-end" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: "bold" },
  delete: { color: "#d9534f", fontSize: 20 },
});
