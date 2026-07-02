'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFingerprint } from '@/hooks/use-fingerprint';
import { useRuntimeConfig } from '@/components/providers/runtime-config-provider';

export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  jobUrl?: string;
  jd?: string;
  status: string;
  stage?: string;
  appliedAt?: string;
  salary?: number;
  currency: string;
  notes?: string;
  nextAction?: string;
  resumeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  company: string;
  position: string;
  baseSalary: number;
  bonus: number;
  stock: number;
  benefits: string[];
  startDate?: string;
  deadline?: string;
  location?: string;
  notes?: string;
  status: string;
  yearlyTotal: number;
}

export function useTracker() {
  const { fingerprint, isLoading: fpLoading } = useFingerprint();
  const { authEnabled } = useRuntimeConfig();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (!authEnabled && fingerprint) {
      headers['x-fingerprint'] = fingerprint;
    }
    return headers;
  }, [fingerprint, authEnabled]);

  const fetchApplications = useCallback(async () => {
    if (fpLoading) return;
    if (!authEnabled && !fingerprint) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/tracker/applications', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (e) {
      console.error('Failed to fetch applications:', e);
    } finally {
      setIsLoading(false);
    }
  }, [fpLoading, fingerprint, authEnabled, getHeaders]);

  const fetchOffers = useCallback(async () => {
    if (fpLoading) return;
    if (!authEnabled && !fingerprint) return;
    try {
      const res = await fetch('/api/tracker/offers', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setOffers(data);
      }
    } catch (e) {
      console.error('Failed to fetch offers:', e);
    }
  }, [fpLoading, fingerprint, authEnabled, getHeaders]);

  const fetchStats = useCallback(async () => {
    if (fpLoading) return;
    if (!authEnabled && !fingerprint) return;
    try {
      const res = await fetch('/api/tracker/stats', { headers: getHeaders() });
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  }, [fpLoading, fingerprint, authEnabled, getHeaders]);

  const createApplication = useCallback(async (data: Partial<JobApplication>) => {
    const res = await fetch('/api/tracker/applications', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await fetchApplications();
      await fetchStats();
      return await res.json();
    }
    return null;
  }, [getHeaders, fetchApplications, fetchStats]);

  const updateApplication = useCallback(async (id: string, data: Partial<JobApplication>) => {
    const res = await fetch(`/api/tracker/applications/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await fetchApplications();
      return await res.json();
    }
    return null;
  }, [getHeaders, fetchApplications]);

  const deleteApplication = useCallback(async (id: string) => {
    const res = await fetch(`/api/tracker/applications/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (res.ok) {
      await fetchApplications();
      await fetchStats();
    }
  }, [getHeaders, fetchApplications, fetchStats]);

  const createOffer = useCallback(async (data: Partial<Offer>) => {
    const res = await fetch('/api/tracker/offers', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await fetchOffers();
      return await res.json();
    }
    return null;
  }, [getHeaders, fetchOffers]);

  const deleteOffer = useCallback(async (id: string) => {
    const res = await fetch(`/api/tracker/offers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (res.ok) {
      await fetchOffers();
    }
  }, [getHeaders, fetchOffers]);

  useEffect(() => {
    fetchApplications();
    fetchOffers();
    fetchStats();
  }, [fetchApplications, fetchOffers, fetchStats]);

  return {
    applications,
    offers,
    stats,
    isLoading,
    fetchApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    createOffer,
    deleteOffer,
  };
}
