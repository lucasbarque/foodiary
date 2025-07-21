import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface IMealCardProps {
  id: string;
  name: string;
}

export function MealCard({ id, name }: IMealCardProps) {
  return (
    <Link href={`/meals/${id}`} asChild>
      <TouchableOpacity>
        <Text className="text-base font-sans-regular text-gray-700">
          Hoje, 12h25min
        </Text>

        <View className="mt-2 px-4 py-5 flex-row gap-3 items-center border border-gray-400 rounded-2xl">
          <View className="size-12 bg-gray-100 rounded-full items-center justify-center">
            <Text>🔥</Text>
          </View>
          <View>
            <Text className="text-base font-sans-regular text-gray-700">
              {name}
            </Text>
            <Text className="text-base font-sans-medium text-gray-700">
              Pão
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
