import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ScrollView } from "@/components/ui/scroll-view";

const meditationData = [
  {
    title: "Meditation 1",
    description: "Тут будет описание медитации",
    isLocked: false,
  },
  {
    title: "Meditation day 2",
    description: "Тут будет описание медитации",
    isLocked: true,
  },
  {
    title: "Meditation day 3",
    description: "Тут будет описание медитации",
    isLocked: true,
  },
  {
    title: "Meditation day 4",
    description: "Тут будет описание медитации",
    isLocked: true,
  },
];

function MeditationCard({
  title,
  description,
  isLocked,
}: {
  title: string;
  description: string;
  isLocked: boolean;
}) {
  return (
    <Box
      className={`p-5 rounded-xl ${isLocked ? "bg-gray-200" : "bg-gray-100"}`}
    >
      <VStack space="sm">
        <Text className="font-bold text-base">{title}</Text>
        <Text className="text-gray-500">{description}</Text>
      </VStack>
    </Box>
  );
}

export default function Calendar() {
  return (
    <Box className="flex-1 bg-white pt-12">
      <Heading className="text-3xl font-bold px-5 mb-5">
        Список медитаций
      </Heading>
      <ScrollView>
        <VStack space="md" className="px-5 pb-5">
          {meditationData.map((meditation, index) => (
            <MeditationCard
              key={index}
              title={meditation.title}
              description={meditation.description}
              isLocked={meditation.isLocked}
            />
          ))}
        </VStack>
      </ScrollView>
    </Box>
  );
}
