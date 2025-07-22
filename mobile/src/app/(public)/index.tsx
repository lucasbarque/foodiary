import { ImageBackground, SafeAreaView, Text, View } from "react-native";
import { Logo } from "../../components/Logo";
import { Button } from "../../components/Button";
import { Link } from "expo-router";

export default function SignIn() {
  return (
    <ImageBackground
      source={require("../../assets/onboarding-bg/onboarding-bg.png")}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-between">
          <View className="mx-auto mt-4">
            <Logo width={100} height={32} />
          </View>

          <View className="w-full items-center">
            <Text className="font-sans-semibold text-[32px] text-white w-[311px] text-center">
              Controle sua dieta de forma simples
            </Text>

            <View className="p-5 w-full mt-6">
              <Link asChild href="/signup">
                <Button className="w-full">Criar conta</Button>
              </Link>

              <View className="mt-[30px] flex-row items-center gap-2 justify-center">
                <Text className="font-sans-regular text-white text-base">
                  Já tem uma conta?
                </Text>
                <Link asChild href="/signin">
                  <Text className="text-lime-500 font-sans-regular text-base">
                    Acesse agora!
                  </Text>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
