import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  RefreshControl,
  Pressable,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

import { db } from "../../firebaseConfig";
import { Product } from "../../types/product";
import ProductCard from "../ProductCard";

const COLORS = {
  primary: "#2563eb",
  success: "#16a34a",
  background: "#f3f4f6",
  card: "#ffffff",
  text: "#111827",
  subText: "#6b7280",
  border: "#e5e7eb",
};

type SortType = "default" | "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc";

export default function ListProductTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [sortType, setSortType] = useState<SortType>("default");
  const [refreshing, setRefreshing] = useState(false);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const data: Product[] = querySnapshot.docs.map(
        (item) => item.data() as Product,
      );
      setProducts(data);
    } catch (error) {
      Alert.alert("Lỗi", "Không tải được danh sách sản phẩm");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };
  // Handle delete product
  const handleDelete = (idsanpham: string) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa sản phẩm này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "products", idsanpham));
            Alert.alert("Thành công", "Xóa sản phẩm thành công");
            fetchProducts();
          } catch (error) {
            Alert.alert("Lỗi", "Xóa sản phẩm thất bại");
          }
        },
      },
    ]);
  };

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((item) => item.loaisp)),
    );
    return ["Tất cả", ...uniqueCategories];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let data = [...products];
    // Filter by search
    if (search.trim()) {
      data = data.filter((item) =>
        item.tensp.toLowerCase().includes(search.toLowerCase()),
      );
    }
    // Filter by category
    if (selectedCategory !== "Tất cả") {
      data = data.filter((item) => item.loaisp === selectedCategory);
    }
    // Sort products
    switch (sortType) {
      case "priceAsc":
        data.sort((a, b) => a.gia - b.gia);
        break;
      case "priceDesc":
        data.sort((a, b) => b.gia - a.gia);
        break;
      case "nameAsc":
        data.sort((a, b) => a.tensp.localeCompare(b.tensp));
        break;
      case "nameDesc":
        data.sort((a, b) => b.tensp.localeCompare(a.tensp));
        break;
    }

    return data;
  }, [products, search, selectedCategory, sortType]);

  const sortOptions: { label: string; value: SortType }[] = [
    { label: "Mặc định", value: "default" },
    { label: "Giá tăng", value: "priceAsc" },
    { label: "Giá giảm", value: "priceDesc" },
    { label: "Tên A-Z", value: "nameAsc" },
    { label: "Tên Z-A", value: "nameDesc" },
  ];

  const selectedSortLabel =
    sortOptions.find((item) => item.value === sortType)?.label || "Mặc định";

  const closeAllDropdowns = () => {
    setShowCategoryDropdown(false);
    setShowSortDropdown(false);
  };

  return (
    <View style={styles.container}>
      {(showCategoryDropdown || showSortDropdown) && (
        <Pressable style={styles.backdrop} onPress={closeAllDropdowns} />
      )}

      <View style={styles.fixedTop}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>List Product</Text>
        </View>

        <View style={styles.topBar}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color={COLORS.subText} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm theo tên sản phẩm..."
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push("/add-product")}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterSortRow}>
          <View style={[styles.controlWrapper, { zIndex: 30 }]}>
            <TouchableOpacity
              style={styles.compactControl}
              activeOpacity={0.8}
              onPress={() => {
                setShowCategoryDropdown((prev) => !prev);
                setShowSortDropdown(false);
              }}
            >
              <Text style={styles.compactLabel}>Loại</Text>
              <View style={styles.compactValueRow}>
                <Text style={styles.compactValue} numberOfLines={1}>
                  {selectedCategory}
                </Text>
                <Ionicons
                  name={showCategoryDropdown ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={COLORS.subText}
                />
              </View>
            </TouchableOpacity>

            {showCategoryDropdown && (
              <View style={styles.dropdownOverlay}>
                {categories.map((category, index) => {
                  const isActive = selectedCategory === category;
                  const isLast = index === categories.length - 1;

                  return (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.dropdownItem,
                        isActive && styles.activeDropdownItem,
                        !isLast && styles.dropdownItemBorder,
                      ]}
                      onPress={() => {
                        setSelectedCategory(category);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          isActive && styles.activeDropdownItemText,
                        ]}
                      >
                        {category}
                      </Text>
                      {isActive && (
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          <View style={[styles.controlWrapper, { zIndex: 20 }]}>
            <TouchableOpacity
              style={styles.compactControl}
              activeOpacity={0.8}
              onPress={() => {
                setShowSortDropdown((prev) => !prev);
                setShowCategoryDropdown(false);
              }}
            >
              <Text style={styles.compactLabel}>Sắp xếp</Text>
              <View style={styles.compactValueRow}>
                <Text style={styles.compactValue} numberOfLines={1}>
                  {selectedSortLabel}
                </Text>
                <Ionicons
                  name={showSortDropdown ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={COLORS.subText}
                />
              </View>
            </TouchableOpacity>

            {showSortDropdown && (
              <View style={styles.dropdownOverlay}>
                {sortOptions.map((option, index) => {
                  const isActive = sortType === option.value;
                  const isLast = index === sortOptions.length - 1;

                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownItem,
                        isActive && styles.activeDropdownItem,
                        !isLast && styles.dropdownItemBorder,
                      ]}
                      onPress={() => {
                        setSortType(option.value);
                        setShowSortDropdown(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          isActive && styles.activeDropdownItemText,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {isActive && (
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </View>

      <FlatList
        data={filteredAndSortedProducts}
        keyExtractor={(item) => item.idsanpham}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onEdit={() =>
              router.push({
                pathname: "/edit-product",
                params: { oldId: item.idsanpham },
              })
            }
            onDelete={() => handleDelete(item.idsanpham)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons
              name="file-tray-outline"
              size={48}
              color={COLORS.subText}
            />
            <Text style={styles.emptyTitle}>Không có sản phẩm phù hợp</Text>
            <Text style={styles.emptyText}>
              Hãy thử thay đổi từ khóa tìm kiếm, bộ lọc hoặc thêm sản phẩm mới.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  fixedTop: {
    paddingHorizontal: 16,
    paddingTop: 34,
    paddingBottom: 12,
    backgroundColor: COLORS.background,
    zIndex: 10,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 120,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 14,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 5,
  },

  header: {
    marginTop: 25,
    marginBottom: 18,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2563eb",
    textAlign: "center",
    letterSpacing: 0.4,
  },
  topBar: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  searchBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.text,
    fontSize: 15,
  },

  addBtn: {
    width: 54,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.success,
    borderRadius: 16,
  },

  filterSortRow: {
    flexDirection: "row",
    gap: 10,
  },

  controlWrapper: {
    flex: 1,
    position: "relative",
  },

  compactControl: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 58,
    justifyContent: "center",
  },

  compactLabel: {
    fontSize: 12,
    color: COLORS.subText,
    marginBottom: 4,
  },

  compactValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  compactValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },

  dropdownOverlay: {
    position: "absolute",
    top: 66,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    zIndex: 999,
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },

  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  activeDropdownItem: {
    backgroundColor: COLORS.primary,
  },

  dropdownItemText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },

  activeDropdownItemText: {
    color: "#fff",
    fontWeight: "600",
  },

  emptyBox: {
    marginTop: 50,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 12,
  },

  emptyText: {
    fontSize: 14,
    color: COLORS.subText,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});
