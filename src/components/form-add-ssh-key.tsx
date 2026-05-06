import { isImpersonatingAtom } from "@/helpers/state";
import { withForm } from "@/hooks/form";
import { useAtomValue } from "jotai";

const FormAddSshKey = withForm({
  defaultValues: {
    sshKey: "",
  },
  render: function Render({ form }) {
    const isImpersonating = useAtomValue(isImpersonatingAtom);

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
                <field.FieldText
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
            <form.SubmitButton disabled={isImpersonating} label="Add Key" />
          </div>
        </form>
      </form.AppForm>
    );
  },
});

export default FormAddSshKey;
