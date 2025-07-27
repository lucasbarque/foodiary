import { Controller, useFormContext } from "react-hook-form";
import { OptionsSelector } from "../OptionsSelector";
import { SignUpFormData } from "./signUpSchema";

export function GenderStep() {
  const form = useFormContext<SignUpFormData>();

  return (
    <Controller
      control={form.control}
      name="gender"
      render={({ field, fieldState }) => (
        <OptionsSelector
          value={field.value}
          onChange={field.onChange}
          options={[
            {
              icon: "👨",
              title: "Masculino",
              value: "male",
            },
            {
              icon: "👩",
              title: "Feminino",
              value: "female",
            },
          ]}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
