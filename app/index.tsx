import React from "react";
import { Box } from "@/components/ui/box";
import { ScrollView } from "react-native";
import { Text } from "@/components/ui/text";

import { Link, useRouter } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import PaymentTest from "@/components/custom/Payment";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.replace("/(onboarding)/step-one");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box className="flex-1">
        <ScrollView
          className="flex-1 w-full"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box className="my-16 mx-5 lg:my-24 lg:mx-32">
            <Text className="text-3xl font-bold">LOGO</Text>
          </Box>
        </ScrollView>

        <Box>
          <Text className="text-center text-lg font-bold">Test purshase</Text>
          <PaymentTest />
        </Box>

        <Box className="p-4 w-full">
          <Button
            size="md"
            variant="solid"
            action="primary"
            onPress={handleStart}
          >
            <ButtonText>Start now</ButtonText>
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
