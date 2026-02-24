import * as React from "react";


type Option = { label: string; value: string };

export default function AcademicDegreesSection({
  form,
  degreeOptions,
}: {
  form: any;
  degreeOptions: Option[];
}) {
  // Read current rows (safe fallback)
  const rows =
    (form.state.values?.academicDegrees as
      | { degreeId: string; degreeField: string }[]
      | undefined) ?? [];

  const addRow = () => {
    form.setFieldValue("academicDegrees", [
      ...rows,
      { degreeId: "", degreeField: "" },
    ]);
  };

  const removeRow = (idx: number) => {
    const next = rows.slice();
    next.splice(idx, 1);
    form.setFieldValue("academicDegrees", next);
  };

  return (
    <div className="space-y-3">
      <div className="text-base font-semibold">Academic Degrees</div>

      {rows.map((_, idx) => (
        <div
          key={idx}
          className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end"
        >
          {/* Degree */}
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

          {/* Degree field */}
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

          {/* Remove */}
          <div className="md:pb-[2px]">
            <button
              type="button"
              onClick={() => removeRow(idx)}
              className="h-10 rounded-md bg-red-700 px-4 text-sm font-semibold text-white hover:bg-red-800"
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
          onClick={addRow}
          className="h-10 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
        >
          ADD ANOTHER DEGREE
        </button>
      </div>
    </div>
  );
}

