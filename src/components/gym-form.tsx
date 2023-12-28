import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCompletion } from "ai/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const fileSchema = z.object({
  file: z.any().refine((file) => file instanceof FileList && file.length > 0, {
    message: "Please upload a file",
  }),
});

// Zod schema
const formSchema = z.object({
  programTitle: z.string().min(1, "Program title is required"),
  programDescription: z.string().optional(),
  userObjectives: z.string().min(1, "User objectives are required"),
  imageUpload: fileSchema.optional(),
  availableEquipment: z.string().min(1, "Available equipment is required"),
});
type FormData = z.infer<typeof formSchema>;

export function GymForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const {
    completion,
    input,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit: handleSubmitCompletion,
  } = useCompletion();

  const onSubmit = (data: FormData) => {
    console.log(data);
    // setSubmitted(true);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="program-title">Título do Programa</Label>
          <Input
            id="program-title"
            placeholder="Insira o título do programa"
            required
            {...register("programTitle")}
          />
          {errors.programTitle && <span>{errors.programTitle.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="program-description">Descrição do Programa</Label>
          <Textarea
            id="program-description"
            placeholder="Descreva seu programa"
            required
            {...register("programDescription")}
          />
          {errors.programDescription && (
            <span>{errors.programDescription.message}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="objectives">Objetivos</Label>
          <Input
            id="objectives"
            placeholder="Descreva seus objetivos"
            required
            {...register("userObjectives")}
          />
          {errors.userObjectives && (
            <span>{errors.userObjectives.message}</span>
          )}
        </div>
        <div className="space-y-2 rounded-lg bg-blue-100 p-4">
          <Label htmlFor="image-upload">Carregar Imagem / Tirar uma Foto</Label>
          <Input
            id="image-upload"
            required
            type="file"
            {...register("imageUpload")}
          />
          <Button
            className="mt-2 w-full bg-blue-500 text-white hover:bg-blue-700"
            type="button"
          >
            Encontre Equipamento com IA
          </Button>
          <p className="mt-1 text-sm text-gray-500">
            Após carregar uma imagem, pressione o botão acima para preencher
            automaticamente o campo de equipamento.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="equipment">Equipamento Disponível</Label>
          <Textarea
            id="equipment"
            placeholder="Lista de equipamentos disponíveis"
            required
            {...register("availableEquipment")}
          />
          {errors.availableEquipment && (
            <span>{errors.availableEquipment.message}</span>
          )}
        </div>
        <Button className="w-full" type="submit">
          Criar Programa
        </Button>
      </div>
    </form>
  );
}
