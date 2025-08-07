import { useIAP } from "expo-iap";
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

const productIds = ["holy_app_test_v1"];

export default function PaymentTest() {
  const {
    connected,
    products,
    requestProducts,
    requestPurchase,
    validateReceipt,
  } = useIAP({
    onPurchaseSuccess: (purchase) => {
      console.log("Purchase successful:", purchase);
      // Handle successful purchase
      validatePurchase(purchase);
    },
    onPurchaseError: (error) => {
      console.error("Purchase failed:", error);
      // Handle purchase error
    },
  });

  React.useEffect(() => {
    if (connected) {
      requestProducts({ skus: productIds, type: "inapp" });
    }
  }, [connected]);

  const validatePurchase = async (purchase: any) => {
    try {
      const result = await validateReceipt(purchase.transactionId);
      if (result.isValid) {
        // Grant user the purchased content
        console.log("Receipt is valid");
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <View>
      <Text>GI IAP!</Text>
      {products.map((product) => (
        <TouchableOpacity
          key={product.id}
          onPress={() => requestPurchase({ request: { sku: product.id } })}
        >
          <Text>
            {product.title} - {product.displayPrice}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
