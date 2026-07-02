'use client';

import { useState, useEffect } from 'react';
import { Plus, Briefcase, MapPin, ExternalLink, Trash2, TrendingUp, Calendar, DollarSign, Clock, CheckCircle2, XCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTracker, type JobApplication, type Offer } from '@/hooks/use-tracker';
import { useFingerprint } from '@/hooks/use-fingerprint';
import { useRuntimeConfig } from '@/components/providers/runtime-config-provider';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  draft: { label: '准备中', color: 'bg-zinc-100 text-zinc-700', icon: Clock },
  applied: { label: '已投递', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
  screening: { label: '筛选中', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  interview: { label: '面试中', color: 'bg-purple-100 text-purple-700', icon: Users },
  offered: { label: 'Offer', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  rejected: { label: '已拒绝', color: 'bg-red-100 text-red-700', icon: XCircle },
  accepted: { label: '已入职', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
};

const STATUSES = ['draft', 'applied', 'screening', 'interview', 'offered', 'rejected'];

export default function TrackerPage() {
  const { applications, stats, isLoading, createApplication, deleteApplication, updateApplication, offers, createOffer, deleteOffer } = useTracker();
  const [showForm, setShowForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [formData, setFormData] = useState<Partial<JobApplication>>({});
  const [offerData, setOfferData] = useState<Partial<Offer>>({});

  const handleSubmit = async () => {
    if (!formData.jobTitle || !formData.company) {
      toast.error('请填写岗位名称和公司');
      return;
    }
    await createApplication(formData);
    setShowForm(false);
    setFormData({});
    toast.success('投递记录已添加');
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateApplication(id, { status });
    toast.success('状态已更新');
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定删除这条记录？')) {
      await deleteApplication(id);
      toast.success('已删除');
    }
  };

  const handleOfferSubmit = async () => {
    if (!offerData.company || !offerData.position || !offerData.baseSalary) {
      toast.error('请填写公司、职位和月薪');
      return;
    }
    await createOffer(offerData);
    setShowOfferForm(false);
    setOfferData({});
    toast.success('Offer已添加');
  };

  // 按状态分组
  const grouped: Record<string, JobApplication[]> = {};
  STATUSES.forEach(s => { grouped[s] = []; });
  applications.forEach(a => {
    if (grouped[a.status]) grouped[a.status].push(a);
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-foreground">求职跟踪</h1>
          <p className="mt-1 text-sm text-zinc-500">管理投递进度、面试安排和Offer对比</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowOfferForm(true)} className="gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">添加Offer</span>
          </Button>
          <Button onClick={() => setShowForm(true)} className="gap-2 bg-brand hover:bg-brand-hover">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">添加投递</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={<Briefcase className="h-4 w-4" />} label="投递总数" value={stats.total || 0} color="bg-blue-50 text-blue-700" />
          <StatCard icon={<TrendingUp className="h-4 w-4" />} label="回复率" value={`${stats.responseRate || 0}%`} color="bg-green-50 text-green-700" />
          <StatCard icon={<Users className="h-4 w-4" />} label="面试率" value={`${stats.interviewRate || 0}%`} color="bg-purple-50 text-purple-700" />
          <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label="Offer率" value={`${stats.offerRate || 0}%`} color="bg-orange-50 text-orange-700" />
        </div>
      )}

      {/* Offer 对比 */}
      {offers.length > 0 && (
        <div className="mb-6 rounded-xl border bg-gradient-to-r from-brand/5 to-brand/10 p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <DollarSign className="h-4 w-4 text-brand" />
            Offer 对比 (按年度总包排序)
          </h2>
          <div className="space-y-2">
            {offers.map((offer, i) => (
              <div key={offer.id} className={cn('flex items-center justify-between rounded-lg border p-3', i === 0 ? 'border-brand bg-brand/5' : 'bg-white dark:bg-zinc-900')}>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {i === 0 && <span className="rounded bg-brand px-1.5 py-0.5 text-xs text-white">最高</span>}
                    <span className="font-medium">{offer.position}</span>
                    <span className="text-sm text-zinc-500">· {offer.company}</span>
                  </div>
                  <div className="mt-1 flex gap-4 text-xs text-zinc-500">
                    <span>月薪: ¥{offer.baseSalary.toLocaleString()}</span>
                    {offer.bonus > 0 && <span>年终: ¥{offer.bonus.toLocaleString()}</span>}
                    {offer.stock > 0 && <span>股票: ¥{offer.stock.toLocaleString()}/4yr</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-brand">¥{Math.round(offer.yearlyTotal).toLocaleString()}</div>
                    <div className="text-xs text-zinc-400">年度总包</div>
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => deleteOffer(offer.id)} className="text-red-500">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="mb-6 rounded-xl border bg-white p-4 dark:bg-zinc-900">
          <h2 className="mb-3 font-semibold">添加投递记录</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">岗位名称 *</label>
              <Input value={formData.jobTitle || ''} onChange={e => setFormData({...formData, jobTitle: e.target.value})} placeholder="高级前端工程师" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">公司 *</label>
              <Input value={formData.company || ''} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="字节跳动" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">工作地点</label>
              <Input value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="北京" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">投递时间</label>
              <Input type="date" value={formData.appliedAt?.split('T')[0] || ''} onChange={e => setFormData({...formData, appliedAt: e.target.value})} />
            </div>
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium">岗位链接</label>
            <Input value={formData.jobUrl || ''} onChange={e => setFormData({...formData, jobUrl: e.target.value})} placeholder="https://..." />
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium">备注</label>
            <Textarea value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} rows={2} placeholder="任何需要记录的备注..." />
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>取消</Button>
            <Button onClick={handleSubmit} className="bg-brand hover:bg-brand-hover">添加</Button>
          </div>
        </div>
      )}

      {/* Offer Form */}
      {showOfferForm && (
        <div className="mb-6 rounded-xl border bg-white p-4 dark:bg-zinc-900">
          <h2 className="mb-3 font-semibold">添加 Offer</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">公司 *</label>
              <Input value={offerData.company || ''} onChange={e => setOfferData({...offerData, company: e.target.value})} placeholder="字节跳动" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">职位 *</label>
              <Input value={offerData.position || ''} onChange={e => setOfferData({...offerData, position: e.target.value})} placeholder="高级前端工程师" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">基本月薪 *</label>
              <Input type="number" value={offerData.baseSalary || ''} onChange={e => setOfferData({...offerData, baseSalary: parseInt(e.target.value) || 0})} placeholder="30000" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">年终奖</label>
              <Input type="number" value={offerData.bonus || ''} onChange={e => setOfferData({...offerData, bonus: parseInt(e.target.value) || 0})} placeholder="60000" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">股票(4年)</label>
              <Input type="number" value={offerData.stock || ''} onChange={e => setOfferData({...offerData, stock: parseInt(e.target.value) || 0})} placeholder="200000" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">工作地点</label>
              <Input value={offerData.location || ''} onChange={e => setOfferData({...offerData, location: e.target.value})} placeholder="北京" />
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowOfferForm(false)}>取消</Button>
            <Button onClick={handleOfferSubmit} className="bg-brand hover:bg-brand-hover">添加</Button>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {STATUSES.map(status => {
          const config = STATUS_CONFIG[status];
          const apps = grouped[status] || [];
          const Icon = config.icon;
          return (
            <div key={status} className="rounded-xl border bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center justify-between border-b p-2">
                <div className="flex items-center gap-1.5">
                  <span className={cn('rounded px-1.5 py-0.5 text-xs font-medium', config.color)}>
                    <Icon className="mr-0.5 inline h-3 w-3" />
                    {config.label}
                  </span>
                </div>
                <span className="text-xs text-zinc-400">{apps.length}</span>
              </div>
              <div className="space-y-2 p-2">
                {apps.length === 0 ? (
                  <p className="py-4 text-center text-xs text-zinc-400">无</p>
                ) : (
                  apps.map(app => (
                    <div key={app.id} className="group rounded-lg border bg-white p-2.5 dark:bg-zinc-800">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{app.jobTitle}</div>
                          <div className="truncate text-xs text-zinc-500">{app.company}</div>
                        </div>
                        <button onClick={() => handleDelete(app.id)} className="ml-1 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </button>
                      </div>
                      <div className="mt-1.5 space-y-0.5 text-xs text-zinc-400">
                        {app.location && (
                          <div className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{app.location}</div>
                        )}
                        {app.appliedAt && (
                          <div className="flex items-center gap-1"><Calendar className="h-2.5 w-2.5" />{app.appliedAt.split('T')[0]}</div>
                        )}
                        {app.jobUrl && (
                          <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-brand hover:underline">
                            <ExternalLink className="h-2.5 w-2.5" />查看JD
                          </a>
                        )}
                      </div>
                      <select
                        value={app.status}
                        onChange={e => handleStatusChange(app.id, e.target.value)}
                        className="mt-2 w-full rounded border bg-zinc-50 px-1.5 py-1 text-xs dark:bg-zinc-700"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                      </select>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: any; color: string }) {
  return (
    <div className="rounded-xl border bg-white p-3 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500">{label}</p>
          <p className="mt-0.5 text-xl font-bold">{value}</p>
        </div>
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', color)}>{icon}</div>
      </div>
    </div>
  );
}
