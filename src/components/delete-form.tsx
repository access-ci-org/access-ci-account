// Recieves form component from row level
import { withForm } from "@/hooks/form";
import { Field } from "@/components/ui/field";

const DeleteForm = withForm({
  defaultValues: {
    id: 0, // hidden id field 
  },
  render: function RenderDeleteForm({ form }) {
    return (
      <form
        onSubmit={(e) => { // prevents default browser submission and uses custom 
          e.preventDefault(); 
          form.handleSubmit();
        }}
      >
        <form.AppField name="id">
          {(field) => (
            <input
              type="hidden"
              name={field.name}
              value={field.state.value}
              readOnly
            />
          )}
        </form.AppField>

        <Field orientation="horizontal">
          <form.AppForm>
            <form.SubmitButton label="Delete" />
          </form.AppForm>
        </Field>
      </form>
    );
  },
});

export default DeleteForm;