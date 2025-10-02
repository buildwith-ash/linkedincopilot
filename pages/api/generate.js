async function fetchTrendingTopics() {
  try {
    const rssUrl = 'https://news.google.com/rss/search?q=cloud+automotive+workshop+SaaS+software+connected+vehicles+fleet+management&hl=en-US&gl=US&ceid=US:en';
    const response = await fetch(rssUrl);
    const xmlText = await response.text();

    const headlines = xmlText
      .match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g)
      ?.slice(1, 6)
      .map(match => match.replace(/<title><!\[CDATA\[/, '').replace(/\]\]><\/title>/, ''))
      .join('\n') || 'Cloud-based automotive workshop management, Fleet telematics integration, Predictive maintenance for vehicles';

    return headlines.substring(0, 500);
  } catch (error) {
    console.error('Error fetching trends:', error);
    return 'Cloud-based automotive workshop management software, Fleet telematics integration, Predictive maintenance for vehicles, Connected vehicle platforms, Digital transformation in automotive service industry, IoT-enabled automotive diagnostics';
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
5. Focus on Cloud-based Automotive Software topics: workshop management systems, fleet telematics, predictive maintenance, connected vehicles, IoT diagnostics, and automotive SaaS platforms
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
  const HF_API_URL = 'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct';

  const prompt = `You are a LinkedIn content expert specializing in cloud automotive software, fleet management, and workshop management systems.

Based on these sample posts, generate 3 new LinkedIn posts about Cloud Automotive SaaS topics including workshop management, fleet telematics, predictive maintenance, and connected vehicle platforms.

Sample Posts:
${posts}

Trending Topics:
${trendingTopics}

Generate 3 unique, engaging LinkedIn posts in the same style and tone as the sample posts. Each post should focus on cloud-based automotive software solutions.

Return ONLY a valid JSON array with this exact format:
[
  {"title": "Cloud Workshop Management", "content": "Your first post content here..."},
  {"title": "Fleet Telematics Integration", "content": "Your second post content here..."},
  {"title": "Predictive Maintenance", "content": "Your third post content here..."}
]`;

  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 1500,
        temperature: 0.7,
        top_p: 0.9,
        return_full_text: false,
        do_sample: true,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
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
    console.log('Failed to parse JSON, creating fallback posts');
    drafts = [
      {
        title: 'Cloud-Based Workshop Management',
        content: `The automotive service industry is being transformed by cloud technology. Workshop management systems now offer real-time scheduling, inventory tracking, and seamless customer communication—all from a single platform.

This isn't just about going digital; it's about predictive maintenance, reduced downtime, and better customer experiences.

What's your take on cloud adoption in automotive workshops?`,
      },
      {
        title: 'Fleet Telematics & IoT Integration',
        content: `Connected vehicles are generating massive amounts of data. The question isn't whether to collect it—it's how to turn that data into actionable insights.

Modern fleet management platforms integrate telematics with workshop systems, enabling predictive alerts before breakdowns happen.

The result? 30% reduction in unplanned downtime and significant cost savings.`,
      },
      {
        title: 'The Future of Automotive SaaS',
        content: `Software-as-a-Service is revolutionizing how automotive businesses operate. From small garages to enterprise fleet operations, cloud platforms are enabling:

• Real-time diagnostics
• Automated parts ordering
• Customer self-service portals
• AI-driven maintenance scheduling

The automotive industry is no longer just about fixing cars—it's about smart, connected service ecosystems.`,
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

    if (hasHFKey) {
      drafts = await generateWithHuggingFace(parsedPosts, trendingTopics, inputType);
      apiUsed = 'Hugging Face (Meta-Llama-3-8B)';
    } else if (hasGroqKey) {
      drafts = await generateWithGroq(parsedPosts, trendingTopics, inputType);
      apiUsed = 'Groq (Mixtral-8x7b)';
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
