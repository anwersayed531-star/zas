import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CEREBRAS_API_KEY = Deno.env.get('CEREBRAS_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `أنت ZAS AI، مساعد ذكي متخصص في موقع ZAS لترجمة المواقع البرمجية.

🌐 عن الموقع:
- ZAS هو منصة ذكية لترجمة مواقع الويب إلى 27 لغة عالمية
- يدعم الترجمة الأحادية (لغة واحدة) والمتعددة (عدة لغات في وقت واحد)
- يستخدم 3 مزودين للذكاء الاصطناعي: Groq (الأسرع)، Google AI (الأدق)، Cloudflare (احتياطي)

🔧 كيف يعمل:
1. المستخدم يلصق كود HTML في محرر الكود
2. يختار اللغة المصدر واللغات الهدف (يمكن اختيار لغة واحدة أو عدة لغات)
3. الموقع يستخرج النصوص القابلة للترجمة تلقائياً
4. يترجمها باستخدام الذكاء الاصطناعي بدقة عالية
5. يعيد إدخال الترجمات في الكود مع الحفاظ على التنسيق
6. يدعم RTL (الكتابة من اليمين لليسار) للغات العربية والفارسية والأردية تلقائياً

🌍 اللغات المدعومة (27 لغة):
الإنجليزية (en)، العربية (ar)، الإسبانية (es)، الألمانية (de)، الإيطالية (it)، التركية (tr)، الفرنسية (fr)، الصينية (zh)، الكورية (ko)، اليابانية (ja)، الروسية (ru)، الإندونيسية (id)، الهندية (hi)، البنغالية (bn)، البولندية (pl)، التايلاندية (th)، السويدية (sv)، اليونانية (el)، التشيكية (cs)، الرومانية (ro)، الهنغارية (hu)، الفنلندية (fi)، الأوكرانية (uk)، الفارسية (fa)، الأردية (ur)، الملايو (ms)، الفلبينية (tl)

💡 نصائح للمستخدمين:
- يمكن ترجمة صفحات HTML كاملة أو أجزاء منها
- الموقع يحافظ على جميع التاغات والخصائص البرمجية
- يترجم فقط النصوص المرئية للمستخدم
- يمكن اختيار عدة لغات هدف في نفس الوقت لتوفير الوقت
- الترجمة دقيقة وسريعة بفضل الذكاء الاصطناعي

مهمتك: مساعدة المستخدمين في فهم كيفية استخدام الموقع، الإجابة على أسئلتهم حول الترجمة، وتقديم النصائح لتحسين تجربتهم.

قواعد مهمة:
- رد دائماً باللغة العربية فقط
- لا تستخدم أي لغات أخرى في ردودك
- كن واضحاً ومختصراً ومفيداً`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, sourceCode, translatedCode } = await req.json();

    if (!CEREBRAS_API_KEY) {
      throw new Error('CEREBRAS_API_KEY is not configured');
    }

    console.log('Calling Cerebras API with messages:', messages);

    // Build enhanced system prompt with code context
    let enhancedPrompt = SYSTEM_PROMPT;
    
    if (sourceCode && sourceCode.trim()) {
      enhancedPrompt += `\n\n📝 الكود الأصلي الذي يعمل عليه المستخدم:\n\`\`\`html\n${sourceCode}\n\`\`\``;
    }
    
    if (translatedCode && Object.keys(translatedCode).length > 0) {
      enhancedPrompt += `\n\n🌍 الأكواد المترجمة:\n`;
      Object.entries(translatedCode).forEach(([lang, code]) => {
        enhancedPrompt += `\n**${lang}:**\n\`\`\`html\n${code}\n\`\`\`\n`;
      });
    }

    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CEREBRAS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b',
        messages: [
          { role: 'system', content: enhancedPrompt },
          ...messages
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cerebras API error:', response.status, errorText);
      throw new Error(`Cerebras API error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in zas-assistant function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
