import Groq from 'groq-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { linkedinUrl } = req.body;

  if (!linkedinUrl) {
    return res.status(400).json({ error: 'LinkedIn URL is required' });
  }

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `You are analyzing a LinkedIn profile URL: ${linkedinUrl}

Since we cannot directly scrape LinkedIn (requires authentication), provide a helpful response that:
1. Acknowledges the profile URL
2. Explains that direct LinkedIn scraping requires authentication
3. Suggests the user paste 3-5 of their recent posts instead

Keep it friendly and helpful. Format as JSON with fields: message, suggestion`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant for a LinkedIn content generation tool.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content || '';

    return res.status(200).json({
      success: true,
      message: 'LinkedIn profile analysis requires manual post input',
      details: responseText,
      suggestion: 'Please paste 3-5 of your recent LinkedIn posts to analyze your style',
    });
  } catch (error) {
    console.error('Profile analysis error:', error);
    return res.status(500).json({
      error: 'Failed to analyze profile',
      details: error.message,
    });
  }
}
