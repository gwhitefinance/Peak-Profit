import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { PlusCircle, BookOpen, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Whiteboard from '@/components/Whiteboard';

interface JournalEntry {
  id: number;
  created_at: string;
  title: string;
  content: string;
}

export default function TradeJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trade_journals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch journal entries.');
      console.error(error);
    } else {
      setEntries(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error: insertError } = await supabase
      .from('trade_journals')
      .insert([{ title, content }]); // User ID logic has been removed

    if (insertError) {
      toast.error('Failed to save journal entry.');
      console.error(insertError);
    } else {
      toast.success('Journal entry saved!');
      setTitle('');
      setContent('');
      setIsFormOpen(false);
      fetchEntries(); // Refresh the list
    }
  };

  const handleDelete = async (entryId: number) => {
    if (confirm('Are you sure you want to delete this entry?')) {
        const { error } = await supabase
        .from('trade_journals')
        .delete()
        .eq('id', entryId);

      if (error) {
        toast.error('Failed to delete entry.');
      } else {
        toast.success('Entry deleted.');
        fetchEntries();
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          title="Trade Journal"
          subtitle="Log your trades, review your performance, and refine your strategy."
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-screen-lg mx-auto">
            <div className="mb-8">
              <Whiteboard />
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen />
                My Journal
              </h2>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> New Entry
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a New Journal Entry</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      placeholder="Trade Title (e.g., 'TSLA Breakout')"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                    <Textarea
                      placeholder="Jot down your thoughts, strategy, and outcome..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={6}
                      required
                    />
                    <Button type="submit" className="w-full">Save Entry</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-6">
              {loading && <p>Loading entries...</p>}
              {!loading && entries.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">You have no journal entries yet.</p>
                  <p className="text-sm text-muted-foreground">Click "New Entry" to get started!</p>
                </div>
              )}
              {entries.map((entry) => (
                <div key={entry.id} className="bg-card border rounded-lg p-6 relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-red-500"
                    onClick={() => handleDelete(entry.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                  <h3 className="text-xl font-semibold mb-2">{entry.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    {new Date(entry.created_at).toLocaleString()}
                  </p>
                  <p className="text-muted-foreground whitespace-pre-wrap mb-4">{entry.content}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}