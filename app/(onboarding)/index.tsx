import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Logo</Text>
      <Button title="Start now" onPress={() => router.push("/step-one")} />
    </View>
  );
}
