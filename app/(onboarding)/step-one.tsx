import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function StepOneScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Экран Онбординг 1</Text>
      <Button
        title="Перейти к Шагу 2"
        onPress={() => router.push("/step-two")}
      />
    </View>
  );
}
