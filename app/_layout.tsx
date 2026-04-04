import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="add-product"
        options={{
          headerShown: true,
          title: "Thêm sản phẩm",
        }}
      />
      <Stack.Screen
        name="edit-product"
        options={{
          headerShown: true,
          title: "Sửa sản phẩm",
        }}
      />
    </Stack>
  );
}
