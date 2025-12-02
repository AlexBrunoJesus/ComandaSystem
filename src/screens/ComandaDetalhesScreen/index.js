import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  Alert,
} from "react-native";
import api from "../../services/api";

export default function ComandaDetalhesScreen({ route, navigation }) {
  const { comandaId } = route.params;
  const [comanda, setComanda] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchComanda = async () => {
    try {
      const res = await api.get(`/comandas/${comandaId}`);
      setComanda(res.data);
      navigation.setOptions({ title: res.data.name });
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível carregar a comanda.");
    }
  };

  const fetchProdutos = async () => {
    try {
      const res = await api.get("/products");
      setProdutos(res.data);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível buscar produtos.");
    }
  };

  const adicionarProduto = async (produtoId) => {
  try {
    await api.post(`/comandas/${comandaId}/produtos`, {  // ⚠️ a rota é /produtos
      produtoId,  // agora bate com o backend
      quantidade: 1,
    });
    setShowModal(false);
    fetchComanda();
  } catch (err) {
    console.error(err);  // 🔹 opcional para ver o erro real no console
    Alert.alert("Erro", "Não foi possível adicionar produto.");
  }
};


  useEffect(() => {
    fetchComanda();
    fetchProdutos();
  }, [comandaId]);

  if (!comanda) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4169e1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{comanda.name}</Text>
      <Text style={styles.subtitle}>
        Criada em: {new Date(comanda.createdAt).toLocaleString()}
      </Text>

      <Text style={styles.sectionTitle}>Produtos:</Text>
      <FlatList
        data={comanda.produtos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.produtoItem}>
            <Text>{item.nome}</Text>
            <Text>
              {item.quantidade}x R$ {item.preco.toFixed(2)} = R${" "}
              {item.subtotal.toFixed(2)}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum produto nesta comanda</Text>}
      />

      <Text style={styles.total}>Total: R$ {comanda.total.toFixed(2)}</Text>

      <TouchableOpacity
        style={styles.btnAdd}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.btnAddText}>+ Adicionar Produto</Text>
      </TouchableOpacity>

      {/* Modal para escolher produto */}
      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Escolha um produto</Text>
          <FlatList
            data={produtos}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.produtoBtn}
                onPress={() => adicionarProduto(item._id)}
              >
                <Text style={styles.produtoNome}>{item.name}</Text>
                <Text>R$ {item.price.toFixed(2)}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Fechar" onPress={() => setShowModal(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#555", marginBottom: 10 },
  sectionTitle: { marginTop: 15, fontWeight: "bold", fontSize: 16 },
  produtoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  total: { fontWeight: "bold", fontSize: 18, marginTop: 15 },
  btnAdd: {
    backgroundColor: "#4169e1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  btnAddText: { color: "#fff", fontWeight: "bold" },
  modalContainer: { flex: 1, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  produtoBtn: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  produtoNome: { fontSize: 16 },
});
