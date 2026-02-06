/**
 * Extracts all unique {{variable}} placeholders from a text string.
 */
export const extractVariables = (text: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = [...text.matchAll(regex)];
    const variables = matches.map(match => match[1].trim());
    return [...new Set(variables)]; // Return unique variables
};

/**
 * Injects variable values into the template text.
 */
export const injectVariables = (text: string, values: Record<string, string>): string => {
    let result = text;
    Object.entries(values).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
        result = result.replace(regex, value);
    });
    return result;
};
