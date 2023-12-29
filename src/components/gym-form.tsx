"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCompletion } from "ai/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const fileSchema = z.object({
  file: z
    .any()
    .refine(
      (file) =>
        (file instanceof FileList && file.length > 0) || file instanceof File,
      {
        message: "Please upload a file",
      },
    ),
});

// Zod schema
const formSchema = z.object({
  programTitle: z.string().min(1, "Titulo do programa é obrigatório"),
  programDescription: z.string().optional(),
  userObjectives: z.string().min(1, "Objetivos é obrigatório"),
  imageUpload: z.any().optional(),
  availableEquipment: z
    .string()
    .min(1, "Equipamentos disponíveis é obrigatório"),
});
type FormData = z.infer<typeof formSchema>;

export function GymForm() {
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<FormData>({
  //   resolver: zodResolver(formSchema),
  // });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const {
    completion,
    handleSubmit: handleSubmitCompletion,
    setInput,
    isLoading,
  } = useCompletion();

  const onSubmit = (data: FormData) => {
    console.log(data);
    const prompt = `
      Faça um programa de academia para ${data.userObjectives} usando ${data.availableEquipment}.
      Responda em markdown.
    `;

    setInput(prompt);
  };

  const onSubmitFull = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await form.handleSubmit(onSubmit)(e);

      handleSubmitCompletion(e);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmitFull} className="space-y-4">
        <FormField
          control={form.control}
          name="programTitle"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel htmlFor="program-title">Título do Programa</FormLabel>
              <FormControl>
                <Input
                  id="program-title"
                  placeholder="Insira o título do programa"
                  {...field}
                />
              </FormControl>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="programDescription"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel htmlFor="program-description">
                Descrição do Programa
              </FormLabel>
              <FormControl>
                <Textarea
                  id="program-description"
                  placeholder="Descreva seu programa"
                  {...field}
                />
              </FormControl>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userObjectives"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel htmlFor="objectives">Objetivos</FormLabel>
              <FormControl>
                <Input
                  id="objectives"
                  placeholder="Descreva seus objetivos"
                  {...field}
                />
              </FormControl>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUpload"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="space-y-2 rounded-lg bg-blue-100 p-4">
              <FormLabel htmlFor="image-upload">
                Carregar Imagem / Tirar uma Foto
              </FormLabel>
              <FormControl>
                <Input id="image-upload" type="file" {...field} />
              </FormControl>
              <FormMessage>{error?.message}</FormMessage>

              <Button className="mt-2 w-full bg-blue-500 text-white hover:bg-blue-700">
                Encontre Equipamento com IA
              </Button>
              <p className="mt-1 text-sm text-gray-500">
                Após carregar uma imagem, pressione o botão acima para preencher
                automaticamente o campo de equipamento.
              </p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="availableEquipment"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel htmlFor="equipment">Equipamento Disponível</FormLabel>
              <FormControl>
                <Textarea
                  id="equipment"
                  placeholder="Lista de equipamentos disponíveis"
                  {...field}
                />
              </FormControl>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button disabled={isLoading} className="w-full" type="submit">
          Criar Programa
        </Button>

        {completion && (
          <output className="whitespace-break-spaces text-sm text-gray-500">
            {completion}
          </output>
        )}
      </form>
    </Form>
  );
}
