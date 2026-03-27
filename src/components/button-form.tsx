// Recieves form component from row level
import { withForm } from "@/hooks/form";
import { Field } from "@/components/ui/field";

type ButtonFormProps = {
  label: string;
  variant: "default" | "destructive" | undefined;
};

const ButtonForm = withForm({
  defaultValues: {},
  props: {} as ButtonFormProps,
  render: function RenderDeleteForm({ form, label, variant }) {
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
            <form.SubmitButton label={label} variant={variant} />
          </form.AppForm>
        </Field>
      </form>
    );
  },
});

export default ButtonForm;
