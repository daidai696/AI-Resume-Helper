'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { ArrowLeft, CheckCircle2, Lightbulb, Code, DollarSign, Palette, TrendingUp, GraduationCap, Stethoscope, Briefcase, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, any> = {
  '💻': Code, '💰': DollarSign, '🎨': Palette, '📈': TrendingUp,
  '📚': GraduationCap, '⚕️': Stethoscope, '💼': Briefcase, '📄': FileText,
};

interface Industry {
  id: string; name: string; nameEn: string; icon: string;
  description: string; keywords: string[];
  skills: { required: string[]; preferred: string[] };
  templates: string[]; tips: string[];
}

export default function IndustriesPage() {
  const router = useRouter();
  const [industries, setIndustries] = useState<any[]>([]);
  const [selected, setSelected] = useState<Industry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/industries')
      .then(res => res.json())
      .then(data => {
        setIndustries(data.industries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = (id: string) => {
    fetch(`/api/industries?id=${id}`)
      .then(res => res.json())
      .then(data => setSelected(data.industry));
  };

  if (selected) {
    return (
      <div>
        <Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> 返回行业列表
        </Button>
        <div className="rounded-xl border bg-white p-6 dark:bg-zinc-900">
          <div className="mb-4 flex items-center gap-4">
            <div className="text-5xl">{selected.icon}</div>
            <div>
              <h1 className="text-2xl font-bold">{selected.name}</h1>
              <p className="text-sm text-zinc-500">{selected.nameEn} · {selected.description}</p>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="mb-2 font-semibold">推荐模板</h3>
            <div className="flex flex-wrap gap-2">
              {selected.templates.map(t => (
                <Badge key={t} variant="outline" className="cursor-pointer hover:bg-brand hover:text-white" onClick={() => router.push('/templates')}>{t}</Badge>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="mb-2 font-semibold">核心技能</h3>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-zinc-500">必备:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selected.skills.required.map(s => <Badge key={s} className="bg-red-100 text-red-700">{s}</Badge>)}
                </div>
              </div>
              <div>
                <span className="text-xs text-zinc-500">加分项:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selected.skills.preferred.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                </div>
              </div>
            </div>
          </div>
          {selected.keywords.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 font-semibold">行业高频关键词</h3>
              <div className="flex flex-wrap gap-1">
                {selected.keywords.map(k => <Badge key={k} variant="outline">{k}</Badge>)}
              </div>
            </div>
          )}
          <div className="mb-4">
            <h3 className="mb-2 flex items-center gap-2 font-semibold"><Lightbulb className="h-4 w-4 text-yellow-500" />求职建议</h3>
            <ul className="space-y-1.5">
              {selected.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button onClick={() => router.push('/dashboard')} className="w-full bg-brand hover:bg-brand-hover">
            使用此行业模板创建简历
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-foreground">行业垂直化</h1>
        <p className="mt-1 text-sm text-zinc-500">选择你的行业，获取针对性的模板、关键词和求职建议</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          [1,2,3,4].map(i => <div key={i} className="h-40 animate-pulse rounded-xl border bg-zinc-100 dark:bg-zinc-800" />)
        ) : (
          industries.map(industry => {
            const Icon = ICON_MAP[industry.icon] || FileText;
            return (
              <div
                key={industry.id}
                onClick={() => handleSelect(industry.id)}
                className="cursor-pointer rounded-xl border bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-zinc-900"
              >
                <div className="mb-3 text-5xl">{industry.icon}</div>
                <h3 className="font-bold">{industry.name}</h3>
                <p className="mt-1 text-xs text-zinc-500">{industry.description}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
                  <span>{industry.templateCount} 个模板</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
