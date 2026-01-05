import { Moon, Sun, Languages, MoreVertical, User, History, BarChart3, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { LANGUAGES, type LanguageCode } from '@/components/LanguageSelector';
import { translations } from '@/lib/translations';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import logo from '@/assets/zas-logo.png';

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const t = translations.nav[language];
  const policies = translations.policies[language];
  const [openPolicy, setOpenPolicy] = useState<string | null>(null);

  const currentLanguage = LANGUAGES.find((lang) => lang.code === language);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={logo} alt="ZAS Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold gradient-text">ZAS</h1>
        </Link>

        <div className="flex items-center gap-2">
          <Dialog open={openPolicy !== null} onOpenChange={(open) => !open && setOpenPolicy(null)}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setOpenPolicy('terms')}>
                  {policies.termsOfUse}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenPolicy('privacy')}>
                  {policies.privacyPolicy}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenPolicy('data')}>
                  {policies.dataRetention}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {openPolicy === 'terms' && policies.termsOfUse}
                  {openPolicy === 'privacy' && policies.privacyPolicy}
                  {openPolicy === 'data' && policies.dataRetention}
                  {openPolicy === 'howItWorks' && translations.howItWorks[language].title}
                </DialogTitle>
                <DialogDescription className="text-base leading-relaxed pt-4 space-y-4">
                  {openPolicy === 'terms' && policies.termsOfUseContent}
                  {openPolicy === 'privacy' && policies.privacyPolicyContent}
                  {openPolicy === 'data' && policies.dataRetentionContent}
                  {openPolicy === 'howItWorks' && (
                    <div className="space-y-4">
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-2">{translations.howItWorks[language].step1}</h4>
                        <p>{translations.howItWorks[language].step1Details}</p>
                      </div>
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-2">{translations.howItWorks[language].step2}</h4>
                        <p>{translations.howItWorks[language].step2Details}</p>
                      </div>
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-2">{translations.howItWorks[language].step3}</h4>
                        <p>{translations.howItWorks[language].step3Details}</p>
                      </div>
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-2">{translations.howItWorks[language].step4}</h4>
                        <p>{translations.howItWorks[language].step4Details}</p>
                      </div>
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-2">{translations.howItWorks[language].step5}</h4>
                        <p>{translations.howItWorks[language].step5Details}</p>
                      </div>
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as LanguageCode)}
                  className={language === lang.code ? 'bg-accent' : ''}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {user.email?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center cursor-pointer">
                    <User className="ml-2 h-4 w-4" />
                    {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/history" className="flex items-center cursor-pointer">
                    <History className="ml-2 h-4 w-4" />
                    {language === 'ar' ? 'سجل الترجمات' : 'Translation History'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/stats" className="flex items-center cursor-pointer">
                    <BarChart3 className="ml-2 h-4 w-4" />
                    {language === 'ar' ? 'الإحصائيات' : 'Statistics'}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link to="/auth" className="flex items-center">
                <LogIn className="ml-2 h-4 w-4" />
                {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </Link>
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
