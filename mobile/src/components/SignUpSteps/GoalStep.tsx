import { OptionsSelector } from "../OptionsSelector";
import { Controller, useFormContext } from "react-hook-form";
import { SignUpFormData } from "./signUpSchema";

export function GoalStep() {
  const form = useFormContext<SignUpFormData>();

  return (
    <Controller
      control={form.control}
      name="goal"
      render={({ field, fieldState }) => (
        <OptionsSelector
          value={field.value}
          onChange={field.onChange}
          options={[
            { icon: "🥦", title: "Perder peso", value: "lose" },
            { icon: "🍍", title: "Manter peso", value: "maintain" },
            { icon: "🥩", title: "Ganhar peso", value: "gain" },
          ]}
          error={fieldState.error?.message}
        />
      )}
    ></Controller>
  );
}
