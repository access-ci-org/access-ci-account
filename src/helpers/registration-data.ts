import { atomWithStorage } from 'jotai/utils';

export type RegistrationData = {
    first_name: string;
    last_name: string;
    email: string;
    institution: string;
    academic_status: string;
    residence_country: string;
    citizenship_country: string;
};

// Atom surives page refresh within the same tab
export const registrationDataAtom = atomWithStorage<RegistrationData | null>(
    'access.registrationData',
    null,
    undefined,
    { getOnInit: true }
);