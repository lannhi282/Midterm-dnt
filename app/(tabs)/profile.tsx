import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../firebaseConfig";

const COLORS = {
  primary: "#2563eb",
  danger: "#dc2626",
  background: "#f3f4f6",
  card: "#ffffff",
  text: "#111827",
  subText: "#6b7280",
  border: "#e5e7eb",
};

export default function ProfileTab() {
  const email = useMemo(() => auth.currentUser?.email || "admin@gmail.com", []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đăng xuất");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>

          <Text style={styles.name}>Administrator</Text>
          <Text style={styles.role}>Quản trị viên hệ thống</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>{email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.infoText}>Quyền: Admin</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  header: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.primary,
    textAlign: "center",
    letterSpacing: 0.4,
  },

  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },

  role: {
    marginTop: 6,
    color: COLORS.subText,
    fontSize: 14,
  },

  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.text,
  },

  logoutBtn: {
    marginTop: 24,
    backgroundColor: COLORS.danger,
    borderRadius: 16,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
