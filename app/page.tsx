'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader as Loader2, Sparkles, Copy, CheckCheck, Zap, TrendingUp, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PostDraft {
  title: string;
  content: string;
}

export default function Home() {
  const [inputType, setInputType] = useState<'paste' | 'profile'>('paste');
  const [posts, setPosts] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [drafts, setDrafts] = useState<PostDraft[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    const content = inputType === 'paste' ? posts : linkedinUrl;

    if (!content.trim()) {
      toast({
        title: 'Input required',
        description: inputType === 'paste'
          ? 'Please paste your LinkedIn posts first'
          : 'Please enter your LinkedIn profile URL',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setDrafts([]);

    try {
      if (inputType === 'profile') {
        toast({
          title: 'Profile Analysis',
          description: 'Direct LinkedIn scraping requires authentication. Please use the paste option instead.',
        });
        setLoading(false);
        setInputType('paste');
        return;
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          posts: content,
          inputType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate posts');
      }

      setDrafts(data.drafts);
      toast({
        title: 'Success!',
        description: `Generated ${data.drafts.length} post ideas for you`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      toast({
        title: 'Copied!',
        description: 'Post content copied to clipboard',
      });
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">AI-Powered Content Generation</span>
          </div>
          <h1 className="text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">
            LinkedIn Post Copilot
          </h1>
          <p className="text-2xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
            Transform your writing style into viral posts about <span className="font-semibold text-blue-600">Cloud Automotive SaaS</span>
          </p>
          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Workshop Management</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span>Fleet Telematics</span>
            </div>
            <span>•</span>
            <span>Predictive Maintenance</span>
          </div>
        </div>

        <Card className="shadow-2xl border-slate-200 bg-white/80 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Generate Your Next Post</CardTitle>
            <CardDescription className="text-base">
              Paste your recent posts to analyze your style
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={inputType} onValueChange={(value) => setInputType(value as 'paste' | 'profile')}>
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="paste" className="text-base">Paste Posts</TabsTrigger>
                <TabsTrigger value="profile" className="text-base">LinkedIn Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="paste" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Paste your last 3-5 LinkedIn posts here
                  </label>
                  <Textarea
                    placeholder="Copy and paste your recent LinkedIn posts here... Separate each post using numbers like: 1--> [Post 1 content] 2--> [Post 2 content] 3--> [Post 3 content]"
                    value={posts}
                    onChange={(e) => setPosts(e.target.value)}
                    className="min-h-[240px] text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 rounded-lg space-y-2">
                    <p className="text-sm text-blue-900 font-medium">
                      <strong>Format:</strong> Separate posts with numbering: 1--&gt; Post content here 2--&gt; Next post 3--&gt; Another post
                    </p>
                    <p className="text-sm text-slate-700">
                      <strong>Topics:</strong> Cloud workshop management, fleet telematics, predictive maintenance, connected vehicles, automotive IoT
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Tip: Include your most engaging posts to capture your best style
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="profile" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Enter your LinkedIn profile URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.linkedin.com/in/yourprofile"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800">
                      <strong>Note:</strong> Direct LinkedIn profile scraping requires authentication.
                      We recommend using the "Paste Posts\" option for now.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Style & Trends...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate New Post Ideas
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {drafts.length > 0 && (
          <div className="mt-16 space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-slate-900 mb-3">Your Generated Posts</h2>
              <p className="text-lg text-slate-600">Ready to copy and share on LinkedIn</p>
            </div>

            <div className="grid gap-6">
              {drafts.map((draft, index) => (
                <Card key={index} className="shadow-xl border-slate-200 hover:shadow-2xl transition-all hover:scale-[1.01] bg-white/90 backdrop-blur">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-sm px-3 py-1 bg-blue-100 text-blue-700">
                          Post {index + 1}
                        </Badge>
                        <CardTitle className="text-xl font-semibold">{draft.title}</CardTitle>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(draft.content, index)}
                        className="gap-2 hover:bg-blue-50 border-blue-300 hover:border-blue-500"
                      >
                        {copiedIndex === index ? (
                          <>
                            <CheckCheck className="h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-slate max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-base text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                        {draft.content}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!loading && drafts.length === 0 && (
          <div className="mt-16 space-y-8">
            <div className="text-center text-slate-500">
              <p className="text-xl font-light">
                Enter your posts above and click generate to get started
              </p>
            </div>

            <Card className="bg-gradient-to-br from-blue-50 to-slate-50 border-blue-300 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                  Quick Setup Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <h3 className="font-bold text-slate-900 mb-3 text-lg">1. Get Your Free API Key</h3>
                  <p className="text-base text-slate-700 mb-3">
                    Choose one provider for AI generation:
                  </p>
                  <ul className="list-none text-base text-slate-600 space-y-2 ml-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">→</span>
                      <div>
                        <strong className="text-slate-900">Hugging Face</strong> (Recommended):
                        <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1 font-medium">
                          Get free token
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">→</span>
                      <div>
                        <strong className="text-slate-900">Groq</strong> (Alternative):
                        <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1 font-medium">
                          Get free key
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-3 text-lg">2. Add to Environment Variables</h3>
                  <p className="text-base text-slate-700 mb-3">
                    Open your <code className="bg-slate-200 px-2 py-1 rounded text-sm">.env</code> file and add your key:
                  </p>
                  <div className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm font-mono shadow-inner">
                    HUGGINGFACE_API_KEY=hf_your_token_here
                    <br />
                    <span className="text-slate-500"># or</span>
                    <br />
                    GROQ_API_KEY=gsk_your_key_here
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-3 text-lg">3. Restart & Generate</h3>
                  <p className="text-base text-slate-700">
                    Restart the dev server. The app will auto-detect your API key and you're ready to generate amazing LinkedIn posts!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
