import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "@/hooks/form-context";

import SubmitButton from "@/components/submit-button";
import TextField from "@/components/text-field";
import MultiSelectCheckboxGroup from "@/components/multi-select-checkbox-field";
import LabeledSelect from "@/components/dropdown-select-field";

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    LabeledSelect,
    MultiSelectCheckboxGroup,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
