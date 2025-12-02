import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from "react-native";
import api from "../../services/api";

export default function CreateComandaScreen({ navigation }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const createComanda = async () => {
    if (!name.trim()) return Alert.alert("Erro", "Informe o nome da comanda");
    try {
      setLoading(true);
      await api.post("/comandas/", { name });
      setName("");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível criar comanda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome da Comanda"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Button title="Criar" onPress={createComanda} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
});
