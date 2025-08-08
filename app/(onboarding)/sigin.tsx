import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

export default function SignUpScreen() {
  const router = useRouter();

  // 3. Функция для навигации
  const handleContinue = () => {
    // Используем 'replace', чтобы пользователь не смог вернуться на экран регистрации
    router.replace("/(onboarding)/step-one");
  };

  return (
    <Center className="flex-1 bg-white p-6">
      <VStack space="xl" className="w-full">
        <Heading className="text-3xl font-bold text-center mb-16">
          Sign up
        </Heading>

        {/* Кнопка входа через Apple */}
        <Button
          size="lg"
          variant="solid"
          className="bg-black hover:bg-gray-800"
          onPress={handleContinue}
        >
          <FontAwesome5 name="apple" size={24} color="white" />
          <ButtonText>Continue with Apple</ButtonText>
        </Button>

        {/* Кнопка входа через Google */}
        <Button
          size="lg"
          variant="solid"
          className="bg-gray-300 hover:bg-gray-400"
          onPress={handleContinue}
        >
          <AntDesign name="google" size={24} color="black" />
          <ButtonText className="text-gray-700">
            Continue with Google
          </ButtonText>
        </Button>
      </VStack>
    </Center>
  );
}
