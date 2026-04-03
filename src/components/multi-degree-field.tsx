import * as React from "react";
import { Button } from "@/components/ui/button";
import type { Degree, Option } from "@/helpers/types";

export default function AcademicDegreesSection({
  form,
  degreeOptions,
}: {
  form: any;
  degreeOptions: Option<number>[];
}) {
  return (
    <form.AppField name="degrees" mode="array">
      {(degreesField: any) => {
        const rows = (degreesField.state.value ?? []) as Degree[];

        const addRow = () => {
          degreesField.pushValue({
            degreeId: 0,
            degreeField: "",
          });
        };

        const removeRow = (idx: number) => {
          if (rows.length <= 1) return;
          degreesField.removeValue(idx);
        };

        return (
          <fieldset className="space-y-4 border border-slate-300 p-4">
            <legend
              data-slot="field-label"
              className="
                mb-3 flex w-fit items-center gap-2
                text-sm leading-snug font-semibold select-none
              "
            >
              Academic Degrees
            </legend>

            <div className="space-y-4">
              {rows.map((_, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto] md:items-start"
                >
                  <form.AppField name={`degrees[${idx}].degreeId`}>
                    {(field: any) => (
                      <field.DropdownSelectField
                        label="Degree"
                        name={`degrees[${idx}].degreeId`}
                        value={field.state.value ?? ""}
                        onChange={(v: string | null) => field.setValue(v ?? "")}
                        placeholder="Select degree level"
                        options={degreeOptions}
                      />
                    )}
                  </form.AppField>

                  <form.AppField name={`degrees[${idx}].degreeField`}>
                    {(field: any) => (
                      <field.TextField
                        label="Degree field"
                        placeholder="Enter degree field"
                        value={field.state.value ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          field.setValue(e.target.value)
                        }
                      />
                    )}
                  </form.AppField>

                  <div className="md:mt-8">
                    <Button
                      className="border-red-600 hover:bg-white hover:border-red-600"
                      type="button"
                      variant="destructive"
                      size="lg"
                      onClick={() => removeRow(idx)}
                      disabled={rows.length <= 1}
                      aria-label={`Remove degree ${idx + 1}`}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Button
                type="button"
                size="lg"
                onClick={addRow}
                className="bg-[var(--teal-700)] border-[var(--teal-700)] text-white hover:bg-white hover:text-[var(--teal-700)]"
              >
                Add Another Degree
              </Button>
            </div>
          </fieldset>
        );
      }}
    </form.AppField>
  );
}
