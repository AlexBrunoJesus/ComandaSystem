import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const OPCOES = [0, 5, 10];

export default function TaxaServicoSelector({
  taxaAtual,
  onSelect,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Taxa de serviço</Text>

      <View style={styles.options}>
        {OPCOES.map((taxa) => {
          const ativo = taxa === taxaAtual;

          return (
            <TouchableOpacity
              key={taxa}
              style={[
                styles.option,
                ativo && styles.optionActive,
              ]}
              onPress={() => onSelect(taxa)}
            >
              <Text
                style={[
                  styles.optionText,
                  ativo && styles.optionTextActive,
                ]}
              >
                {taxa}%
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  options: {
    flexDirection: "row",
    gap: 10,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionActive: {
    backgroundColor: "#2ecc71",
    borderColor: "#2ecc71",
  },
  optionText: {
    fontSize: 15,
    color: "#555",
    fontWeight: "bold",
  },
  optionTextActive: {
    color: "#fff",
  },
});
