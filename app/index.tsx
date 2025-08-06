import React from "react";
import Gradient from "@/assets/Icons/Gradient";
import DocumentData from "@/assets/Icons/DocumentData";
import LightBulbPerson from "@/assets/Icons/LightbulbPerson";
import Rocket from "@/assets/Icons/Rocket";
import Logo from "@/assets/Icons/Logo";
import { Box } from "@/components/ui/box";
import { ScrollView } from "react-native";
import { Text } from "@/components/ui/text";

import { Link } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";

const FeatureCard = ({ iconSvg: IconSvg, name, desc }: any) => {
  return (
    <Box
      className="flex-column border border-w-1 border-outline-700 md:flex-1 m-2 p-4 rounded"
      key={name}
    >
      <Box className="items-center flex flex-row">
        <Text>
          <IconSvg />
        </Text>
        <Text className="text-typography-white font-medium ml-2 text-xl">
          {name}
        </Text>
      </Box>
      <Text className="text-typography-400 mt-2">{desc}</Text>
    </Box>
  );
};

export default function Home() {
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
            <Text className="text-3xl">LOGO</Text>
          </Box>
        </ScrollView>

        <Box className="p-4 w-full">
          <Button size="md" variant="solid" action="primary">
            <ButtonText>Start now</ButtonText>
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
