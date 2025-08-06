import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import SymptomCheckbox from "@/components/custom/SymptomCheckbox";

const symptoms = [
  { id: "insomnia", label: "Insomnia" },
  { id: "apetite_changes", label: "Apetite changes" },
  { id: "depression", label: "Depression" },
  { id: "low_energy", label: "Low energy" },
  { id: "anxiety", label: "Anxiety" },
  { id: "mood_changes", label: "Mood changes" },
  { id: "emotional_burnout", label: "Emotional burnout" },
];

export default function StepTwoScreen() {
  const router = useRouter();

  const [selectedSymptoms, setSelectedSymptoms] = useState(["", ""]);

  const handleToggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((currentSymptoms) => {
      if (currentSymptoms.includes(symptomId)) {
        return currentSymptoms.filter((id) => id !== symptomId);
      } else {
        return [...currentSymptoms, symptomId];
      }
    });
  };

  const handleNext = () => {
    console.log("Выбранные симптомы:", selectedSymptoms);
    router.push("/(onboarding)/value-prop");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Box className="flex-1 p-6">
        {/* Прогресс-бар (шаг 2 из 4) */}
        <Box className="w-full h-1 bg-neutral-200 rounded-full mb-8">
          <View
            style={{ width: "50%" }}
            className="h-1 bg-neutral-800 rounded-full"
          />
        </Box>

        <Text className="text-2xl font-bold text-center mb-8">
          Do you experience any of following symptoms during your period?
        </Text>

        <VStack space="md" className="flex-1">
          {symptoms.map((symptom) => (
            <SymptomCheckbox
              key={symptom.id}
              label={symptom.label}
              isChecked={selectedSymptoms.includes(symptom.id)}
              onPress={() => handleToggleSymptom(symptom.id)}
            />
          ))}
        </VStack>

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
