import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Loader2, FileCode, Languages, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Statistics() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTranslations: 0,
    totalLanguages: 0,
    avgLanguagesPerTranslation: 0,
    languageBreakdown: [] as { language: string; count: number }[],
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadStatistics();
    }
  }, [user]);

  const loadStatistics = async () => {
    try {
      const { data, error } = await supabase
        .from('translation_history')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      const translations = data || [];
      const totalTranslations = translations.length;

      // Calculate language breakdown
      const langCount: { [key: string]: number } = {};
      let totalLangs = 0;

      translations.forEach((t) => {
        t.target_langs.forEach((lang: string) => {
          langCount[lang] = (langCount[lang] || 0) + 1;
          totalLangs++;
        });
      });

      const languageBreakdown = Object.entries(langCount)
        .map(([language, count]) => ({ language, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const uniqueLanguages = Object.keys(langCount).length;
      const avgLanguagesPerTranslation =
        totalTranslations > 0 ? (totalLangs / totalTranslations).toFixed(1) : '0';

      setStats({
        totalTranslations,
        totalLanguages: uniqueLanguages,
        avgLanguagesPerTranslation: parseFloat(avgLanguagesPerTranslation),
        languageBreakdown,
      });
    } catch (error: any) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">الإحصائيات</h1>
          <p className="text-muted-foreground">نظرة شاملة على نشاطك في الترجمة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الترجمات</CardTitle>
              <FileCode className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTranslations}</div>
              <p className="text-xs text-muted-foreground mt-1">عدد الترجمات الكلي</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">اللغات المستخدمة</CardTitle>
              <Languages className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLanguages}</div>
              <p className="text-xs text-muted-foreground mt-1">لغات فريدة</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">متوسط اللغات</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgLanguagesPerTranslation}</div>
              <p className="text-xs text-muted-foreground mt-1">لغة لكل ترجمة</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>أكثر اللغات استخداماً</CardTitle>
            <CardDescription>توزيع الترجمات حسب اللغة</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.languageBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.languageBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="language" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                لا توجد بيانات لعرضها
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
