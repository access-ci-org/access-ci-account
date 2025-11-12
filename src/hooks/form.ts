import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "@/hooks/form-context";

import SubmitButton from "@/components/submit-button";
import TextField from "@/components/text-field";
import OTPField from "@/components/otp-field";
import MultiSelectCheckboxGroup from "@/components/multi-select-checkbox-field";
import DropdownSelectField from "@/components/dropdown-select-field";

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    DropdownSelectField,
    MultiSelectCheckboxGroup,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
