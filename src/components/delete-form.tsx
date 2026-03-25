import { withForm } from "@/hooks/form";

type DeleteFormProps = {
  label?: string;
};

const DeleteForm = withForm({
  defaultValues: {
    id: 0,
  },
  props: {} as DeleteFormProps,
  render: function Render({ form, label }) {
    return (
      <form.AppForm>
        <form.SubmitButton label={label ?? "Delete"} />
      </form.AppForm>
    );
  },
});

export default DeleteForm;