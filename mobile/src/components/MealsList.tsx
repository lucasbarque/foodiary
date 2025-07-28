import { FlatList, Text, View } from "react-native";
import { MealCard } from "./MealCard";
import { DateSwitcher } from "./DateSwitcher";
import { DailyStats } from "./DailyStats";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "../services/httpClient";
import { useCallback, useMemo, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import LottieView from "lottie-react-native";

interface IMealsListHeaderProps {
  currentDate: Date;
  meals: Meal[];
  onPreviousDate: () => void;
  onNextDate: () => void;
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

function MealsListHeader({
  currentDate,
  onNextDate,
  onPreviousDate,
  meals,
}: IMealsListHeaderProps) {
  const { user } = useAuth();

  const totals = useMemo(() => {
    let calories = 0;
    let proteins = 0;
    let carbohydrates = 0;
    let fats = 0;

    for (const meal of meals) {
      for (const food of meal.foods) {
        calories += food.calories;
        proteins += food.proteins;
        carbohydrates += food.carbohydrates;
        fats += food.fats;
      }
    }

    return {
      calories,
      proteins,
      carbohydrates,
      fats,
    };
  }, [meals]);

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
            current: totals.calories,
            goal: user.calories,
          }}
          proteins={{
            current: totals.proteins,
            goal: user.proteins,
          }}
          carbohydrates={{
            current: totals.carbohydrates,
            goal: user.carbohydrates,
          }}
          fats={{
            current: totals.fats,
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

export function MealsList() {
  const { bottom } = useSafeAreaInsets();

  const [currentDate, setCurrentDate] = useState(new Date());
  const animation = useRef<LottieView>(null);

  const dateParam = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, [currentDate]);

  const { data: meals, refetch } = useQuery({
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

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

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
        contentContainerStyle={{ paddingBottom: 220 + bottom + 16 }}
        keyExtractor={(meal) => meal.id}
        ListHeaderComponent={
          <MealsListHeader
            currentDate={currentDate}
            onNextDate={handleNextDate}
            onPreviousDate={handlePreviousDate}
            meals={meals ?? []}
          />
        }
        ListEmptyComponent={
          <View className="px-5 gap-2 mt-4 text-center items-center">
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: 200,
                height: 200,
                marginBottom: -50,
                marginTop: -70,
              }}
              source={require("../assets/animations/fast-food.json")}
            />
            <Text className="text-orange-500 text-xl font-sans-bold">
              Sem refeições cadastradas
            </Text>
            <Text className="text-center px-6 text-slate-500 text-base font-sans-regular">
              Começe cadastrando agora mesmo e tenha um controle melhor da sua
              dieta.
            </Text>
          </View>
        }
        ItemSeparatorComponent={Separator}
        renderItem={({ item: meal }) => (
          <View className="mx-5">
            <MealCard
              id={meal.id}
              name={meal.name}
              icon={meal.icon}
              foods={meal.foods}
              createdAt={new Date(meal.createdAt)}
            />
          </View>
        )}
      />
    </View>
  );
}
