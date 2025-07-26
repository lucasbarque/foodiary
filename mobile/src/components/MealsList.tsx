import { FlatList, Text, View } from "react-native";
import { MealCard } from "./MealCard";
import { DateSwitcher } from "./DateSwitcher";
import { DailyStats } from "./DailyStats";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "../services/httpClient";
import { useMemo, useState } from "react";

interface IMealsListHeaderProps {
  currentDate: Date;
  onPreviousDate: () => void;
  onNextDate: () => void;
}

function MealsListHeader({
  currentDate,
  onNextDate,
  onPreviousDate,
}: IMealsListHeaderProps) {
  const { user } = useAuth();

  if (!user) return;

  return (
    <View>
      <DateSwitcher
        currentDate={currentDate}
        onPreviousDate={onPreviousDate}
        onNextDate={onNextDate}
      />
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

  const [currentDate, setCurrentDate] = useState(new Date());

  const dateParam = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, [currentDate]);

  const { data: meals } = useQuery({
    queryKey: ["meals", dateParam],
    staleTime: 15_000,
    queryFn: async () => {
      const { data } = await httpClient.get<{ meals: Meal[] }>("/meals", {
        params: {
          date: dateParam,
        },
      });

      return data.meals;
    },
  });

  function handlePreviousDate() {
    setCurrentDate((prevState) => {
      const newDate = new Date(prevState);
      newDate.setDate(newDate.getDate() - 1);

      return newDate;
    });
  }
  function handleNextDate() {
    setCurrentDate((prevState) => {
      const newDate = new Date(prevState);
      newDate.setDate(newDate.getDate() + 1);

      return newDate;
    });
  }

  return (
    <View>
      <FlatList
        data={meals}
        contentContainerStyle={{ paddingBottom: 80 + bottom + 16 }}
        keyExtractor={(meal) => meal.id}
        ListHeaderComponent={
          <MealsListHeader
            currentDate={currentDate}
            onNextDate={handleNextDate}
            onPreviousDate={handlePreviousDate}
          />
        }
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
