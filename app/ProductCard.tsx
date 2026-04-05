import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../types/product";

type Props = {
  item: Product;
  onEdit: () => void;
  onDelete: () => void;
};

const COLORS = {
  card: "#ffffff",
  border: "#ececec",
  text: "#111827",
  subText: "#6b7280",
  price: "#111827",
  editBg: "#f8fafc",
  deleteBg: "#fef2f2",
  deleteText: "#dc2626",
};

export default function ProductCard({ item, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            item.hinhanh?.trim() ||
            "https://via.placeholder.com/300x300.png?text=No+Image",
        }}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.name} numberOfLines={2}>
        {item.tensp}
      </Text>

      <Text style={styles.category} numberOfLines={1}>
        {item.loaisp}
      </Text>

      <Text style={styles.price}>{item.gia.toLocaleString("vi-VN")} đ</Text>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
          <Ionicons name="create-outline" size={14} color="#111827" />
          <Text style={styles.editText}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Ionicons name="trash-outline" size={14} color={COLORS.deleteText} />
          <Text style={styles.deleteText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
  },

  image: {
    width: "100%",
    height: 145,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
    marginBottom: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    lineHeight: 22,
    minHeight: 44,
  },

  category: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.subText,
  },

  price: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.price,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    gap: 8,
  },

  editBtn: {
    flex: 1,
    backgroundColor: COLORS.editBg,
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },

  deleteBtn: {
    flex: 1,
    backgroundColor: COLORS.deleteBg,
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },

  editText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  deleteText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.deleteText,
  },
});
