import * as React from "react";

type Option = { label: string; value: string };
type DegreeRow = { degreeId: string; degreeField: string };

export default function AcademicDegreesSection({
  form,
  degreeOptions,
}: {
  form: any;
  degreeOptions: Option[];
}) {
  return (
    <form.AppField name="academicDegrees">
      {(degreesField: any) => {
        const rows = (degreesField.state.value ?? []) as DegreeRow[];

        const addRow = () => {
          degreesField.setValue([
            ...rows,
            { degreeId: "", degreeField: "" },
          ]);
        };

        const removeRow = (idx: number) => {
          if (rows.length <= 1) return;

          const next = rows.slice();
          next.splice(idx, 1);
          degreesField.setValue(next);
        };

        return (
          <fieldset className="space-y-4 border border-slate-300 p-4">
            <legend 
              data-slot="field-label"
              className="
                mb-3 text-sm font-semibold leading-snug
                flex w-fit items-center gap-2 select-none
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
                  <form.AppField name={`academicDegrees[${idx}].degreeId`}>
                    {(field: any) => (
                      <field.DropdownSelectField
                        label="Degree"
                        name={`academicDegrees[${idx}].degreeId`}
                        value={field.state.value ?? ""}
                        onChange={(v: string | null) => field.setValue(v ?? "")}
                        placeholder="Select degree level"
                        options={degreeOptions}
                      />
                    )}
                  </form.AppField>

                  <form.AppField name={`academicDegrees[${idx}].degreeField`}>
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
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      disabled={rows.length <= 1}
                      className="
                        h-10 px-4 text-sm font-semibold text-white
                        bg-red-700 hover:bg-red-800
                        disabled:opacity-50 disabled:cursor-not-allowed
                      "
                      aria-label={`Remove degree ${idx + 1}`}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <button
                type="button"
                onClick={addRow}
                className="
                  h-10 border-4 border-[var(--teal-700)]
                  bg-[var(--teal-700)] px-4 text-sm font-semibold text-white
                  hover:bg-white hover:text-[var(--teal-700)]
                "
              >
                ADD ANOTHER DEGREE
              </button>
            </div>
          </fieldset>
        );
      }}
    </form.AppField>
  );
}