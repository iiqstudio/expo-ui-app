// components/custom/Payment.tsx

import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";

// Импортируем только то, что нужно: хук и типы
import { useIAP, type Purchase, type IAPItem } from "expo-iap";

const productIds = ["holy_app_test_v1"];

export default function PaymentTest() {
  // Используем хук ТОЧНО КАК В ДОКУМЕНТАЦИИ
  const {
    connected,
    products,
    requestProducts, // <-- Получаем функцию из хука
    requestPurchase, // <-- И эту тоже
  } = useIAP({
    // Передаем обработчики событий ВНУТРЬ хука
    onPurchaseSuccess: (purchase: Purchase) => {
      console.log("Purchase successful:", purchase);
      Alert.alert("Успех!", `Вы приобрели ${purchase.productId}`);
      // Здесь нужно вызвать finishTransactionAsync, но давайте сначала добьемся показа продуктов
    },
    onPurchaseError: (error: any) => {
      console.error("Purchase failed:", error);
      // Не показываем Alert, если пользователь просто нажал "Отмена"
      if (error.code !== "E_USER_CANCELLED") {
        Alert.alert("Ошибка покупки", error.message);
      }
    },
  });

  // Используем функцию из хука, когда connected === true
  useEffect(() => {
    if (connected) {
      console.log("Подключено! Запрашиваю продукты...");
      requestProducts({ skus: productIds }); // Для iOS достаточно `skus`
    }
  }, [connected]);

  // UI для отображения
  if (!connected) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text style={styles.statusText}>Подключение к App Store...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>GI IAP!</Text>

      {products.length === 0 ? (
        <Text style={styles.statusText}>Продукты не найдены.</Text>
      ) : (
        products.map((product: IAPItem) => (
          <TouchableOpacity
            key={product.productId}
            style={styles.button}
            // Используем функцию из хука при нажатии
            onPress={() => requestPurchase({ sku: product.productId })}
          >
            <Text style={styles.buttonText}>
              {product.title} - {product.price}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statusText: {
    color: "gray",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
