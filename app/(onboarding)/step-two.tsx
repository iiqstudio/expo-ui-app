import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

// Компоненты из твоей UI-библиотеки (gluestack-ui)
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon"; // или lucide-react-native

// --- Данные для нашего списка ---
const symptoms = [
  { id: "insomnia", label: "Insomnia" },
  { id: "apetite_changes", label: "Apetite changes" },
  { id: "depression", label: "Depression" },
  { id: "low_energy", label: "Low energy" },
  { id: "anxiety", label: "Anxiety" },
  { id: "mood_changes", label: "Mood changes" },
  { id: "emotional_burnout", label: "Emotional burnout" },
];

// --- Основной компонент экрана ---
export default function StepTwoScreen() {
  const router = useRouter();

  // 1. Управление состоянием: храним массив ID выбранных симптомов
  const [selectedSymptoms, setSelectedSymptoms] = useState([
    "insomnia",
    "low_energy",
  ]);

  // Функция для добавления/удаления симптома из массива
  const handleToggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((currentSymptoms) => {
      if (currentSymptoms.includes(symptomId)) {
        // Если уже есть - убираем (фильтруем)
        return currentSymptoms.filter((id) => id !== symptomId);
      } else {
        // Если нет - добавляем
        return [...currentSymptoms, symptomId];
      }
    });
  };

  const handleNext = () => {
    console.log("Выбранные симптомы:", selectedSymptoms);
    // Здесь можно будет сохранить их в контекст
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

        {/* 2. Используем VStack для списка чекбоксов */}
        <VStack space="md" className="flex-1">
          {symptoms.map((symptom) => {
            const isChecked = selectedSymptoms.includes(symptom.id);

            return (
              // 3. Используем компонент Checkbox
              <Checkbox
                key={symptom.id}
                value={symptom.id}
                isChecked={isChecked}
                onChange={() => handleToggleSymptom(symptom.id)}
                // Стилизуем сам контейнер Checkbox в зависимости от состояния
                className={`
                  p-4 rounded-lg border flex-row items-center w-full justify-between
                  ${
                    isChecked
                      ? "bg-black border-black"
                      : "bg-white border-neutral-300"
                  }
                `}
              >
                {/* Лейбл слева. Его цвет тоже зависит от состояния */}
                <CheckboxLabel
                  className={isChecked ? "text-white" : "text-black"}
                >
                  {symptom.label}
                </CheckboxLabel>

                {/* Индикатор (квадратик) справа */}
                <CheckboxIndicator>
                  <CheckboxIcon
                    as={CheckIcon}
                    className={isChecked ? "text-white" : "text-black"}
                  />
                </CheckboxIndicator>
              </Checkbox>
            );
          })}
        </VStack>

        {/* Кнопка "Next" */}
        <Box className="flex-row justify-end items-center">
          <Button
            size="md"
            variant="link"
            action="primary"
            onPress={handleNext}
          >
            <ButtonText>Next</ButtonText>
            <Feather name="arrow-right" size={22} color="#3b82f6" />
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
