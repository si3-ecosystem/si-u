// components/atoms/FormFields.tsx
"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function RadioField({
  form,
  name,
  label,
  options,
  badge = false,
  className = "",
}) {
  const mappedOptions = options.map((option) => option.toLowerCase());
  const isSelfDescribeSelected =
    name === "self_identity" && form.watch(name) === "prefer to self-describe";

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mb-4 text-lg">{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value);
                if (value !== "prefer to self-describe") {
                  form.setValue("self_identity_custom", "");
                }
              }}
              value={field.value}
              className={cn("flex w-full flex-wrap gap-4", className)}
            >
              {options.map((option, index) => (
                <div
                  key={option}
                  className="relative flex items-center space-x-2"
                >
                  {badge ? (
                    <>
                      <RadioGroupItem
                        value={mappedOptions[index]}
                        id={option}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor={option}
                        className={cn(
                          "cursor-pointer rounded-full border border-gray-300 bg-gray-300 px-4 py-2 text-sm",
                          field.value === mappedOptions[index]
                            ? "border-black bg-black font-medium text-white"
                            : "bg-gray-300 hover:bg-black hover:text-white"
                        )}
                        onClick={() => field.onChange(mappedOptions[index])}
                      >
                        {option}
                      </label>
                    </>
                  ) : (
                    <>
                      <RadioGroupItem
                        value={mappedOptions[index]}
                        id={option}
                        className="cursor-pointer"
                      />
                      <label
                        htmlFor={option}
                        className="cursor-pointer text-sm"
                        onClick={() => field.onChange(mappedOptions[index])}
                      >
                        {option}
                      </label>
                    </>
                  )}
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          {isSelfDescribeSelected && (
            <FormField
              control={form.control}
              name="self_identity_custom"
              render={({ field: customField }) => (
                <FormItem className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  <FormLabel className="text-start text-sm sm:shrink-0">
                    Prefer to describe :
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your description"
                      {...customField}
                      onChange={(e) => {
                        customField.onChange(e);
                        form.setValue("self_identity", e.target.value);
                      }}
                      className="max-w-[568px] rounded-none border-0 border-b border-black ring-0 outline-none focus-within:ring-0 focus:ring-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CheckboxField({ form, name, label, options }) {
  const isEthnicity = name === "ethnicity";

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const hasSelfDescribe = field.value.some(
          (value) =>
            value.toLowerCase() === "prefer to self-describe".toLowerCase()
        );

        return (
          <FormItem>
            <FormLabel className="mb-4 text-lg">{label}</FormLabel>
            <FormControl>
              <div className="grid  justify-start align-top w-full grid-cols-1 space-y-6 sm:grid-cols-2 md:grid-cols-3">
                {options.map((option) => (
                  <div key={option} className="flex items-end space-x-2">
                    <Checkbox
                      checked={field.value.includes(option)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...field.value, option]
                          : field.value.filter((value) => value !== option);
                        field.onChange(newValue);

                        if (
                          !newValue.some(
                            (value) =>
                              value.toLowerCase() ===
                              "prefer to self-describe".toLowerCase()
                          )
                        ) {
                          form.setValue("ethnicity_custom", "");
                        }
                      }}
                      id={option}
                    />
                    <label
                      htmlFor={option}
                      className="cursor-pointer text-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        const isChecked = field.value.includes(option);
                        const newValue = isChecked
                          ? field.value.filter((value) => value !== option)
                          : [...field.value, option];
                        field.onChange(newValue);

                        if (
                          !newValue.some(
                            (value) =>
                              value.toLowerCase() ===
                              "prefer to self-describe".toLowerCase()
                          )
                        ) {
                          form.setValue("ethnicity_custom", "");
                        }
                      }}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </FormControl>
            {isEthnicity && hasSelfDescribe && (
              <FormField
                control={form.control}
                name="ethnicity_custom"
                render={({ field: customField }) => (
                  <FormItem className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <FormLabel className="text-sm sm:shrink-0">
                      Prefer to describe :
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your ethnicity"
                        {...customField}
                        onChange={(e) => {
                          customField.onChange(e);
                          const updatedEthnicity = field.value.map((value) =>
                            value.toLowerCase() ===
                            "prefer to self-describe".toLowerCase()
                              ? e.target.value
                              : value
                          );
                          form.setValue("ethnicity", updatedEthnicity);
                        }}
                        className="max-w-[568px] rounded-none border-0 border-b border-black ring-0 outline-none focus-within:ring-0 focus:ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export function SelectField({ form, name, label, options, placeholder }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mb-4 w-full text-lg">{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger
                className="w-full"
                onClick={() => {
                  const trigger = document.querySelector(`[id^="${name}-"]`);
                  if (trigger) (trigger as HTMLElement).focus();
                }}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
