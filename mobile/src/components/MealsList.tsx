import { FlatList, Text, View } from "react-native";
import { MealCard } from "./MealCard";
import { DateSwitcher } from "./DateSwitcher";
import { DailyStats } from "./DailyStats";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "../services/httpClient";

function MealsListHeader() {
  const { user } = useAuth();

  if (!user) return;

  return (
    <View>
      <DateSwitcher />
      <View className="mt-2">
        <DailyStats
          calories={{
            current: 0,
            goal: user.calories,
          }}
          proteins={{
            current: 0,
            goal: user.proteins,
          }}
          carbohydrates={{
            current: 0,
            goal: user.carbohydrates,
          }}
          fats={{
            current: 0,
            goal: user.fats,
          }}
        />
      </View>
      <View className="h-px bg-gray-200 mt-7" />

      <Text className="text-black-700 text-base m-5 font-sans-medium tracking-[1.28px]">
        REFEIÇÕES
      </Text>
    </View>
  );
}

function Separator() {
  return <View className="h-8" />;
}

type Meal = {
  id: string;
  name: string;
  icon: string;
  foods: {
    name: string;
    quantity: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
  }[];
  createdAt: Date;
};

export function MealsList() {
  const { bottom } = useSafeAreaInsets();

  const { data: meals } = useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      const { data } = await httpClient.get<{ meals: Meal[] }>("/meals", {
        params: {
          date: "2025-07-25",
        },
      });
      console.log(data);
      return data.meals;
    },
  });

  return (
    <View>
      <FlatList
        data={meals}
        contentContainerStyle={{ paddingBottom: 80 + bottom + 16 }}
        keyExtractor={(meal) => meal.id}
        ListHeaderComponent={<MealsListHeader />}
        ListEmptyComponent={<Text>Nenhuma refeição cadastrada...</Text>}
        ItemSeparatorComponent={Separator}
        renderItem={({ item: meal }) => (
          <View className="mx-5">
            <MealCard id={meal.id} name={meal.name} />
          </View>
        )}
      />
    </View>
  );
}
