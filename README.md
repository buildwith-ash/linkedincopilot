LinkedIn Post Copilot 🚀

Turn your writing style + trending SaaS topics into viral LinkedIn content using AI.

## 🎯 About the Project

LinkedIn Post Copilot is an MVP tool designed to help professionals generate engaging LinkedIn posts that match their unique writing style. By analyzing your previous posts and combining them with trending topics in Cloud Automotive SaaS, the tool creates authentic, ready-to-publish content that sounds like you.

### ✨ Key Features

- **Dual AI Support**: Works with both Groq (Mixtral-8x7b) OR Hugging Face models
- **Style Analysis**: Analyzes your LinkedIn posts to match your writing style perfectly
- **Post Numbering Support**: Easy post separation using format: 1--> post 2--> post 3--> post
- **Trend Integration**: Auto-fetches trending topics from Google News in Cloud Automotive SaaS
- **3 Post Variations**: Get 3 different post drafts to choose from
- **One-Click Copy**: Easy copy-to-clipboard functionality
- **Responsive Design**: Beautiful UI that works on all devices

---

## 🚀 Quick Start Guide

### Step 1: Get Your API Key

You need **EITHER** a Groq API key **OR** a Hugging Face token (you don't need both):

#### Option A: Groq API (Recommended - Faster)
1. Go to [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign up for a free account
3. Create a new API key
4. Copy the key

#### Option B: Hugging Face API
1. Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Sign up/login
3. Create a new access token (select "Read" access)
4. Copy the token

### Step 2: Configure Environment

1. Open the `.env` file in the project root
2. Add your API key:

**If using Groq:**
```
GROQ_API_KEY=gsk_your_actual_groq_key_here
HUGGINGFACE_API_KEY=your_huggingface_token_here
```

**If using Hugging Face:**
```
GROQ_API_KEY=your_groq_api_key_here
HUGGINGFACE_API_KEY=hf_your_actual_token_here
```

**Important:** The app will automatically use Groq if available, otherwise it will fall back to Hugging Face.

### Step 3: Install Dependencies (if needed)

```bash
npm install
```

### Step 4: Run the Application

The dev server is already running! Just refresh your browser or visit:
```
http://localhost:3000
```

---

## 📝 How to Use

### Formatting Your LinkedIn Posts

**IMPORTANT:** When pasting your LinkedIn posts, separate them using numbers with arrows:

```
1--> Here is my first LinkedIn post about cloud technology.
I love working with SaaS platforms because they scale well.
What do you think?

2--> My second post talks about automotive innovation.
The future of connected vehicles is here.
Excited to be part of this journey!

3--> Third post about digital transformation.
Cloud-based solutions are revolutionizing the industry.
Let's connect and discuss!
```

**Format Rules:**
- Use `1-->` before your first post
- Use `2-->` before your second post
- Use `3-->` before your third post (and so on)
- Include 3-5 posts for best results
- Don't worry about spacing - the AI will handle it

### Step-by-Step Usage

1. **Paste Your Posts**
   - Go to your LinkedIn profile
   - Copy 3-5 of your recent posts
   - Paste them in the text area with numbering (1--> 2--> 3-->)

2. **Generate Content**
   - Click "Generate New Post Ideas"
   - Wait 10-20 seconds for AI processing

3. **Review & Copy**
   - Review the 3 generated drafts
   - Click "Copy" on your favorite one
   - Paste into LinkedIn and publish!

---

## 🛠️ Technical Stack

- **Frontend**: Next.js 13 (App Router), React, TypeScript
- **UI**: shadcn/ui (Radix UI + Tailwind CSS)
- **AI Models**:
  - Groq API (Mixtral-8x7b-32768)
  - Hugging Face (Mixtral-8x7B-Instruct-v0.1)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data Source**: Google News RSS Feed

---

## 📂 Project Structure

```
linkedin-post-copilot/
├── app/
│   ├── page.tsx              # Main UI component
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── pages/
│   └── api/
│       ├── generate.js       # Post generation (Groq + HF)
│       └── analyze-profile.js # Profile analysis
├── components/
│   └── ui/                   # shadcn/ui components
├── hooks/
│   └── use-toast.ts          # Toast notifications
├── .env                      # Environment variables
├── .env.local.example        # Example env file
└── README.md                 # This file
```

---

## 🔧 Troubleshooting

### "No API key configured" Error
- Open `.env` file
- Add your API key (either GROQ_API_KEY or HUGGINGFACE_API_KEY)
- Restart the dev server

### "Failed to generate posts" Error
- Check your API key is valid
- Ensure you have internet connection
- Try the other AI provider (Groq vs Hugging Face)
- Check the browser console for specific errors

### "Invalid JSON" Error
- Make sure you're using the post numbering format: 1--> 2--> 3-->
- Include at least 3 posts
- The AI will still try to generate posts even if format is slightly off

### Posts Look Generic
- Include more sample posts (5+ is ideal)
- Use your most engaging posts
- Make sure posts have consistent style
- Try adjusting the posts to be more specific

---

## 🎯 Tips for Best Results

1. **Quality Samples**: Use your most engaging, well-written posts
2. **Consistent Voice**: Use posts from the same time period
3. **Enough Context**: 3-5 posts minimum, 5-7 ideal
4. **Proper Formatting**: Use the 1--> 2--> 3--> format
5. **Edit Before Posting**: Always personalize AI-generated content
6. **Test Both APIs**: Try both Groq and Hugging Face to see which works better

---

## 🔮 Future Enhancements

### Short-Term (Next 2-4 weeks)
- [ ] Save favorite posts to database (Supabase)
- [ ] Multiple industry/topic selection
- [ ] Post length preferences (short/medium/long)
- [ ] User style profiles
- [ ] More AI model options (GPT-4, Claude, etc.)

### Medium-Term (1-3 months)
- [ ] LinkedIn OAuth for auto-fetching posts
- [ ] Post scheduling
- [ ] A/B testing for variations
- [ ] Analytics dashboard
- [ ] Hashtag suggestions
- [ ] Image recommendations

### Long-Term (3-6 months)
- [ ] Multi-language support
- [ ] Twitter/X integration
- [ ] Team collaboration
- [ ] Post template library
- [ ] Engagement tracking
- [ ] One-click publish to LinkedIn
- [ ] Content calendar

---

## ⚙️ API Comparison

| Feature | Groq | Hugging Face |
|---------|------|--------------|
| Speed | ⚡ Very Fast (1-3s) | 🐢 Slower (10-20s) |
| Quality | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Very Good |
| Free Tier | ✅ Generous | ✅ Limited |
| Rate Limits | High | Medium |
| Setup | Easy | Easy |
| **Recommendation** | **Use Groq if possible** | Backup option |

---

## 🐛 Known Limitations

1. **Direct LinkedIn Scraping**: Not supported due to authentication requirements
2. **API Rate Limits**: Free tiers have limits (Groq: 30 req/min, HF: varies)
3. **Topic Focus**: Currently optimized for Cloud Automotive SaaS
4. **No Auto-Posting**: Manual copy-paste required
5. **Model Loading**: Hugging Face may have cold start delays (20-30s first time)

---

## 🔒 Privacy & Security

- Your posts are sent to AI APIs for processing only
- No data is stored permanently (unless you configure Supabase)
- API keys are stored locally in .env file
- Never commit .env file to version control
- Always review generated content before posting

---

## 📄 License

MIT License - free for personal and commercial use

---

## 🆘 Support

Having issues? Here's how to get help:

1. Check this README thoroughly
2. Look at the browser console for errors (F12)
3. Verify your API key is correct
4. Try the other AI provider
5. Check that you're using the 1--> 2--> 3--> format

---

## 🎓 Example Usage

### Input (Your Posts):
```
1--> Just launched our new cloud-based automotive platform! 🚗
The future of connected vehicles is here.
Proud of what our team has built.

2--> SaaS solutions are transforming the automotive industry.
Scalability, flexibility, and innovation combined.
Who else is working in this space?

3--> Digital transformation isn't optional anymore.
It's essential for survival in automotive tech.
What's your take on this?
```

### Output (Generated Posts):
The AI will create 3 new posts matching your style, incorporating trending topics in Cloud Automotive SaaS.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI by [shadcn/ui](https://ui.shadcn.com/)
- AI by [Groq](https://groq.com/) and [Hugging Face](https://huggingface.co/)
- Icons from [Lucide](https://lucide.dev/)

---

## 🚀 Ready to Get Started?

1. ✅ Add your API key to `.env`
2. ✅ Format your posts with 1--> 2--> 3-->
3. ✅ Generate amazing content!

**Happy posting!** 🎉

---

Made with ❤️ for the LinkedIn community
#   l i n k e d i n c o p i l o t 
 
 #   l i n k e d i n c o p i l o t 
 
 #   l i n k e d i n c o p i l o t 
 
 #   l i n k e d i n c o p i l o t 
 
 
