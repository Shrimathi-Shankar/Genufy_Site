'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { m as motion, AnimatePresence, useInView } from 'framer-motion';
import Header from '../components/Header.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const LIME = '#90eb61';
const TEAL = '#24baac';
const ease = [0.22, 1, 0.36, 1];

// ─── Case study data ───────────────────────────────────────────────────────────
const CASE_STUDIES = [
  {
    id: 1,
    industry: 'Manufacturing',
    icon: '🏭',
    client: 'Global Manufacturing Enterprise',
    size: '10,000+ employees',
    challenge: 'Disconnected Salesforce data across 12 plants causing 3-week reporting delays and missed revenue opportunities.',
    solution: 'Unified data platform using Salesforce Data Cloud and MuleSoft API-led integration, layered with AI-driven analytics dashboards.',
    impact: ['45% faster reporting cycle', '60% reduction in manual work', '99.9% data accuracy', '$2.4M annual savings'],
    technologies: ['Salesforce', 'Data Cloud', 'MuleSoft', 'Snowflake', 'AI'],
    metric: '45% faster reporting',
    metricSub: 'vs. previous 3-week cycle',
    accentColor: '#24baac',
    featured: true,
    filters: ['Salesforce', 'Data Cloud', 'MuleSoft', 'Snowflake', 'AI'],
  },
  {
    id: 2,
    industry: 'Healthcare',
    icon: '🏥',
    client: 'Regional Healthcare Provider',
    size: '5,000+ employees',
    challenge: 'Fragmented patient engagement across 8 systems causing care gaps and low satisfaction scores.',
    solution: 'Deployed Salesforce Agentforce AI agents for intelligent patient routing and Care Cloud integration.',
    impact: ['38% improvement in patient satisfaction', '52% reduction in care gaps'],
    technologies: ['Salesforce', 'Agentforce', 'AI'],
    metric: '38% patient satisfaction lift',
    metricSub: 'within 90 days of go-live',
    accentColor: '#f43f5e',
    featured: false,
    filters: ['Salesforce', 'AI', 'Agentforce'],
  },
  {
    id: 3,
    industry: 'Retail',
    icon: '🛍️',
    client: 'Enterprise Retail Brand',
    size: '2,000+ stores',
    challenge: 'Siloed customer data prevented personalisation at scale across e-commerce, POS and loyalty channels.',
    solution: 'Built a Snowflake-powered Customer 360 data platform with real-time segmentation and ML-based recommendations.',
    impact: ['29% increase in repeat purchases', '3× faster campaign deployment'],
    technologies: ['Snowflake', 'Data Engineering', 'AI'],
    metric: '29% repeat purchase growth',
    metricSub: 'first 6 months post-launch',
    accentColor: '#f97316',
    featured: false,
    filters: ['Snowflake', 'Data Engineering', 'AI'],
  },
  {
    id: 4,
    industry: 'Banking',
    icon: '🏦',
    client: 'Mid-Market Financial Institution',
    size: '800+ employees',
    challenge: 'Manual compliance workflows and disconnected core banking APIs causing regulatory reporting risk.',
    solution: 'Implemented MuleSoft Anypoint Platform with automated compliance orchestration and Salesforce CRM integration.',
    impact: ['70% reduction in compliance effort', 'Zero regulatory findings in 2 audits'],
    technologies: ['MuleSoft', 'Salesforce', 'Automation'],
    metric: '70% compliance effort cut',
    metricSub: 'and zero audit findings',
    accentColor: '#818cf8',
    featured: false,
    filters: ['MuleSoft', 'Salesforce', 'Automation'],
  },
  {
    id: 5,
    industry: 'Logistics',
    icon: '🚚',
    client: 'National Logistics Operator',
    size: '3,500+ employees',
    challenge: 'No real-time visibility into last-mile delivery causing SLA breaches and customer churn.',
    solution: 'Salesforce Data Cloud + AWS IoT pipeline for live shipment telemetry, predictive ETA, and proactive customer alerts.',
    impact: ['SLA compliance up from 72% to 96%', '41% reduction in support tickets'],
    technologies: ['Salesforce', 'Data Cloud', 'AWS', 'AI'],
    metric: '96% SLA compliance',
    metricSub: 'up from 72% baseline',
    accentColor: '#38bdf8',
    featured: false,
    filters: ['Salesforce', 'Data Cloud', 'AI'],
  },
  {
    id: 6,
    industry: 'Education',
    icon: '🎓',
    client: 'Higher Education Institution',
    size: '25,000+ students',
    challenge: 'Student engagement data locked in legacy SIS preventing early-intervention counselling.',
    solution: 'Salesforce Education Cloud with AI-powered at-risk student detection and automated advisor workflows.',
    impact: ['33% drop in student attrition', '2× advisor capacity without headcount increase'],
    technologies: ['Salesforce', 'AI', 'Automation'],
    metric: '33% attrition reduction',
    metricSub: 'in first academic year',
    accentColor: '#90eb61',
    featured: false,
    filters: ['Salesforce', 'AI', 'Automation'],
  },
  {
    id: 7,
    industry: 'Insurance',
    icon: '🛡️',
    client: 'National Insurance Carrier',
    size: '1,200+ employees',
    challenge: 'Claims processing took 14 days average due to manual data entry across five legacy systems.',
    solution: 'Snowflake data lake + Azure ML for intelligent document processing, integrated with Salesforce Financial Services Cloud.',
    impact: ['Claims cycle reduced from 14 to 4 days', '55% lower processing cost per claim'],
    technologies: ['Snowflake', 'Data Engineering', 'Azure', 'AI'],
    metric: '4-day claims cycle',
    metricSub: 'down from 14-day average',
    accentColor: '#a78bfa',
    featured: false,
    filters: ['Snowflake', 'Data Engineering', 'AI'],
  },
  {
    id: 8,
    industry: 'Technology',
    icon: '💻',
    client: 'B2B SaaS Scale-Up',
    size: '600+ employees',
    challenge: 'Manual SDR workflows and poor lead scoring causing 30% of pipeline to stall at qualification.',
    solution: 'Agentforce AI agents for autonomous lead qualification, MuleSoft CRM sync, and Salesforce Revenue Cloud implementation.',
    impact: ['Pipeline velocity up 65%', 'SDR capacity freed by 40%', '22% higher win rate'],
    technologies: ['Salesforce', 'Agentforce', 'MuleSoft', 'AI'],
    metric: '65% pipeline velocity gain',
    metricSub: 'with AI-driven qualification',
    accentColor: '#24baac',
    featured: false,
    filters: ['Salesforce', 'AI', 'MuleSoft'],
  },
];

const FILTERS = ['All', 'Salesforce', 'AI', 'Snowflake', 'MuleSoft', 'Data Engineering', 'Data Cloud', 'Automation'];

const METRICS = [
  { value: '120+', label: 'Projects Delivered', icon: '✦' },
  { value: '98%',  label: 'Customer Satisfaction', icon: '★' },
  { value: '40%',  label: 'Avg Productivity Lift', icon: '↑' },
  { value: '15+',  label: 'Industries Served', icon: '◎' },
];

const TIMELINE = [
  { step: '01', title: 'Discovery',       desc: 'We map your current state — systems, data, gaps, and business goals.' },
  { step: '02', title: 'Strategy',        desc: 'Architecture decisions and a phased delivery roadmap aligned to ROI.' },
  { step: '03', title: 'Implementation',  desc: 'Agile delivery with weekly checkpoints and zero-surprise governance.' },
  { step: '04', title: 'Optimisation',    desc: 'Post-launch tuning, user adoption support, and performance telemetry.' },
  { step: '05', title: 'Business Growth', desc: 'Measurable outcomes, documented impact, and a roadmap for what\'s next.' },
];

const TECH_STACK = [
  { name: 'Salesforce',  color: '#00A1E0', bg: '#00A1E018', icon: '☁️' },
  { name: 'Agentforce',  color: '#0176D3', bg: '#0176D318', icon: '🤖' },
  { name: 'Data Cloud',  color: '#1B96FF', bg: '#1B96FF18', icon: '🌐' },
  { name: 'Snowflake',   color: '#29B5E8', bg: '#29B5E818', icon: '❄️' },
  { name: 'MuleSoft',    color: '#00B3E6', bg: '#00B3E618', icon: '🔗' },
  { name: 'AI / ML',     color: LIME,      bg: '#90eb6118', icon: '✦' },
  { name: 'AWS',         color: '#FF9900', bg: '#FF990018', icon: '⚡' },
  { name: 'Azure',       color: '#0078D4', bg: '#0078D418', icon: '☁' },
];

const TESTIMONIALS = [
  {
    quote: "Genufy didn't just implement Salesforce — they redesigned how our operations team thinks about data. The ROI was visible within the first quarter.",
    author: 'VP of Operations',
    company: 'Global Manufacturing Company',
    size: '10,000+ employees',
    outcome: '45% faster reporting',
    accentColor: TEAL,
  },
  {
    quote: "Their MuleSoft expertise is genuinely best-in-class. Complex integrations that our previous partner couldn't deliver in 18 months went live in 12 weeks.",
    author: 'Chief Technology Officer',
    company: 'Leading Healthcare Provider',
    size: '5,000+ employees',
    outcome: '38% patient satisfaction lift',
    accentColor: '#f43f5e',
  },
  {
    quote: "The Agentforce implementation transformed our sales motion. Our SDRs are focused on relationships while AI handles qualification. Revenue team is thrilled.",
    author: 'Chief Revenue Officer',
    company: 'Enterprise B2B SaaS Company',
    size: '600+ employees',
    outcome: '65% pipeline velocity gain',
    accentColor: LIME,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function TechBadge({ name, color }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: color + '18', border: `1px solid ${color}35`, color }}
    >
      {name}
    </span>
  );
}

// ─── Hero illustration ────────────────────────────────────────────────────────
function HeroIllustration() {
  return (
    <div className="relative h-full min-h-[420px] flex items-center justify-center">
      {/* Central glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(60% 60% at 50% 50%, ${TEAL}20 0%, transparent 70%)`,
        }}
      />

      {/* Floating metric cards */}
      {/* Top-left */}
      <motion.div
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 left-4 md:top-8 md:left-0 rounded-2xl px-5 py-4 min-w-[140px]"
        style={{ background: 'var(--c-surface-md)', border: '1px solid var(--c-border-md)', backdropFilter: 'blur(12px)' }}
      >
        <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--c-text-muted)' }}>Pipeline Velocity</p>
        <p className="font-display text-2xl font-extrabold" style={{ color: LIME }}>+65%</p>
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--c-text-muted)' }}>AI-driven qualification</p>
      </motion.div>

      {/* Top-right */}
      <motion.div
        animate={{ y: [6, -6, 6] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute top-4 right-4 md:top-12 md:right-0 rounded-2xl px-5 py-4 min-w-[130px]"
        style={{ background: 'var(--c-surface-md)', border: '1px solid var(--c-border-md)', backdropFilter: 'blur(12px)' }}
      >
        <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--c-text-muted)' }}>Data Accuracy</p>
        <p className="font-display text-2xl font-extrabold" style={{ color: TEAL }}>99.9%</p>
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--c-text-muted)' }}>Post-migration audit</p>
      </motion.div>

      {/* Bottom-left */}
      <motion.div
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        className="absolute bottom-4 left-4 md:bottom-10 md:left-2 rounded-2xl px-5 py-4 min-w-[150px]"
        style={{ background: 'var(--c-surface-md)', border: '1px solid var(--c-border-md)', backdropFilter: 'blur(12px)' }}
      >
        <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--c-text-muted)' }}>Client Satisfaction</p>
        <p className="font-display text-2xl font-extrabold" style={{ color: '#a78bfa' }}>98%</p>
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--c-text-muted)' }}>Across 120+ projects</p>
      </motion.div>

      {/* Bottom-right */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        className="absolute bottom-4 right-4 md:bottom-8 md:right-0 rounded-2xl px-5 py-4 min-w-[130px]"
        style={{ background: 'var(--c-surface-md)', border: '1px solid var(--c-border-md)', backdropFilter: 'blur(12px)' }}
      >
        <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--c-text-muted)' }}>Cost Reduction</p>
        <p className="font-display text-2xl font-extrabold" style={{ color: '#f97316' }}>-55%</p>
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--c-text-muted)' }}>Operational overhead</p>
      </motion.div>

      {/* Centre ring */}
      <div
        className="relative h-48 w-48 md:h-56 md:w-56 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(from 180deg at 50% 50%, ${LIME}30, ${TEAL}40, #818cf840, ${LIME}30)`,
          boxShadow: `0 0 60px ${TEAL}30`,
        }}
      >
        <div
          className="h-36 w-36 md:h-44 md:w-44 rounded-full flex flex-col items-center justify-center text-center"
          style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)' }}
        >
          <p className="text-[9px] tracking-[0.4em] uppercase mb-1" style={{ color: 'var(--c-text-muted)' }}>Projects</p>
          <p className="font-display text-4xl font-extrabold leading-none" style={{ color: 'var(--c-text)' }}>120<span style={{ color: LIME }}>+</span></p>
          <p className="text-[9px] tracking-widest uppercase mt-1" style={{ color: 'var(--c-text-muted)' }}>Delivered</p>
        </div>
      </div>

      {/* Orbiting dots */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute h-64 w-64 md:h-72 md:w-72"
        aria-hidden
      >
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <div
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${deg}deg) translateX(130px) translate(-50%, -50%)`,
              background: [LIME, TEAL, '#a78bfa', '#f97316', '#38bdf8'][i],
              boxShadow: `0 0 8px ${[LIME, TEAL, '#a78bfa', '#f97316', '#38bdf8'][i]}`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

// ─── Featured case study card ─────────────────────────────────────────────────
function FeaturedCard({ post }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.75, ease }}
    >
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: isLight
            ? `linear-gradient(145deg, ${post.accentColor}18 0%, rgba(255,255,255,0.84) 60%)`
            : `linear-gradient(145deg, ${post.accentColor}10 0%, rgba(5,7,10,0.95) 60%)`,
          border: `1px solid ${post.accentColor}${isLight ? '28' : '30'}`,
          boxShadow: isLight
            ? `0 0 0 1px rgba(255,255,255,0.90), 0 24px 56px -16px ${post.accentColor}18`
            : `0 0 0 1px rgba(255,255,255,0.02), 0 40px 80px -20px ${post.accentColor}20`,
          backdropFilter: isLight ? 'blur(16px)' : undefined,
        }}
      >
        {/* Featured label */}
        <div
          className="absolute top-0 right-0 px-4 py-2 rounded-bl-2xl text-[9px] font-bold uppercase tracking-[0.3em]"
          style={{ background: `linear-gradient(135deg, ${LIME}, ${TEAL})`, color: '#05070a' }}
        >
          Featured Case Study
        </div>

        {/* Ghost icon */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-16 top-8 text-[clamp(80px,12vw,160px)] leading-none select-none"
          style={{ opacity: 0.05 }}
        >
          {post.icon}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-0">
          {/* Left — main content */}
          <div className="p-8 md:p-12">
            {/* Industry badge */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span
                className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                style={{ background: post.accentColor + '20', border: `1px solid ${post.accentColor}40`, color: post.accentColor }}
              >
                {post.industry}
              </span>
              <span className={`text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-white/30'}`}>{post.client}</span>
              <span className={isLight ? 'text-slate-300' : 'text-white/15'}>·</span>
              <span className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-white/30'}`}>{post.size}</span>
            </div>

            {/* Challenge */}
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: post.accentColor }}>
                The Challenge
              </p>
              <p className={`text-base leading-relaxed ${isLight ? 'text-slate-700' : 'text-white/70'}`}>{post.challenge}</p>
            </div>

            {/* Solution */}
            <div className="mb-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: LIME }}>
                Genufy's Solution
              </p>
              <p className={`text-base leading-relaxed ${isLight ? 'text-slate-700' : 'text-white/70'}`}>{post.solution}</p>
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.technologies.map(t => <TechBadge key={t} name={t} color={post.accentColor} />)}
            </div>

            {/* CTA */}
            <button
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:brightness-110 hover:scale-[1.02]"
              style={{ background: `linear-gradient(110deg, ${LIME} 0%, ${TEAL} 100%)`, color: '#05070a' }}
            >
              View Full Case Study <span>→</span>
            </button>
          </div>

          {/* Right — impact panel */}
          <div
            className="p-8 md:p-10 flex flex-col justify-center"
            style={{ borderLeft: `1px solid ${post.accentColor}18`, background: `${post.accentColor}06` }}
          >
            <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-6 ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
              Business Impact
            </p>
            <div className="space-y-4">
              {post.impact.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: post.accentColor + '0e', border: `1px solid ${post.accentColor}20` }}
                >
                  <div
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ background: post.accentColor }}
                  />
                  <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{item}</span>
                </div>
              ))}
            </div>

            {/* Primary metric */}
            <div
              className="mt-8 p-5 rounded-2xl text-center"
              style={{
                background: `linear-gradient(135deg, ${post.accentColor}15, transparent)`,
                border: `1px solid ${post.accentColor}30`,
              }}
            >
              <p className="font-display text-3xl font-extrabold leading-none mb-1" style={{ color: post.accentColor }}>
                {post.metric.split(' ')[0]}
              </p>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-white/45'}`}>{post.metric.split(' ').slice(1).join(' ')}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Case study grid card ─────────────────────────────────────────────────────
function CaseCard({ post, i }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, delay: i * 0.06, ease }}
      className="group h-full"
    >
      <div
        className="relative h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
        style={{
          background: 'var(--c-surface)',
          border: `1px solid var(--c-border)`,
        }}
      >
        {/* Accent top strip */}
        <div
          className="h-[2px] w-full shrink-0"
          style={{ background: `linear-gradient(90deg, ${post.accentColor}, transparent)` }}
        />

        {/* Hover glow overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ boxShadow: `inset 0 0 0 1px ${post.accentColor}38`, background: `radial-gradient(80% 60% at 50% 0%, ${post.accentColor}06 0%, transparent 70%)` }}
          aria-hidden
        />

        <div className="flex flex-col flex-1 p-6">
          {/* Icon + industry */}
          <div className="flex items-start justify-between mb-5">
            <div
              className="h-11 w-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: post.accentColor + '15', border: `1px solid ${post.accentColor}28` }}
            >
              {post.icon}
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest"
              style={{ background: post.accentColor + '15', border: `1px solid ${post.accentColor}28`, color: post.accentColor }}
            >
              {post.industry}
            </span>
          </div>

          {/* Client */}
          <p className={`text-[11px] mb-2 font-medium ${isLight ? 'text-slate-600' : 'text-white/35'}`}>{post.client}</p>

          {/* Challenge headline */}
          <p className={`text-sm font-semibold leading-snug transition-colors duration-300 mb-4 flex-1 line-clamp-3 ${isLight ? 'text-slate-700 group-hover:text-slate-900' : 'text-white/80 group-hover:text-white'}`}>
            {post.challenge}
          </p>

          {/* Key metric */}
          <div
            className="mb-4 px-4 py-3 rounded-xl"
            style={{ background: post.accentColor + '0d', border: `1px solid ${post.accentColor}20` }}
          >
            <p className="text-base font-extrabold font-display leading-none" style={{ color: post.accentColor }}>
              {post.metric}
            </p>
            <p className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-white/35'}`}>{post.metricSub}</p>
          </div>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {post.technologies.slice(0, 4).map(t => <TechBadge key={t} name={t} color={post.accentColor} />)}
          </div>

          {/* CTA */}
          <div className={`pt-4 border-t ${isLight ? 'border-slate-200' : 'border-white/[0.06]'}`}>
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest -translate-x-0.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
              style={{ color: post.accentColor }}
            >
              Read Case Study <span className="text-sm">→</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Animated metric ──────────────────────────────────────────────────────────
function MetricCard({ value, label, icon, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.1, ease }}
      className="text-center group"
    >
      <div
        className="relative inline-flex flex-col items-center px-8 py-8 rounded-3xl w-full transition-all duration-300 hover:-translate-y-1"
        style={{
          background: 'var(--c-surface)',
          border: '1px solid var(--c-border)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ background: `radial-gradient(60% 50% at 50% 0%, ${TEAL}10, transparent)`, boxShadow: `inset 0 0 0 1px ${TEAL}28` }}
          aria-hidden
        />
        <span className="text-2xl mb-3" aria-hidden>{icon}</span>
        <motion.p
          className="font-display text-4xl md:text-5xl font-extrabold leading-none mb-2"
          style={{ background: `linear-gradient(135deg, ${LIME}, ${TEAL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
        >
          {value}
        </motion.p>
        <p className={`text-sm font-medium ${isLight ? 'text-slate-400' : 'text-white/45'}`}>{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Timeline step ────────────────────────────────────────────────────────────
function TimelineStep({ step, title, desc, i, total }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: i * 0.1, ease }}
      className="relative flex flex-col items-center text-center flex-1 min-w-0 px-3"
    >
      {/* Connector line — right side (not on last item) */}
      {i < total - 1 && (
        <div
          aria-hidden
          className="hidden lg:block absolute top-[22px] left-[calc(50%+22px)] right-[-calc(50%-22px)] h-px"
          style={{ background: `linear-gradient(90deg, ${TEAL}50, transparent)` }}
        />
      )}

      {/* Step circle */}
      <div
        className="relative z-10 h-11 w-11 rounded-full flex items-center justify-center text-[11px] font-bold mb-4 shrink-0"
        style={{
          background: `linear-gradient(135deg, ${LIME}22, ${TEAL}22)`,
          border: `1px solid ${TEAL}50`,
          color: LIME,
        }}
      >
        {step}
      </div>

      <p className={`font-display text-sm font-bold mb-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>{title}</p>
      <p className={`text-[12px] leading-relaxed ${isLight ? 'text-slate-500' : 'text-white/38'}`}>{desc}</p>
    </motion.div>
  );
}

// ─── Tech card ────────────────────────────────────────────────────────────────
function TechCard({ item, i }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: i * 0.06, ease }}
      className="group flex flex-col items-center justify-center gap-2.5 py-5 px-4 rounded-2xl cursor-default transition-all duration-300 hover:-translate-y-1"
      style={{
        background: item.bg,
        border: `1px solid ${item.color}25`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: `0 0 24px ${item.color}30, inset 0 0 0 1px ${item.color}38` }}
        aria-hidden
      />
      <span className="relative text-2xl" aria-hidden>{item.icon}</span>
      <span className={`relative text-[11px] font-bold transition-colors duration-300 ${isLight ? 'text-slate-600 group-hover:text-slate-900' : 'text-white/65 group-hover:text-white/90'}`}>{item.name}</span>
    </motion.div>
  );
}

// ─── Testimonial card ─────────────────────────────────────────────────────────
function TestimonialCard({ item, i }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: i * 0.1, ease }}
      className="group relative flex flex-col rounded-2xl overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'var(--c-surface)',
        border: `1px solid var(--c-border)`,
      }}
    >
      {/* Accent top strip */}
      <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${item.accentColor}, transparent)` }} />

      {/* Hover glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ boxShadow: `inset 0 0 0 1px ${item.accentColor}35` }}
        aria-hidden
      />

      {/* Quote mark */}
      <div
        className="text-5xl font-serif leading-none mb-4 select-none"
        style={{ color: item.accentColor, opacity: 0.35 }}
        aria-hidden
      >"</div>

      <p className={`text-sm leading-[1.85] mb-6 flex-1 ${isLight ? 'text-slate-600' : 'text-white/65'}`}>{item.quote}</p>

      <div className={`border-t pt-5 ${isLight ? 'border-slate-200' : 'border-white/[0.07]'}`}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-white/75'}`}>{item.author}</p>
            <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-white/35'}`}>{item.company}</p>
            <p className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-white/25'}`}>{item.size}</p>
          </div>
          <span
            className="px-3 py-1.5 rounded-full text-[10px] font-bold"
            style={{ background: item.accentColor + '18', border: `1px solid ${item.accentColor}35`, color: item.accentColor }}
          >
            {item.outcome}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ text, color = LIME }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="h-px w-8" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <span className="text-[10px] tracking-[0.5em] uppercase font-semibold" style={{ color }}>{text}</span>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────
export default function CaseStudies() {
  const [activeFilter, setActiveFilter] = useState('All');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const featured = CASE_STUDIES.find(c => c.featured);
  const rest = CASE_STUDIES.filter(c => !c.featured);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return rest;
    return CASE_STUDIES.filter(c => c.filters.includes(activeFilter));
  }, [activeFilter, rest]);

  return (
    <>
      <Header />

      <main className={`relative min-h-screen overflow-hidden ${isLight ? 'bg-slate-50' : 'bg-[#05070a]'}`}>

        {/* Global ambient bg */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              `radial-gradient(65% 45% at 15% 8%, ${TEAL}10 0%, transparent 60%),` +
              `radial-gradient(50% 35% at 85% 5%, ${LIME}08 0%, transparent 60%),` +
              `radial-gradient(40% 30% at 50% 95%, #818cf808 0%, transparent 60%)`,
          }}
        />

        {/* Dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 90% 50% at 50% 0%, black 0%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 50% at 50% 0%, black 0%, transparent 100%)',
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════════
            1. HERO
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative mx-auto max-w-7xl px-6 md:px-10 pt-32 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 items-center">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease }}
            >
              <div className="mb-5 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full"
                style={{ background: `${TEAL}14`, border: `1px solid ${TEAL}35` }}
              >
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: TEAL }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: TEAL }}>
                  Enterprise Success Stories
                </span>
              </div>

              <h1 className={`font-display text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.05] mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Real Business Challenges.{' '}
                <span
                  style={{
                    background: `linear-gradient(110deg, ${LIME}, ${TEAL})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Real Measurable Results.
                </span>
              </h1>

              <p className={`text-base md:text-lg leading-relaxed max-w-xl mb-10 ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                Genufy partners with organisations across manufacturing, healthcare, retail, banking and beyond to deliver scalable Salesforce, AI, Data Cloud, Snowflake, MuleSoft and Digital Transformation solutions that move the needle.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#case-studies"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold transition-all duration-300 hover:brightness-110 hover:scale-[1.02]"
                  style={{ background: `linear-gradient(110deg, ${LIME} 0%, ${TEAL} 100%)`, color: '#05070a' }}
                >
                  Explore Case Studies →
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-white/[0.06]"
                  style={{ background: 'var(--c-surface-md)', border: '1px solid var(--c-border-md)', color: 'rgba(255,255,255,0.75)' }}
                >
                  Talk to an Expert
                </Link>
              </div>
            </motion.div>

            {/* Right — illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease, delay: 0.15 }}
              className="relative h-[420px] lg:h-[480px]"
            >
              <HeroIllustration />
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            2. FEATURED CASE STUDY
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative mx-auto max-w-7xl px-6 md:px-10 pb-24">
          <SectionLabel text="Featured Case Study" color={TEAL} />
          {featured && <FeaturedCard post={featured} />}
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            3 & 4. FILTER + CASE STUDY GRID
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="case-studies" className="relative mx-auto max-w-7xl px-6 md:px-10 pb-24 scroll-mt-24">
          <SectionLabel text="All Case Studies" color={LIME} />

          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <h2 className={`font-display text-2xl md:text-3xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Client Success Stories
            </h2>
          </div>

          {/* Filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-200 focus:outline-none"
                style={
                  activeFilter === f
                    ? { background: `linear-gradient(135deg, ${LIME}, ${TEAL})`, color: '#05070a' }
                    : { background: 'var(--c-surface-md)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.50)' }
                }
              >
                {f}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <p className={`text-sm ${isLight ? 'text-slate-400' : 'text-white/30'}`}>No case studies for this filter yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((c, i) => (
                    <CaseCard key={c.id} post={c} i={i} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            5. SUCCESS METRICS
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative mx-auto max-w-7xl px-6 md:px-10 pb-24">
          <div
            className="relative rounded-3xl overflow-hidden p-10 md:p-16"
            style={{
              background: 'var(--c-surface)',
              border: '1px solid var(--c-border)',
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: `radial-gradient(70% 60% at 50% 0%, ${TEAL}10, transparent)` }}
            />
            <div className="relative text-center mb-12">
              <SectionLabel text="Impact in Numbers" />
              <h2 className={`font-display text-3xl md:text-4xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Proven at Enterprise Scale
              </h2>
            </div>
            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-5">
              {METRICS.map((m, i) => <MetricCard key={m.label} {...m} i={i} />)}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            6. TIMELINE
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative mx-auto max-w-7xl px-6 md:px-10 pb-24">
          <div className="text-center mb-14">
            <SectionLabel text="How We Deliver" />
            <h2 className={`font-display text-3xl md:text-4xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Your Path to Business Growth
            </h2>
            <p className={`mt-4 text-base max-w-xl mx-auto leading-relaxed ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
              A disciplined, five-stage delivery model that keeps every project on time, on budget and on target.
            </p>
          </div>

          {/* Desktop horizontal timeline */}
          <div className="relative hidden lg:flex items-start gap-0">
            {TIMELINE.map((t, i) => (
              <TimelineStep key={t.step} {...t} i={i} total={TIMELINE.length} />
            ))}
          </div>

          {/* Mobile vertical timeline */}
          <div className="lg:hidden space-y-0">
            {TIMELINE.map((t, i) => (
              <motion.div
                key={t.step}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease }}
                className="relative flex gap-5 pb-8 last:pb-0"
              >
                {/* Vertical line */}
                {i < TIMELINE.length - 1 && (
                  <div
                    aria-hidden
                    className="absolute left-[21px] top-11 bottom-0 w-px"
                    style={{ background: `linear-gradient(180deg, ${TEAL}40, transparent)` }}
                  />
                )}
                <div
                  className="h-11 w-11 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{ background: `${TEAL}18`, border: `1px solid ${TEAL}40`, color: LIME }}
                >
                  {t.step}
                </div>
                <div className="pt-2">
                  <p className={`font-display text-sm font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.title}</p>
                  <p className={`text-[13px] leading-relaxed ${isLight ? 'text-slate-400' : 'text-white/40'}`}>{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            7. TECHNOLOGY EXPERTISE
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative mx-auto max-w-7xl px-6 md:px-10 pb-24">
          <div className="text-center mb-12">
            <SectionLabel text="Technology Stack" />
            <h2 className={`font-display text-3xl md:text-4xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Enterprise Technology Expertise
            </h2>
            <p className={`mt-4 text-base max-w-lg mx-auto ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
              Deep certified expertise across the platforms that power modern enterprises.
            </p>
          </div>
          <div className="relative grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {TECH_STACK.map((t, i) => (
              <TechCard key={t.name} item={t} i={i} />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            8. TESTIMONIALS
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative mx-auto max-w-7xl px-6 md:px-10 pb-24">
          <div className="text-center mb-12">
            <SectionLabel text="Client Voices" color={TEAL} />
            <h2 className={`font-display text-3xl md:text-4xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              What Our Clients Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} item={t} i={i} />)}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            9. FINAL CTA
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative mx-auto max-w-7xl px-6 md:px-10 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease }}
            className="relative overflow-hidden rounded-3xl text-center px-8 py-16 md:py-20"
            style={{
              background: `linear-gradient(145deg, ${TEAL}16 0%, rgba(5,7,10,0.96) 50%, ${LIME}10 100%)`,
              border: `1px solid rgba(255,255,255,0.08)`,
            }}
          >
            {/* Background glows */}
            <div aria-hidden className="pointer-events-none absolute inset-0"
              style={{ background: `radial-gradient(60% 60% at 30% 50%, ${TEAL}14, transparent), radial-gradient(50% 50% at 70% 50%, ${LIME}0a, transparent)` }}
            />

            <div className="relative">
              <p className="text-[11px] tracking-[0.5em] uppercase font-semibold mb-5" style={{ color: LIME }}>
                Ready to Start?
              </p>
              <h2 className={`font-display text-3xl md:text-5xl font-extrabold tracking-tight mb-5 leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Ready to Become Our<br className="hidden md:block" /> Next Success Story?
              </h2>
              <p className={`text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed ${isLight ? 'text-slate-400' : 'text-white/45'}`}>
                Join 120+ organisations that chose Genufy to solve complex business challenges and deliver measurable outcomes.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:brightness-110 hover:scale-[1.02]"
                  style={{ background: `linear-gradient(110deg, ${LIME} 0%, ${TEAL} 100%)`, color: '#05070a' }}
                >
                  Start Your Project →
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-white/[0.07]"
                  style={{ background: 'var(--c-surface-md)', border: '1px solid var(--c-border-md)', color: 'rgba(255,255,255,0.75)' }}
                >
                  Schedule a Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

      </main>

      <SiteFooter />
    </>
  );
}
