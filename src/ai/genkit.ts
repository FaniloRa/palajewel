import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-ai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
