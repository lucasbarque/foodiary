import { Text, TouchableOpacity, View } from "react-native";

export function MealCard() {
  return (
    <TouchableOpacity>
      <Text className="text-base font-sans-regular text-gray-700">
        Hoje, 12h25min
      </Text>

      <View className="mt-2 px-4 py-5 flex-row gap-3 items-center border border-gray-400">
        <View className="size-12 bg-gray-100 rounded-full items-center justify-center">
          <Text>🔥</Text>
        </View>
        <View>
          <Text>Café da manhã</Text>
          <Text>Pão</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
