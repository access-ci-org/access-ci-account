import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "@/hooks/form-context";

import FieldCheckbox from "@/components/field-checkbox";
import FieldCheckboxes from "@/components/field-checkboxes";
import FieldOtp from "@/components/field-otp";
import FieldPassword from "@/components/field-password";
import FieldSelect from "@/components/field-select";
import FieldText from "@/components/field-text";
import SubmitButton from "@/components/submit-button";

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    FieldCheckbox,
    FieldCheckboxes,
    FieldOtp,
    FieldPassword,
    FieldSelect,
    FieldText,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
