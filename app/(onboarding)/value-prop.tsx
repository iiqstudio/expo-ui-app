import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";

const handleFinish = () => {
  console.log("Переход в основное приложение!");
};

export default function ValuePropScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.replace("/tabs/profile");
  };

  const mockData = {
    symptoms: ["Insomnia", "Low Energy"],
    mood: "Happy",
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Box className="flex-1 p-6">
        <Box className="w-full h-1 bg-neutral-200 rounded-full mb-8">
          <View
            style={{ width: "75%" }}
            className="h-1 bg-neutral-800 rounded-full"
          />
        </Box>

        <Box className="flex-1 justify-center items-center">
          <Text className="text-2xl font-bold text-center mb-6">
            Screen with description of techniques and benefits in such states as
            defined by the user
          </Text>

          <Box className="h-24 w-24 bg-red-500 rounded-full items-center justify-center my-8 shadow-lg">
            <Text className="text-white text-4xl font-bold">A</Text>
          </Box>

          <Text className="text-base text-center text-neutral-500">
            You have:{" "}
            <Text className="font-bold">{mockData.symptoms.join(", ")}</Text>.
          </Text>
        </Box>

        {/* 3. Кнопка "Next" */}
        <Box className="flex-row justify-end items-center">
          <Button
            size="md"
            variant="link"
            action="primary"
            onPress={handleNext}
          >
            <ButtonText>Next</ButtonText>
            <Feather name="arrow-right" size={22} color="black" />
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
