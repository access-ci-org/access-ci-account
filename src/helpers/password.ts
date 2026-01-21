import { MIN_LENGTH, MAX_LENGTH, MIN_CLASSES, MIN_CHARACTERS_PER_CLASS } from "@/config"

const CHARACTERS: string[] = [
    "abcdefghijklmnopqrstuvwxyz",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "0123456789",
    "! @#$%^&*()-_+={}[]|\\;:<>,./?"
  ];
  
  
  type PasswordPolicy = {
    minLength: number;
    maxLength: number;
    characterClasses: string[];
    minClasses: number;
    minCharactersPerClass: number;
  };
  
  const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
    minLength: MIN_LENGTH,
    maxLength: MAX_LENGTH,
    characterClasses: CHARACTERS,
    minClasses: MIN_CLASSES,
    minCharactersPerClass: MIN_CHARACTERS_PER_CLASS,
  };
  
  export function validatePassword(
    password: string,
    policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY,
  ): string[] {
    const errors: string[] = [];
  
    // Length rule: between min and max
    if (password.length < policy.minLength || password.length > policy.maxLength) {
      errors.push(
        `Your new password must be between ${policy.minLength} and ${policy.maxLength} characters in length.`,
      );
    }
  
    // Character class rule
    if (policy.minClasses > 0 && policy.minCharactersPerClass > 0) {
      // Convert password to a Set so duplicates are ignored
      const passwordSet = new Set([...password]);
  
      // Group characters into sets for each class (ie. lowercase, uppercase, etc.)
      const classSets = policy.characterClasses.map((chars) => new Set([...chars]));
      
      // Count how many characters from the password are in each specific class
      const charsPerSet = classSets.map((classSet) => {
        let count = 0;
        for (const ch of passwordSet) {
          if (classSet.has(ch)) count += 1;
        }
        return count;
      });
  
      // Count how many character classes meet the minimum requirement
      const validSets = charsPerSet.filter((n) => n >= policy.minCharactersPerClass)
        .length;
  
      if (validSets < policy.minClasses) {
        errors.push(
          "Your new password must include characters from three of the following: lowercase letters, uppercase letters, numbers, and symbols.",
        );
      }
    }
  
    return errors;
  }
  