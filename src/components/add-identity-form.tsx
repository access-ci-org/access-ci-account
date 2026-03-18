import { withForm } from "@/hooks/form";

const AddIdentityForm = withForm({
  defaultValues: {
    identity: "",
  },
  render: function Render({ form }) {
    return (
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <div className="mb-4">
            <p>
              Please enter your additional identity below to add it to your ACCESS
              account.
            </p>

            <form.AppField name="identity">
              {(field) => (
                <field.TextField
                  label="Identity"
                  placeholder="Enter your identity here."
                  required
                  fieldType="textarea"
                  rows={6}
                />
              )}
            </form.AppField>
          </div>

          <div className="mt-4 mb-4">
            <form.SubmitButton label="Submit Identity" />
          </div>
        </form>
      </form.AppForm>
    );
  },
});

export default AddIdentityForm;
