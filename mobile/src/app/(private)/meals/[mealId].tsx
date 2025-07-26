import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { Button } from "../../../components/Button";
import { Logo } from "../../../components/Logo";
import { httpClient } from "../../../services/httpClient";

type Meal = {
  id: string;
  createdAt: string;
  icon: string;
  name: string;
  status: "uploading" | "processing" | "success" | "failed";
  foods: {
    name: string;
    quantity: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
  }[];
};

export default function MealDetails() {
  const { mealId } = useLocalSearchParams();

  const { data: meal, isFetching } = useQuery({
    queryKey: ["meal", mealId],
    staleTime: Infinity,
    queryFn: async () => {
      const { data } = await httpClient.get<{ meal: Meal }>(`/meals/${mealId}`);

      return data.meal;
    },
    refetchInterval: (query) => {
      if (query.state.data?.status === "success") {
        return false;
      }

      return 2_000;
    },
  });

  if (isFetching || meal?.status !== "success") {
    return (
      <View className="bg-lime-700 flex-1 items-center justify-center gap-12">
        <Logo width={187} height={60} />
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Button onPress={router.back}>Voltar</Button>

      <Text>{JSON.stringify(meal, null, 2)}</Text>
    </View>
  );
}
