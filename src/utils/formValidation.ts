export const validateFormFields = (formData: Record<string, unknown>, excludedFields: string[] = ['country', 'state', 'city']) => {
  for (const [key, value] of Object.entries(formData)) {
    if (excludedFields.includes(key)) {
      continue;
    }

    if (value === null || value === undefined || value === '') {
      return false;
    }

    if (Array.isArray(value) && value.length === 0) {
      return false;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      if (!validateFormFields(value, excludedFields)) {
        return false;
      }
    }
  }
  return true;
};

export const getFormValidationMessage = (formType: string) => {
  return {
    title: "Required Fields Missing",
    description: `Please fill in all required fields in the ${formType} form before proceeding.`,
    variant: "destructive" as const
  };
};
