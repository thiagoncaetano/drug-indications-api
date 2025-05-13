//AI
export const AI_MAX_TOKENS = 700;
export const AI_TEMPERATURE = 0.2;
export const AGENT_PROMPT = 'You are a medical assistant that maps clinical indications to ICD-10 codes.';
export const MAPPING_PROMPT = `For the indications below, return a JSON array of {"indication": string, "icd10": [strings]}. Use ["N/A"] if unmappable. Map synonyms. JSON only. Indications:`;

//JWT
export const JWT_SECRET = process.env.JWT_SECRET || 'change-jwt-secret';
export const JWT_EXPIRES_IN = "24h"