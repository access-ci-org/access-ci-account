import { withForm } from "@/hooks/form";

const AddSshKeyForm = withForm({
  defaultValues: {
    sshKey: "",
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
              Please paste your SSH public key below to add it to your ACCESS
              account.
            </p>

            <form.AppField name="sshKey">
              {(field) => (
                <field.TextField
                  label="Public SSH key"
                  placeholder="Begins with 'ssh-rsa', 'ssh-dss', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521', or 'ssh-ed25519'"
                  required
                  fieldType="textarea"
                  rows={6}
                />
              )}
            </form.AppField>
          </div>

          <div className="mt-4 mb-4">
            <form.SubmitButton label="Add Key" />
          </div>
        </form>
      </form.AppForm>
    );
  },
});

export default AddSshKeyForm;
