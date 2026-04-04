import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Product } from "../../types/product";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#2563eb",
  secondary: "#1d4ed8",
  success: "#16a34a",
  background: "#f3f4f6",
  card: "#ffffff",
  text: "#111827",
  subText: "#6b7280",
  border: "#e5e7eb",
  softBlue: "#dbeafe",
  softGreen: "#dcfce7",
};

export default function HomeTab() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const data: Product[] = querySnapshot.docs.map(
        (item) => item.data() as Product,
      );
      setProducts(data);
    } catch (error) {
      Alert.alert("Lỗi", "Không tải được dữ liệu thống kê");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, []),
  );

  const totalProducts = products.length;

  const totalCategories = useMemo(() => {
    return new Set(products.map((item) => item.loaisp)).size;
  }, [products]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerIcon}>
            <Ionicons name="grid-outline" size={30} color="#fff" />
          </View>

          <Text style={styles.title}>Dashboard</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: COLORS.card }]}>
          <View style={[styles.iconBox, { backgroundColor: COLORS.softBlue }]}>
            <Ionicons name="cube-outline" size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.statValue}>{totalProducts}</Text>
          <Text style={styles.statLabel}>Tổng sản phẩm</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: COLORS.card }]}>
          <View style={[styles.iconBox, { backgroundColor: COLORS.softGreen }]}>
            <Ionicons name="layers-outline" size={24} color={COLORS.success} />
          </View>
          <Text style={styles.statValue}>{totalCategories}</Text>
          <Text style={styles.statLabel}>Số thể loại</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Tổng quan hệ thống</Text>
        <Text style={styles.infoText}>
          Trang này giúp bạn theo dõi nhanh tình trạng dữ liệu sản phẩm. Bạn có
          thể chuyển sang mục List Product để tìm kiếm, lọc, sắp xếp và quản lý
          danh sách chi tiết.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Thao tác nhanh</Text>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => router.push("/(tabs)/list-product")}
      >
        <View style={[styles.actionIcon, { backgroundColor: COLORS.softBlue }]}>
          <Ionicons name="list-outline" size={22} color={COLORS.primary} />
        </View>
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>Danh sách sản phẩm</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={COLORS.subText} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => router.push("/add-product")}
      >
        <View
          style={[
            styles.actionIcon,
            { backgroundColor: "rgba(22,163,74,0.12)" },
          ]}
        >
          <Ionicons
            name="add-circle-outline"
            size={22}
            color={COLORS.success}
          />
        </View>
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>Thêm sản phẩm mới</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={COLORS.subText} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 26,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
    marginTop: 25,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.subText,
    marginTop: 6,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 18,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.subText,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  actionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  actionContent: {
    flex: 1,
    marginLeft: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
});
