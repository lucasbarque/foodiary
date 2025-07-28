import z from "zod";

export const signUpSchema = z.object({
  goal: z.enum(
    ["lose", "maintain", "gain"],
    "Para continuar, selecione uma das opções."
  ),
  birthDate: z
    .string("Data de nascimento é obrigatória")
    .min(1, "Data de nascimento é obrigatória")
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "A data deve estar no formato DD/MM/YYYY"
    )
    .refine((date) => {
      // Verifica o formato básico
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = date.match(dateRegex);

      if (!match) return false;

      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);

      // Verifica se o ano está em um range razoável (de 1900 até ano atual)
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) return false;

      // Cria a data e verifica se é válida
      const dateObj = new Date(year, month - 1, day);

      // Verifica se a data criada corresponde aos valores fornecidos
      // (isso captura casos como 31/02, 30/02, etc.)
      if (
        dateObj.getDate() !== day ||
        dateObj.getMonth() !== month - 1 ||
        dateObj.getFullYear() !== year
      ) {
        return false;
      }

      // Verifica se a data não está no futuro
      const today = new Date();
      if (dateObj > today) return false;

      return true;
    }, "Data de nascimento inválida")
    .refine((date) => {
      // Validação específica para idade mínima
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = date.match(dateRegex);

      if (!match) return true; // Se não tem match, já foi validado antes

      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);

      const dateObj = new Date(year, month - 1, day);
      const currentYear = new Date().getFullYear();

      // Verifica se a pessoa tem pelo menos 10 anos
      const minDate = new Date();
      minDate.setFullYear(currentYear - 10);

      return dateObj <= minDate;
    }, "Você deve ter pelo menos 10 anos para usar o aplicativo"),
  gender: z.enum(
    ["male", "female"],
    "Para continuar, selecione uma das opções."
  ),
  height: z
    .string("Altura é obrigatória.")
    .min(1, "Altura é obrigatória.")
    .refine((height) => {
      // Verifica se contém apenas números inteiros (sem vírgula ou ponto)
      const integerRegex = /^\d+$/;
      return integerRegex.test(height);
    }, "Digite uma altura válida.")
    .refine((height) => {
      const numericHeight = parseInt(height, 10);
      return !isNaN(numericHeight) && numericHeight >= 60;
    }, "A altura deve ser de pelo menos 60cm"),
  weight: z
    .string("Peso é obrigatório.")
    .min(1, "Peso é obrigatório.")
    .refine((weight) => {
      // Substitui vírgula por ponto
      const normalizedWeight = weight.replace(",", ".");

      // Verifica se contém apenas números e um ponto decimal opcional
      const decimalRegex = /^\d+(\.\d{1,2})?$/;
      return decimalRegex.test(normalizedWeight);
    }, "Digite um peso válido (ex: 70.5 ou 70,5)")
    .refine((weight) => {
      // Substitui vírgula por ponto para conversão
      const normalizedWeight = weight.replace(",", ".");
      const numericWeight = parseFloat(normalizedWeight);
      return !isNaN(numericWeight) && numericWeight >= 25;
    }, "O peso deve ser de pelo menos 25kg")
    .transform((weight) => {
      // Transforma vírgula em ponto para envio à API
      return weight.replace(",", ".");
    }),
  activityLevel: z.string("Para continuar, selecione uma das opções."),
  name: z
    .string("Nome é obrigatório")
    .min(1, "Nome é obrigatório")
    .refine((name) => {
      const names = name.trim().split(/\s+/);
      return names.length >= 2;
    }, "Digite seu sobrenome também.")
    .refine((name) => {
      const names = name.trim().split(/\s+/);
      return names[0].length >= 3;
    }, "O primeiro nome deve conter pelo menos 3 caracteres"),
  email: z.email("Email inválido."),
  password: z
    .string("Senha é obrigatória.")
    .min(8, "Senha deve possuir pelo menos 8 caracteres"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
