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
  const addRow = (rows: DegreeRow[]) => {
    form.setFieldValue("academicDegrees", [
      ...rows,
      { degreeId: "", degreeField: "" },
    ]);
  };

  const removeRow = (rows: DegreeRow[], idx: number) => {
    // optional: prevent removing last row
    if (rows.length <= 1) return;

    const next = rows.slice();
    next.splice(idx, 1);
    form.setFieldValue("academicDegrees", next);
  };

  return (
    <div className="space-y-3">
      <form.Subscribe
        selector={(state: any) => (state.values?.academicDegrees ?? []) as DegreeRow[]}
      >
        {(rows: DegreeRow[]) => (
          <>
            {rows.map((_, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end"
              >
                <form.AppField
                  name={`academicDegrees[${idx}].degreeId`}
                  children={(field: any) => (
                    <field.DropdownSelectField
                      label="Degree"
                      name={`academicDegrees[${idx}].degreeId`}
                      value={field.state.value ?? ""}
                      onChange={(v: string | null) => field.setValue(v ?? "")}
                      placeholder="Select degree level"
                      options={degreeOptions}
                    />
                  )}
                />

                <form.AppField
                  name={`academicDegrees[${idx}].degreeField`}
                  children={(field: any) => (
                    <field.TextField
                      label="Degree field"
                      placeholder="Enter degree field"
                      value={field.state.value ?? ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.setValue(e.target.value)
                      }
                    />
                  )}
                />

                <div className="md:pb-[2px]">
                  <button
                    type="button"
                    onClick={() => removeRow(rows, idx)}
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

            <div>
              <button
                type="button"
                onClick={() => addRow(rows)}
                className="h-10 bg-[var(--teal-700)] px-4 text-sm font-semibold text-white hover:bg-white hover:text-[var(--teal-700)] border-[var(--teal-700)] border-4"
              >
                ADD ANOTHER DEGREE
              </button>
            </div>
          </>
        )}
      </form.Subscribe>
    </div>
  );
}