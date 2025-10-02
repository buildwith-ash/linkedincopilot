'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader as Loader2, Sparkles, Copy, CheckCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
            LinkedIn Post Copilot
            <Sparkles className="text-blue-600 h-10 w-10" />
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Turn your style + trending SaaS topics into viral LinkedIn content
          </p>
        </div>

        <Card className="shadow-xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-2xl">Generate Your Next Post</CardTitle>
            <CardDescription>
              Choose how you'd like to provide your writing style
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={inputType} onValueChange={(value) => setInputType(value as 'paste' | 'profile')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="paste">Paste Posts</TabsTrigger>
                <TabsTrigger value="profile">LinkedIn Profile</TabsTrigger>
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
                    className="min-h-[200px] text-base"
                  />
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                      <strong>Format:</strong> Separate posts with numbering: 1--&gt; Post content here 2--&gt; Next post 3--&gt; Another post
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
              className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
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
          <div className="mt-12 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Your Generated Posts</h2>
              <p className="text-slate-600">Ready to copy and share on LinkedIn</p>
            </div>

            <div className="grid gap-6">
              {drafts.map((draft, index) => (
                <Card key={index} className="shadow-lg border-slate-200 hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-sm">
                          Post {index + 1}
                        </Badge>
                        <CardTitle className="text-lg">{draft.title}</CardTitle>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(draft.content, index)}
                        className="gap-2"
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
                      <pre className="whitespace-pre-wrap font-sans text-base text-slate-700 leading-relaxed">
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
          <div className="mt-12 text-center text-slate-500">
            <p className="text-lg">
              Enter your posts above and click generate to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
