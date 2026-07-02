'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Comment {
  id: string;
  userName: string;
  content: string;
  isResolved: boolean;
  suggestion?: { original: string; suggested: string; reason: string };
  createdAt: string;
}

export default function CollaborationPage() {
  const [resumes, setResumes] = useState<{id:string;title:string}[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('协作者');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestionData, setSuggestionData] = useState({ original: '', suggested: '', reason: '' });

  const getHeaders = useCallback(() => {
    if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
    const fp = localStorage.getItem('jade_fingerprint');
    return { 'Content-Type': 'application/json', ...(fp ? { 'x-fingerprint': fp } : {}) };
  }, []);

  useEffect(() => {
    fetch('/api/resume', { headers: getHeaders() }).then(r => r.ok ? r.json() : []).then(d => { setResumes(d); if (d[0]) setSelectedResumeId(d[0].id); }).catch(() => {});
    const saved = localStorage.getItem('collab_username');
    if (saved) setUserName(saved);
  }, [getHeaders]);

  useEffect(() => {
    if (!selectedResumeId) return;
    fetch(`/api/comments?resumeId=${selectedResumeId}`).then(r => r.ok ? r.json() : []).then(setComments).catch(() => setComments([]));
  }, [selectedResumeId]);

  const handleSend = async () => {
    if (!newComment.trim() || !selectedResumeId) return;
    const res = await fetch('/api/comments', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ resumeId: selectedResumeId, content: newComment, userName, suggestion: showSuggestion && suggestionData.original ? suggestionData : null }) });
    if (res.ok) { const c = await res.json(); setComments([c, ...comments]); setNewComment(''); setShowSuggestion(false); setSuggestionData({ original: '', suggested: '', reason: '' }); }
  };

  const handleResolve = async (id: string, current: boolean) => {
    await fetch('/api/comments', { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ commentId: id, isResolved: !current }) });
    setComments(comments.map(c => c.id === id ? { ...c, isResolved: !current } : c));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除？')) return;
    await fetch(`/api/comments?commentId=${id}`, { method: 'DELETE', headers: getHeaders() });
    setComments(comments.filter(c => c.id !== id));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">协作评论</h1>
          <p className="mt-1 text-sm text-zinc-500">邀请朋友或导师为你的简历提供反馈</p>
        </div>
        <Input value={userName} onChange={e => { setUserName(e.target.value); localStorage.setItem('collab_username', e.target.value); }} placeholder="你的名字" className="w-32" />
      </div>
      {resumes.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {resumes.map(r => (
            <button key={r.id} onClick={() => setSelectedResumeId(r.id)} className={cn('rounded-lg border px-3 py-1.5 text-sm', selectedResumeId === r.id ? 'border-brand bg-brand text-white' : 'hover:border-brand/50')}>{r.title}</button>
          ))}
        </div>
      )}
      {!selectedResumeId ? (
        <div className="rounded-xl border-2 border-dashed border-zinc-200 py-16 text-center">
          <p className="text-zinc-500">请先创建简历，然后即可添加评论</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border bg-white p-4 dark:bg-zinc-900">
              <h2 className="mb-3 font-semibold">添加评论</h2>
              <Textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="输入评论..." rows={4} />
              {showSuggestion && (
                <div className="mt-2 space-y-2 rounded-lg bg-blue-50 p-2">
                  <Input value={suggestionData.original} onChange={e => setSuggestionData({...suggestionData, original: e.target.value})} placeholder="原文" />
                  <Input value={suggestionData.suggested} onChange={e => setSuggestionData({...suggestionData, suggested: e.target.value})} placeholder="建议改为" />
                  <Input value={suggestionData.reason} onChange={e => setSuggestionData({...suggestionData, reason: e.target.value})} placeholder="理由" />
                </div>
              )}
              <div className="mt-2 flex justify-between">
                <Button variant="outline" size="sm" onClick={() => setShowSuggestion(!showSuggestion)}>建议</Button>
                <Button size="sm" onClick={handleSend} disabled={!newComment.trim()} className="bg-brand hover:bg-brand-hover">发送</Button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-3">
            {comments.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-zinc-200 py-12 text-center">
                <p className="text-zinc-500">还没有评论</p>
              </div>
            ) : (
              comments.map(c => (
                <div key={c.id} className={cn('rounded-xl border bg-white p-4 dark:bg-zinc-900', c.isResolved && 'opacity-60')}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand">{c.userName.charAt(0).toUpperCase()}</div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-semibold">{c.userName}</span>
                        <span className="text-xs text-zinc-400">{new Date(c.createdAt).toLocaleString('zh-CN')}</span>
                        {c.isResolved && <span className="rounded bg-zinc-100 px-1 py-0.5 text-xs">已解决</span>}
                      </div>
                      <p className="text-sm">{c.content}</p>
                      {c.suggestion && (
                        <div className="mt-2 rounded-lg bg-blue-50 p-2 text-sm">
                          <div><span className="text-zinc-500">原文:</span> <span className="line-through">{c.suggestion.original}</span></div>
                          <div><span className="text-zinc-500">建议:</span> <span className="font-medium text-green-600">{c.suggestion.suggested}</span></div>
                        </div>
                      )}
                      <div className="mt-2 flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleResolve(c.id, c.isResolved)} className="h-6 text-xs">{c.isResolved ? '取消' : '解决'}</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)} className="h-6 text-xs text-red-500">删除</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
