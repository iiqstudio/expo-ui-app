// Файл: components/custom/SymptomCheckbox.tsx

import React from "react";
import { TouchableOpacity } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Feather } from "@expo/vector-icons"; // Используем иконку для галочки

// Определяем, какие пропсы будет принимать наш компонент
interface SymptomCheckboxProps {
  label: string;
  isChecked: boolean;
  onPress: () => void;
}

export default function SymptomCheckbox({
  label,
  isChecked,
  onPress,
}: SymptomCheckboxProps) {
  return (
    // TouchableOpacity делает всю область кликабельной
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      {/* 
        Контейнер, который меняет стили (фон, рамку) в зависимости от пропса isChecked.
        Это сердце кастомизации.
      */}
      <Box
        className={`
          p-4 rounded-lg border flex-row items-center justify-between
          ${isChecked ? "bg-black border-black" : "bg-white border-neutral-300"}
        `}
      >
        {/* Текст, который меняет цвет */}
        <Text
          className={`text-base font-medium ${
            isChecked ? "text-white" : "text-black"
          }`}
        >
          {label}
        </Text>

        {/* 
          Квадратик для галочки. Он тоже меняет цвет рамки.
        */}
        <Box
          className={`
            h-6 w-6 border-2 rounded items-center justify-center
            ${isChecked ? "border-white" : "border-neutral-400"}
          `}
        >
          {isChecked && <Feather name="check" size={18} color="white" />}
        </Box>
      </Box>
    </TouchableOpacity>
  );
}
