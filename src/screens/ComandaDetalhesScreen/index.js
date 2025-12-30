import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  Alert,
  Button,
} from "react-native";
import api from "../../services/api";

export default function ComandaDetalhesScreen({ route, navigation }) {
  const { comandaId } = route.params;

  const [comanda, setComanda] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Menu lateral
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;

  const abrirMenu = () => {
    setIsMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const fecharMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -250,
      duration: 200,
      useNativeDriver: false,
    }).start(() => setIsMenuVisible(false));
  };

  const fetchComanda = async () => {
    try {
      const res = await api.get(`/comandas/${comandaId}`);
      setComanda(res.data);

      navigation.setOptions({
        title: res.data.name,
        headerRight: () => (
          <TouchableOpacity
            style={{
              backgroundColor: "#11c211ff",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              marginRight: 10,
            }}
            onPress={abrirMenu}
          >
            <Text style={{ color: "#fff", fontSize: 22 }}>☰</Text>
          </TouchableOpacity>
        ),
      });
    } catch (err) {
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

  const fecharConta = async () => {
    fecharMenu();

    Alert.alert(
      "Fechar Comanda",
      "Tem certeza que deseja fechar esta comanda?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Fechar",
          onPress: async () => {
            await api.put(`/comandas/${comandaId}/fechar`);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const adicionarProduto = async (produtoId) => {
    try {
      await api.post(`/comandas/${comandaId}/produtos`, {
        produtoId,
        quantidade: 1,
      });
      setShowModal(false);
      fetchComanda();
    } catch (err) {
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

      {/* OVERLAY */}
      {isMenuVisible && (
        <TouchableOpacity style={styles.overlay} onPress={fecharMenu} />
      )}

      {/* MENU LATERAL */}
      <Animated.View style={[styles.sideMenu, { left: slideAnim }]}>
        <Text style={styles.menuTitle}>Ações</Text>

        <TouchableOpacity style={styles.menuItem} onPress={fecharConta}>
          <Text style={styles.menuItemText}>Fechar Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={fecharMenu}>
          <Text style={[styles.menuItemText, { color: "#555" }]}>Cancelar</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* MODAL PRODUTOS */}
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

  sideMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#fff",
    padding: 20,
    elevation: 10,
    zIndex: 40,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 35,
  },

  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 25,
  },

  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  menuItemText: {
    fontSize: 18,
    color: "red",
  },

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
