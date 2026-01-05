import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Loader2, Trash2, Eye } from 'lucide-react';

export default function TranslationHistory() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [translations, setTranslations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadTranslations();
    }
  }, [user]);

  const loadTranslations = async () => {
    try {
      const { data, error } = await supabase
        .from('translation_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTranslations(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: "فشل تحميل سجل الترجمات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('translation_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTranslations(translations.filter((t) => t.id !== id));
      toast({
        title: "تم الحذف",
        description: "تم حذف الترجمة بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">سجل الترجمات</CardTitle>
            <CardDescription>جميع الترجمات التي قمت بها</CardDescription>
          </CardHeader>
          <CardContent>
            {translations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">لا توجد ترجمات بعد</p>
                <Button className="mt-4" onClick={() => navigate('/')}>
                  ابدأ الترجمة الآن
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>اللغة المصدر</TableHead>
                    <TableHead>اللغات الهدف</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {translations.map((translation) => (
                    <TableRow key={translation.id}>
                      <TableCell>
                        {new Date(translation.created_at).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{translation.source_lang}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {translation.target_langs.map((lang: string, idx: number) => (
                            <Badge key={idx} variant="secondary">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh]">
                              <DialogHeader>
                                <DialogTitle>عرض الكود</DialogTitle>
                              </DialogHeader>
                              <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
                                <pre className="text-sm">
                                  <code>{translation.source_code}</code>
                                </pre>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(translation.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
