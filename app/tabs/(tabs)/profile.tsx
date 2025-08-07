import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

const settingsItems = [
  { id: "premium", label: "Go Premium", icon: "star" },
  { id: "goals", label: "My goals", icon: "target" },
  { id: "subscription", label: "Subscription", icon: "credit-card" },
  { id: "support", label: "Health Support", icon: "heart" },
  { id: "terms", label: "Terms & Conditions", icon: "file-text" },
  { id: "delete", label: "Delete profile", icon: "trash-2" },
];

const SettingsButton = ({ label, icon, onPress }: any) => (
  <TouchableOpacity onPress={onPress} className="w-1/3 p-2 items-center">
    <VStack space="sm" className="items-center">
      <Feather name={icon} size={24} color="black" />
      <Text className="text-xs text-center text-neutral-600">{label}</Text>
    </VStack>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <VStack space="lg" className="p-6 items-center">
          {/* 1. Блок с аватаром и именем */}
          <Box className="h-24 w-24 bg-neutral-200 rounded-full items-center justify-center">
            <Feather name="user" size={48} color="gray" />
          </Box>
          <Text className="text-xl font-bold">Name</Text>

          {/* 2. Блок настроек */}
          <Box className="w-full bg-neutral-100 p-4 rounded-xl mt-12">
            <Text className="text-lg font-bold mb-4">Settings</Text>
            {/* Сетка с настройками */}
            <Box className="flex-row flex-wrap">
              {settingsItems.map((item) => (
                <SettingsButton
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  onPress={() => console.log(`Pressed: ${item.label}`)}
                />
              ))}
            </Box>
          </Box>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
