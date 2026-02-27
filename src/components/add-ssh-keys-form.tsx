import { withForm } from "@/hooks/form"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"

const AddSshKeyForm = withForm({
  defaultValues: {
    sshKey: "",
  },
  render: function Render({ form }) {
    return (
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
                placeholder="ssh-ed25519 AAAA... comment"
                rows={6}
              />
            )}
          </form.Field>
        </div>

        <Button className="mb-4" type="submit">
          Submit Key
        </Button>
      </form>
    )
  },
})

export default AddSshKeyForm