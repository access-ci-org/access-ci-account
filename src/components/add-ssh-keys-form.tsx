import { withForm } from "@/hooks/form"
import { Textarea } from "./ui/textarea"

const AddSshKeyForm = withForm({
    defaultValues: {
        sshKey: "",
    },
    render: function Render({ form }) {
        return (
            <form.AppForm>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        void form.handleSubmit()
                    }}
                >
                    <div className="mb-4">
                        <p>Please paste your public SSH key below to add it to your ACCESS account.</p>

                        <form.Field name="sshKey">
                            {(field) => (
                                <Textarea
                                    value={field.state.value ?? ""}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    placeholder="Begins with 'ssh-rsa', 'ssh-dss', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521', or 'ssh-ed25519'"
                                    rows={6}
                                />
                            )}
                        </form.Field>
                    </div>

                    <div className="mt-4 mb-4">
                        <form.SubmitButton
                            label="Submit Key"
                        />
                    </div>

                </form>

            </form.AppForm>
        )
    },
})

export default AddSshKeyForm