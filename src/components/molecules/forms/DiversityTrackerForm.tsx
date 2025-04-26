// components/DiversityTrackerForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { RadioField, CheckboxField, SelectField } from "./FormFields";
import {
  ageRangeOptions,
  disabilityOptions,
  ethnicityOptions,
  selfIdentityOptions,
  sexualOrientationOptions,
} from "@/utils/diversityTracker";
import { LoaderCircleIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useRef } from "react";

const formSchema = z.object({
  self_identity: z.string().min(1, "Please select a gender identity"),
  self_identity_custom: z.string().optional(),
  age_range: z.string().min(1, "Please select an age range"),
  ethnicity: z
    .array(z.string())
    .min(1, "Please select at least one ethnicity option"),
  ethnicity_custom: z.string().optional(),
  disability: z
    .array(z.string())
    .min(1, "Please select at least one disability option"),
  sexual_orientation: z.string().min(1, "Please select a sexual orientation"),
  equity_scale: z.number().min(1).max(10),
  improvement_suggestions: z.string().optional(),
  grant_provider: z.string().optional(),
  grant_round: z.string().optional(),
  suggestions: z.string().optional(),
  active_grants_participated: z.enum(["yes", "no"]),
});

type FormValues = z.infer<typeof formSchema>;

export function DiversityTrackerForm({ onSuccess }: { onSuccess: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      self_identity: "",
      self_identity_custom: "",
      age_range: "",
      ethnicity: [],
      ethnicity_custom: "",
      disability: [],
      sexual_orientation: "",
      equity_scale: 1,
      improvement_suggestions: "",
      grant_provider: "",
      grant_round: "",
      suggestions: "",
      active_grants_participated: "no",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/mail/diversity-tracker`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formData: {
              selfIdentity: data.self_identity,
              selfIdentityCustom: data.self_identity_custom,
              ageRange: data.age_range,
              ethnicity: data.ethnicity.join(", "),
              disability: data.disability.join(", "),
              sexualOrientation: data.sexual_orientation,
              equityScale: data.equity_scale,
              improvementSuggestions: data.improvement_suggestions || "",
              grantProvider: data.grant_provider || "",
              grantRound: data.grant_round || "",
              suggestions: data.suggestions || "",
              activeGrantsParticipated:
                data.active_grants_participated === "yes" ? "yes" : "no",
            },
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to submit diversity tracker");

      return response.json();
    },
    onSuccess: () => {
      toast.success("Diversity tracker submitted successfully!");
      form.reset();
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  return (
    <div className="mx-auto w-full">
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-10"
        >
          <RadioField
            form={form}
            badge
            name="self_identity"
            label="Which of the following gender categories best describes how you self-identify?"
            options={selfIdentityOptions}
          />
          <RadioField
            form={form}
            name="age_range"
            label="What is your age range?"
            options={ageRangeOptions}
          />
          <CheckboxField
            form={form}
            name="ethnicity"
            label="Which of the following ethnic or racial categories best describes how you self-identify? (Select all that apply)"
            options={ethnicityOptions}
          />
          <CheckboxField
            form={form}
            name="disability"
            label="Do you have any of the following disabilities or chronic conditions? (Select all that apply)"
            options={disabilityOptions}
          />
          <SelectField
            form={form}
            name="sexual_orientation"
            label="Which of the following best describes your sexual orientation?"
            options={sexualOrientationOptions}
            placeholder="Select orientation"
          />
          <FormField
            control={form.control}
            name="equity_scale"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  On a scale from 1 to 10, how inclusive and equitable do you
                  feel the Web3 industry is?
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                    <div
                      className="mt-3 flex w-full items-center justify-between gap-1 px-2.5 text-xs font-medium text-gray-500"
                      aria-hidden="true"
                    >
                      {[...Array(11)].map((_, i) => (
                        <span
                          key={i}
                          className="flex w-0 flex-col items-center justify-center gap-2"
                        >
                          <span className={cn("h-1 w-px bg-gray-500")} />
                          <span className={cn()}>{i}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="improvement_suggestions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Please share your thoughts on how the Web3 industry can
                  improve on the topics of Diversity, Equity, Accessibility, and
                  Inclusion.
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please share suggestions here"
                    className="h-32 resize-none p-4"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <RadioField
            form={form}
            name="active_grants_participated"
            label="Are you currently participating in any of these active grant rounds?"
            options={["Yes", "No"]}
          />

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-black text-white"
          >
            {mutation.isPending && (
              <LoaderCircleIcon
                className="mr-2 animate-spin"
                size={16}
                aria-hidden="true"
              />
            )}
            {mutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
