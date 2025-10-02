async function fetchTrendingTopics() {
  try {
    const rssUrl = 'https://news.google.com/rss/search?q=cloud+automotive+workshop+SaaS+software&hl=en-US&gl=US&ceid=US:en';
    const response = await fetch(rssUrl);
    const xmlText = await response.text();

    const headlines = xmlText
      .match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g)
      ?.slice(1, 6)
      .map(match => match.replace(/<title><!\[CDATA\[/, '').replace(/\]\]><\/title>/, ''))
      .join('\n') || 'Cloud-based automotive SaaS solutions';

    return headlines.substring(0, 500);
  } catch (error) {
    console.error('Error fetching trends:', error);
    return 'Cloud-based automotive SaaS solutions, digital transformation in automotive industry, connected vehicle platforms';
  }
}

function parseUserPosts(postsText) {
  const posts = postsText
    .split(/\d+\s*-->/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return posts.join('\n\n--- Post Separator ---\n\n');
}

async function generateWithGroq(posts, trendingTopics, inputType) {
  const Groq = (await import('groq-sdk')).default;

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const userPrompt = `I need you to generate 3 powerful LinkedIn post drafts based on the following:

STYLE REFERENCE (User's ${inputType === 'profile' ? 'LinkedIn profile' : 'recent'} posts):
${posts}

TRENDING TOPICS IN CLOUD AUTOMOTIVE SAAS:
${trendingTopics}

INSTRUCTIONS:
Generate 3 LinkedIn post drafts that:
1. Match the EXACT style, tone, and voice of the reference posts above
2. Respect the same emoji usage patterns (or lack thereof)
3. Follow similar formatting (paragraphs, spacing, line breaks)
4. Maintain similar length and structure
5. Focus on Cloud-based Automotive SaaS topics from the trending headlines
6. Sound authentic, professional, and engaging
7. Are ready to post (complete, polished drafts)

Format your response as JSON array with this structure:
[
  {
    "title": "Brief topic (3-5 words)",
    "content": "Full post content with proper formatting and emojis"
  }
]

Make each post unique and valuable. Ensure they sound like they were written by the same person who wrote the reference posts.`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that generates authentic LinkedIn posts. You analyze writing style carefully and create posts that match the user\'s voice perfectly. Always return valid JSON.',
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    model: 'mixtral-8x7b-32768',
    temperature: 0.8,
    max_tokens: 2500,
  });

  const responseText = completion.choices[0]?.message?.content || '';

  let drafts;
  try {
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      drafts = JSON.parse(jsonMatch[0]);
    } else {
      drafts = JSON.parse(responseText);
    }
  } catch (parseError) {
    const sections = responseText.split(/\n\n(?=Post [123]|Draft [123]|\d\.)/);
    drafts = sections.slice(0, 3).map((section, idx) => ({
      title: `Post Idea ${idx + 1}`,
      content: section.trim(),
    }));
  }

  return drafts;
}

async function generateWithHuggingFace(posts, trendingTopics, inputType) {
  const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1';

  const prompt = `<s>[INST] You are a LinkedIn content expert. Based on these sample posts, generate 3 new LinkedIn posts about Cloud Automotive SaaS topics.

Sample Posts:
${posts}

Trending Topics:
${trendingTopics}

Generate 3 posts in the same style. Return ONLY a valid JSON array like this:
[{"title": "Topic 1", "content": "Post 1 content"}, {"title": "Topic 2", "content": "Post 2 content"}, {"title": "Topic 3", "content": "Post 3 content"}]
[/INST]`;

  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 2000,
        temperature: 0.8,
        top_p: 0.95,
        return_full_text: false,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.status}`);
  }

  const result = await response.json();

  let generatedText = '';
  if (Array.isArray(result) && result[0]?.generated_text) {
    generatedText = result[0].generated_text;
  } else if (result.generated_text) {
    generatedText = result.generated_text;
  } else {
    throw new Error('Unexpected response format from Hugging Face');
  }

  let drafts;
  try {
    const jsonMatch = generatedText.match(/\[[\s\S]*?\{[\s\S]*?"title"[\s\S]*?"content"[\s\S]*?\}[\s\S]*?\]/);
    if (jsonMatch) {
      drafts = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No JSON found in response');
    }
  } catch (parseError) {
    drafts = [
      {
        title: 'AI-Generated Post 1',
        content: generatedText.substring(0, 300),
      },
      {
        title: 'AI-Generated Post 2',
        content: 'Based on your style, here\'s a suggested post about cloud automotive solutions...',
      },
      {
        title: 'AI-Generated Post 3',
        content: 'Leveraging SaaS technology in the automotive industry...',
      },
    ];
  }

  return drafts.slice(0, 3);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { posts, inputType } = req.body;

  if (!posts || posts.trim().length === 0) {
    return res.status(400).json({ error: 'Posts content is required' });
  }

  const hasGroqKey = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here';
  const hasHFKey = process.env.HUGGINGFACE_API_KEY && process.env.HUGGINGFACE_API_KEY !== 'your_huggingface_token_here';

  if (!hasGroqKey && !hasHFKey) {
    return res.status(500).json({
      error: 'No API key configured. Please add GROQ_API_KEY or HUGGINGFACE_API_KEY to .env file.',
      setup: 'Get Groq key from https://console.groq.com/keys or HuggingFace token from https://huggingface.co/settings/tokens'
    });
  }

  try {
    const trendingTopics = await fetchTrendingTopics();
    const parsedPosts = parseUserPosts(posts);

    let drafts;
    let apiUsed;

    if (hasGroqKey) {
      drafts = await generateWithGroq(parsedPosts, trendingTopics, inputType);
      apiUsed = 'Groq (Mixtral-8x7b)';
    } else {
      drafts = await generateWithHuggingFace(parsedPosts, trendingTopics, inputType);
      apiUsed = 'Hugging Face (Mixtral)';
    }

    return res.status(200).json({
      success: true,
      drafts: drafts,
      trendingTopics: trendingTopics,
      apiUsed: apiUsed,
    });
  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate posts',
      details: error.message,
    });
  }
}
