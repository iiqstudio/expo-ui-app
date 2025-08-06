import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Feather } from "@expo/vector-icons";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";

const moods = [
  { id: "calm", label: "Calm" },
  { id: "happy", label: "Happy" },
  { id: "meh", label: "Meh" },
  { id: "anxious", label: "Anxious" },
  { id: "sad", label: "Sad" },
];

const MoodSelector = ({ selectedValue, onSelect }: any) => {
  return (
    <Box className="bg-neutral-100 p-4 rounded-md w-full">
      <HStack space="sm" className="justify-between">
        {moods.map((mood) => {
          const isSelected = mood.id === selectedValue;
          return (
            <Box className="flex items-center">
              <TouchableOpacity
                key={mood.id}
                onPress={() => onSelect(mood.id)}
                className={`flex items-center justify-center p-2 rounded-full ${
                  isSelected ? "bg-white shadow" : ""
                }`}
              >
                <Feather
                  name="smile"
                  size={24}
                  color={isSelected ? "black" : "gray"}
                />
              </TouchableOpacity>
              <Text
                className={`mt-1 text-xs ${
                  isSelected ? "text-black font-bold" : "text-neutral-500"
                }`}
              >
                {mood.label}
              </Text>
            </Box>
          );
        })}
      </HStack>
    </Box>
  );
};

export default function StepOneScreen() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState("happy");

  const handleContinue = () => {
    router.replace("/(onboarding)/step-two");
  };

  const handleNext = () => {
    if (selectedMood) {
      console.log("Выбранное настроение:", selectedMood);
      router.push("/(onboarding)/step-two");
    } else {
      alert("Пожалуйста, выберите ваше состояние");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Box className="flex-1 p-6">
        {/* progressbar */}
        <Box className="w-full h-1 bg-neutral-200 rounded-full mb-8">
          <View
            style={{ width: "25%" }}
            className="h-1 bg-neutral-800 rounded-full"
          />
        </Box>

        <Box className="flex-1 justify-center items-center">
          <Text className="text-2xl font-bold text-center mb-8">
            Rate how difficult it is for you to relax
          </Text>
          <MoodSelector
            selectedValue={selectedMood}
            onSelect={setSelectedMood}
          />
        </Box>

        <Box className="flex-row justify-end items-center">
          <TouchableOpacity
            onPress={handleNext}
            className="flex-row items-center p-2"
          >
            <Button
              size="md"
              variant="link"
              action="primary"
              onPress={handleContinue}
            >
              <ButtonText>Next</ButtonText>
            </Button>
            <Feather
              name="arrow-right"
              size={22}
              color="black"
              className="ml-2"
            />
          </TouchableOpacity>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
