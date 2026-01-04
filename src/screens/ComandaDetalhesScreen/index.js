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

  // =========================
  // 🔄 API
  // =========================

  const fetchComanda = async () => {
    try {
      const res = await api.get(`/comandas/${comandaId}`);
      setComanda(res.data);

      navigation.setOptions({
        title: res.data.name,
        headerRight: () => (
          <TouchableOpacity
            style={styles.headerMenuBtn}
            onPress={abrirMenu}
          >
            <Text style={styles.headerMenuText}>☰</Text>
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

  const adicionarProduto = async (produtoId) => {
    try {
      await api.post(`/comandas/${comandaId}/produtos`, {
        produtoId,
        quantidade: 1,
      });
      setShowModal(false);
      fetchComanda();
    } catch {
      Alert.alert("Erro", "Não foi possível adicionar produto.");
    }
  };

  // =========================
  // 🍽️ TAXA DE SERVIÇO
  // =========================

  const atualizarTaxa = async (percentual) => {
    try {
      await api.put(`/comandas/${comandaId}/taxa`, {
        taxaServicoPercentual: percentual,
      });
      fetchComanda();
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar a taxa.");
    }
  };

  // =========================
  // ✅ FECHAR CONTA
  // =========================

  const fecharConta = () => {
    fecharMenu();
    Alert.alert(
      "Fechar Comanda",
      "Deseja fechar esta comanda?",
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

  useEffect(() => {
    fetchComanda();
    fetchProdutos();
  }, [comandaId]);

  if (!comanda) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#11c211ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* PRODUTOS */}
      <Text style={styles.sectionTitle}>Produtos</Text>
      <FlatList
        data={comanda.produtos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.produtoItem}>
            <Text>{item.nome}</Text>
            <Text>
              {item.quantidade}x R$ {item.preco.toFixed(2)} = R$ {item.subtotal.toFixed(2)}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum produto</Text>}
      />

      {/* TAXA DE SERVIÇO */}
      <Text style={styles.sectionTitle}>Taxa de Serviço</Text>

      <View style={styles.taxaContainer}>
        {[0, 5, 10].map((taxa) => (
          <TouchableOpacity
            key={taxa}
            style={[
              styles.taxaBtn,
              comanda.taxaServicoPercentual === taxa && styles.taxaBtnAtiva,
            ]}
            onPress={() => atualizarTaxa(taxa)}
          >
            <Text
              style={[
                styles.taxaText,
                comanda.taxaServicoPercentual === taxa && styles.taxaTextAtiva,
              ]}
            >
              {taxa}%
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TOTAIS */}
      <View style={styles.resumo}>
        <Text>Subtotal: R$ {comanda.total.toFixed(2)}</Text>
        <Text>Taxa: R$ {comanda.taxaServicoValor.toFixed(2)}</Text>
        <Text style={styles.totalFinal}>
          Total: R$ {comanda.totalFinal.toFixed(2)}
        </Text>
      </View>

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

      {/* MENU */}
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
                <Text>{item.name}</Text>
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

  headerMenuBtn: {
    backgroundColor: "#11c211ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10,
  },
  headerMenuText: { color: "#fff", fontSize: 22 },

  subtitle: { fontSize: 14, color: "#555" },
  sectionTitle: { marginTop: 15, fontWeight: "bold", fontSize: 22 },

  produtoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 6,
  },

  taxaContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    alignSelf: "center",
  },
  taxaBtn: {
    borderWidth: 1,
    borderColor: "#11c211ff",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  taxaBtnAtiva: {
    backgroundColor: "#11c211ff",
  },
  taxaText: { color: "#11c211ff", fontWeight: "bold" },
  taxaTextAtiva: { color: "#fff" },

  resumo: { marginTop: 15 },
  totalFinal: { fontSize: 18, fontWeight: "bold", marginTop: 5 },

  btnAdd: {
    backgroundColor: "#11c211ff",
    width: 200,
    height: 45,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 60,
    marginTop: 30,
  },
  btnAddText: { color: "#fff", fontWeight: "bold" },

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
  menuTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 25 },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  menuItemText: { fontSize: 18, color: "red" },

  modalContainer: { flex: 1, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  produtoBtn: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
