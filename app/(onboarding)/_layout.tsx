import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sigin" />
      <Stack.Screen name="step-one" />
      <Stack.Screen name="step-two" />
      <Stack.Screen name="value-prop" />
    </Stack>
  );
}
