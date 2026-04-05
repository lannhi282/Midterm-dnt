import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  View,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, router } from "expo-router";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const COLORS = {
  primary: "#2563eb",
  success: "#16a34a",
  warning: "#f59e0b",
  danger: "#dc2626",
  background: "#f3f4f6",
  card: "#ffffff",
  text: "#111827",
  subText: "#6b7280",
  border: "#e5e7eb",
};

export default function EditProductScreen() {
  const params = useLocalSearchParams();
  const oldId = String(params.oldId || "");

  const [idsanpham, setIdsanpham] = useState("");
  const [tensp, setTensp] = useState("");
  const [loaisp, setLoaisp] = useState("");
  const [gia, setGia] = useState("");
  const [hinhanh, setHinhanh] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProduct = async () => {
    try {
      if (!oldId) {
        Alert.alert("Lỗi", "Không tìm thấy mã sản phẩm cũ");
        router.back();
        return;
      }

      const productRef = doc(db, "products", oldId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        Alert.alert("Lỗi", "Sản phẩm không tồn tại");
        router.back();
        return;
      }

      const data = productSnap.data();

      setIdsanpham(data.idsanpham || "");
      setTensp(data.tensp || "");
      setLoaisp(data.loaisp || "");
      setGia(String(data.gia || ""));
      setHinhanh(data.hinhanh || "");
    } catch (error: any) {
      Alert.alert("Lỗi", error?.message || "Không tải được dữ liệu sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Thông báo", "Bạn cần cấp quyền truy cập thư viện ảnh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 0.3,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const base64Image = asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : "";
      setHinhanh(base64Image);
    }
  };
  // Update
  const handleUpdate = async () => {
    try {
      const newId = idsanpham.trim();

      if (!newId || !tensp.trim() || !loaisp.trim() || !gia.trim()) {
        Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
        return;
      }

      if (isNaN(Number(gia))) {
        Alert.alert("Thông báo", "Giá phải là số");
        return;
      }

      setSaving(true);

      const oldRef = doc(db, "products", oldId);
      const newRef = doc(db, "products", newId);

      // Nếu đổi ID
      if (newId !== oldId) {
        const newSnap = await getDoc(newRef);

        if (newSnap.exists()) {
          Alert.alert("Lỗi", "Mã sản phẩm mới đã tồn tại");
          setSaving(false);
          return;
        }

        await setDoc(newRef, {
          idsanpham: newId,
          tensp: tensp.trim(),
          loaisp: loaisp.trim(),
          gia: Number(gia),
          hinhanh: hinhanh || "",
        });

        await deleteDoc(oldRef);
      } else {
        await setDoc(newRef, {
          idsanpham: newId,
          tensp: tensp.trim(),
          loaisp: loaisp.trim(),
          gia: Number(gia),
          hinhanh: hinhanh || "",
        });
      }

      Alert.alert("Thành công", "Đã cập nhật sản phẩm");
      router.back();
    } catch (error: any) {
      console.log("Lỗi cập nhật:", error);
      Alert.alert("Lỗi", error?.message || "Cập nhật sản phẩm thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải dữ liệu sản phẩm...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sửa sản phẩm</Text>
        <Text style={styles.subTitle}>
          Bạn có thể chỉnh sửa toàn bộ thông tin sản phẩm
        </Text>

        <Text style={styles.label}>Mã sản phẩm</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập mã sản phẩm"
          value={idsanpham}
          onChangeText={setIdsanpham}
        />

        <Text style={styles.label}>Tên sản phẩm</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên sản phẩm"
          value={tensp}
          onChangeText={setTensp}
        />

        <Text style={styles.label}>Loại sản phẩm</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập loại sản phẩm"
          value={loaisp}
          onChangeText={setLoaisp}
        />

        <Text style={styles.label}>Giá sản phẩm</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập giá"
          value={gia}
          onChangeText={setGia}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
          <Text style={styles.pickBtnText}>Chọn ảnh mới</Text>
        </TouchableOpacity>

        {hinhanh ? (
          <Image source={{ uri: hinhanh }} style={styles.image} />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageText}>Chưa có ảnh</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleUpdate}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>
            {saving ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },
  subTitle: {
    textAlign: "center",
    color: COLORS.subText,
    marginTop: 6,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    color: COLORS.text,
  },
  pickBtn: {
    backgroundColor: COLORS.warning,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  pickBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    resizeMode: "cover",
    marginBottom: 18,
  },
  noImage: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  noImageText: {
    color: COLORS.subText,
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: COLORS.success,
    paddingVertical: 15,
    borderRadius: 12,
  },
  saveBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.subText,
    fontSize: 15,
  },
});
