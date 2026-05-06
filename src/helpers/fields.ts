import { createFieldMap } from "@tanstack/react-form";
import {
  passwordDefaultValues,
  registrationDefaultValues,
} from "@/helpers/defaults";

export const passwordFields = createFieldMap(passwordDefaultValues);
export const registrationFields = createFieldMap(registrationDefaultValues);
