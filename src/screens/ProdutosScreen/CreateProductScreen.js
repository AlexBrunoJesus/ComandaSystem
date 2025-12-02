import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import api from "../../services/api";

export default function CreateProductScreen({ navigation }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleCreate = async () => {
    if (!name || !price) {
      return Alert.alert("Erro", "Preencha todos os campos.");
    }

    try {
      await api.post("/products", { name, price: parseFloat(price) });
      Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível cadastrar o produto.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do Produto</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Coca-Cola"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Preço</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 5.00"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
      />

      <Button title="Cadastrar" onPress={handleCreate} color="#4169e1" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40, backgroundColor: "#f9f9f9" },
  label: { fontSize: 16, marginBottom: 5, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
});
