export const AI_MAX_TOKENS = 700;
export const AI_TEMPERATURE = 0.2;
export const AGENT_PROMPT = 'You are a medical assistant that maps clinical indications to ICD-10 codes.';
export const MAPPING_PROMPT = `For the indications below, return a JSON array of {"indication": string, "icd10": [strings]}. Use ["N/A"] if unmappable. Map synonyms. JSON only. Indications:`;