// Recieves form component from row level
import { withForm } from "@/hooks/form";
import { Field } from "@/components/ui/field";

type ButtonFormProps = {
  disabled?: boolean;
  label: string;
  variant: "default" | "destructive" | undefined;
};

const FormButton = withForm({
  defaultValues: {},
  props: {} as ButtonFormProps,
  render: function RenderDeleteForm({
    disabled = false,
    form,
    label,
    variant,
  }) {
    return (
      <form
        onSubmit={(e) => {
          // prevents default browser submission and uses custom
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Field orientation="horizontal">
          <form.AppForm>
            <form.SubmitButton
              disabled={disabled}
              label={label}
              variant={variant}
            />
          </form.AppForm>
        </Field>
      </form>
    );
  },
});

export default FormButton;
