// Service for fetching news headlines using Gemini API
import { auditLogger } from './auditService';

// Gemini API key
const GEMINI_API_KEY = "AIzaSyCca5SJQ6jnzAT9Ni7wThTVFKN_EJbIEds";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const fetchRealEstateNews = async (): Promise<string[]> => {
  try {
    // Log the API request for auditing
    await auditLogger.logGenericEvent('API Request', 'Gemini API - Real Estate News');
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate 3 short, single-line headlines about the latest real estate market trends in India. 
            Each headline should be factual, concise (under 120 characters), and include a specific data point or trend.
            Format as a JSON array of strings only, with no additional text or explanation.
            Example format: ["Headline 1", "Headline 2", "Headline 3"]`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    // Parse the JSON string from the response
    const headlinesText = data.candidates[0].content.parts[0].text.trim();
    let headlines: string[];
    
    try {
      // Extract the JSON array from the response text
      // This handles cases where the model might include additional text
      const jsonMatch = headlinesText.match(/\[.*\]/s);
      if (jsonMatch) {
        headlines = JSON.parse(jsonMatch[0]);
      } else {
        headlines = JSON.parse(headlinesText);
      }
      
      // Add emoji prefix to each headline
      return headlines.map(headline => `📈 ${headline}`);
    } catch (parseError) {
      console.error('Failed to parse headlines JSON:', parseError);
      return [
        '📈 India housing market sees 15% growth in Q2 2024, driven by strong demand in tier-2 cities',
        '📈 Average home loan interest rates stabilize at 8.5%, boosting affordable housing segment',
        '📈 Commercial real estate in Bengaluru records 40% increase in leasing activity year-over-year'
      ];
    }
  } catch (error: any) {
    // Handle rate limit (429) error more gracefully
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      console.warn('News API rate limit reached, using fallback headlines');
    } else {
      console.error('Error fetching real estate news:', error);
    }
    // Return fallback headlines if API call fails
    return [
      '📈 India housing market sees 15% growth in Q2 2024, driven by strong demand in tier-2 cities',
      '📈 Average home loan interest rates stabilize at 8.5%, boosting affordable housing segment',
      '📈 Commercial real estate in Bengaluru records 40% increase in leasing activity year-over-year'
    ];
  }
};
