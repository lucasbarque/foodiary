import {
  Alert,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AuthLayout } from "../../components/AuthLayout";
import { useState } from "react";
import { GoalStep } from "../../components/SignUpSteps/GoalStep";
import { GenderStep } from "../../components/SignUpSteps/GenderStep";
import { Button } from "../../components/Button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react-native";
import { colors } from "../../styles/colors";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../../components/SignUpSteps/signUpSchema";
import { BirthDateStep } from "../../components/SignUpSteps/BirthDateStep";
import { HeightStep } from "../../components/SignUpSteps/HeightStep";
import { WeightStep } from "../../components/SignUpSteps/WeightStep";
import { ActivityLevelStep } from "../../components/SignUpSteps/ActivityLevelStep";
import { AccountStep } from "../../components/SignUpSteps/AccountStep";
import { useAuth } from "../../hooks/useAuth";

export default function SignUp() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const form = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const steps = [
    {
      icon: "🎯",
      title: "Qual é seu objetivo?",
      subtitle: "O que você pretende alcançar com a dieta?",
      Component: GoalStep,
    },
    {
      icon: "👥",
      title: "Qual é seu gênero",
      subtitle: "Seu gênero influencia no tipo da dieta",
      Component: GenderStep,
    },
    {
      icon: "📅",
      title: "Qual é sua data de nascimento?",
      subtitle: "Sua idade ajuda a personalizar sua dieta",
      Component: BirthDateStep,
    },
    {
      icon: "📏",
      title: "Qual é sua altura?",
      subtitle: "Sua altura é importante para o cálculo do IMC",
      Component: HeightStep,
    },
    {
      icon: "⚖️",
      title: "Qual é seu peso atual?",
      subtitle: "Seu peso atual nos ajuda a criar sua dieta",
      Component: WeightStep,
    },
    {
      icon: "🏃",
      title: "Qual é seu nível de atividade?",
      subtitle: "Isso nos ajuda a calcular suas necessidades calóricas",
      Component: ActivityLevelStep,
    },
    {
      icon: "📝",
      title: "Crie sua conta",
      subtitle: "Finalize seu cadastro para começar sua jornada",
      Component: AccountStep,
    },
  ];
  function handlePreviousStep() {
    if (currentStepIndex === 0) {
      router.back();
      return;
    }

    setCurrentStepIndex((prevState) => prevState - 1);
  }

  function handleNextStep() {
    setCurrentStepIndex((prevState) => prevState + 1);
  }

  const { signUp } = useAuth();

  const handleSubmit = form.handleSubmit(async (formData) => {
    try {
      const [day, month, year] = formData.birthDate.split("/");

      await signUp({
        height: Number(formData.height),
        weight: Number(formData.weight),
        activityLevel: Number(formData.activityLevel),
        gender: formData.gender,
        goal: formData.goal,
        birthDate: `${year}-${month}-${day}`,
        account: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
      });
    } catch {
      Alert.alert("Erro ao criar a conta. Tente novamente.");
    }
  });

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <AuthLayout
      icon={currentStep.icon}
      title={currentStep.title}
      subtitle={currentStep.subtitle}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="justify-between flex-1">
          <FormProvider {...form}>
            <currentStep.Component />
          </FormProvider>

          <View className="flex-row justify-between gap-4">
            <Button size="icon" color="gray" onPress={handlePreviousStep}>
              <ArrowLeftIcon size={20} color={colors.black[700]} />
            </Button>

            {isLastStep ? (
              <Button
                className="flex-1"
                onPress={handleSubmit}
                loading={form.formState.isSubmitting}
              >
                Criar conta
              </Button>
            ) : (
              <Button size="icon" onPress={handleNextStep}>
                <ArrowRightIcon size={20} color={colors.black[700]} />
              </Button>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </AuthLayout>
  );
}
