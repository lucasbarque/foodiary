import { Controller, useFormContext } from "react-hook-form";
import { OptionsSelector } from "../OptionsSelector";
import { SignUpFormData } from "./signUpSchema";

export function ActivityLevelStep() {
  const form = useFormContext<SignUpFormData>();

  return (
    <Controller
      control={form.control}
      name="activityLevel"
      render={({ field, fieldState }) => (
        <OptionsSelector
          value={field.value}
          onChange={field.onChange}
          options={[
            {
              icon: "🛋️",
              title: "Sedentário",
              description: "Pouca ou nenhuma atividade física",
              value: "1",
            },
            {
              icon: "🚶",
              title: "Leve",
              description: "Exercício 1-3 dias por semana",
              value: "2",
            },
            {
              icon: "🏃",
              title: "Moderado",
              description: "Exercício 3-5 dias por semana",
              value: "3",
            },
            {
              icon: "🏋️",
              title: "Pesado",
              description: "Exercício 6-7 dias por semana",
              value: "4",
            },
            {
              icon: "🏆",
              title: "Atleta",
              description: "Exercício muito pesado, trabalho físico",
              value: "5",
            },
          ]}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
