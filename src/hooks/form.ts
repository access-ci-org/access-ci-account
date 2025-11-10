import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "@/hooks/form-context";

import SubmitButton from "@/components/submit-button";
import TextField from "@/components/text-field";
import OTPField from "@/components/otp-field";

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    OTPField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
