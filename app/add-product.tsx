import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { router } from "expo-router";
import { db } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

export default function AddProductScreen() {
  const [idsanpham, setIdsanpham] = useState("");
  const [tensp, setTensp] = useState("");
  const [loaisp, setLoaisp] = useState("");
  const [gia, setGia] = useState("");
  const [hinhanh, setHinhanh] = useState("");

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

  const handleAddProduct = async () => {
    try {
      if (!idsanpham.trim() || !tensp.trim() || !loaisp.trim() || !gia.trim()) {
        Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
        return;
      }

      if (isNaN(Number(gia))) {
        Alert.alert("Thông báo", "Giá phải là số");
        return;
      }

      const productRef = doc(db, "products", idsanpham);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        Alert.alert("Lỗi", "ID sản phẩm đã tồn tại");
        return;
      }

      await setDoc(productRef, {
        idsanpham: idsanpham.trim(),
        tensp: tensp.trim(),
        loaisp: loaisp.trim(),
        gia: Number(gia),
        hinhanh: hinhanh || "",
      });

      Alert.alert("Thành công", "Đã thêm sản phẩm");
      setIdsanpham("");
      setTensp("");
      setLoaisp("");
      setGia("");
      setHinhanh("");
      router.back();
    } catch (error: any) {
      console.log("Loi them san pham:", error);
      Alert.alert("Lỗi", error?.message || "Không thêm được sản phẩm");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm sản phẩm</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>ID sản phẩm</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập ID sản phẩm"
          value={idsanpham}
          onChangeText={setIdsanpham}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Tên sản phẩm</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên sản phẩm"
          value={tensp}
          onChangeText={setTensp}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Loại sản phẩm</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập loại sản phẩm"
          value={loaisp}
          onChangeText={setLoaisp}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Giá sản phẩm</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập giá sản phẩm"
          value={gia}
          onChangeText={setGia}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Hình ảnh sản phẩm</Text>

        <TouchableOpacity style={styles.imagePickerBox} onPress={pickImage}>
          {hinhanh ? (
            <Image source={{ uri: hinhanh }} style={styles.image} />
          ) : (
            <View style={styles.placeholderContent}>
              <Ionicons name="camera-outline" size={30} color="#6b7280" />
              <Text style={styles.imagePickerTitle}>Chọn ảnh sản phẩm</Text>
              <Text style={styles.imagePickerSubText}>
                Nhấn để thêm hình ảnh
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleAddProduct}>
        <Text style={styles.saveBtnText}>Lưu sản phẩm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },

  fieldGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#fff",
  },

  pickBtn: {
    backgroundColor: "#8e44ad",
    padding: 12,
    borderRadius: 10,
  },

  pickBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },

  saveBtn: {
    backgroundColor: "#27ae60",
    padding: 14,
    borderRadius: 10,
    marginTop: 6,
  },

  saveBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
  },

  cameraIcon: {
    fontSize: 28,
    marginBottom: 8,
  },

  imagePickerBox: {
    width: 170,
    height: 170,
    alignSelf: "center",
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  placeholderContent: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  imagePickerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
    marginTop: 8,
    textAlign: "center",
  },

  imagePickerSubText: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
