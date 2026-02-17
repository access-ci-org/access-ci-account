import { atomWithStorage } from 'jotai/utils';

export type RegistrationData = {
    first_name: string;
    last_name: string;
    email: string;
    institution: number;
    academic_status: number;
    residence_country: number;
    citizenship_country: number[];
};

// Atom surives page refresh within the same tab
export const registrationDataAtom = atomWithStorage<RegistrationData | null>(
    'access.registrationData',
    null,
    undefined,
    { getOnInit: true }
);