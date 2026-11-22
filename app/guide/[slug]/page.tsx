import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllGuides, getGuideBySlug } from '@/lib/guides';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { absoluteUrl } from '@/lib/site';
import { BookOpen, Calendar, Clock, ChevronRight, HelpCircle } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  const guides = getAllGuides();
  return guides.map((g) => ({
    slug: g.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return {
    title: `${guide.metaTitle} | Ododex`,
    description: guide.metaDescription,
    alternates: {
      canonical: absoluteUrl(`/guide/${guide.slug}`),
    },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: absoluteUrl(`/guide/${guide.slug}`),
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const otherGuides = getAllGuides().filter((g) => g.slug !== guide.slug);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.metaDescription,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    mainEntityOfPage: absoluteUrl(`/guide/${guide.slug}`),
    publisher: {
      '@type': 'Organization',
      name: 'Ododex',
      url: 'https://ododex.com',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <article className="space-y-8 max-w-3xl mx-auto">
        <Breadcrumbs
          items={[
            { name: 'Accueil', url: '/' },
            { name: 'Guides', url: '/#guides' },
            { name: guide.title, url: `/guide/${guide.slug}` },
          ]}
        />

        {/* Titre & Metas */}
        <header className="space-y-3 border-b border-line pb-6">
          <div className="flex items-center gap-3 text-xs text-secondary">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Mise à jour : {guide.updatedAt}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Temps de lecture : {guide.readTime}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-fg tracking-tight leading-tight">
            {guide.title}
          </h1>

          <p className="text-base text-secondary leading-relaxed font-normal">
            {guide.summary}
          </p>
        </header>

        {/* Publicité 1 */}
        <AdSlot />

        {/* Sections de contenu */}
        <div className="space-y-8 text-sm leading-relaxed text-secondary">
          {guide.sections.map((section, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="text-xl font-bold text-fg tracking-tight">
                {section.heading}
              </h2>
              {section.content.map((p, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* Publicité 2 */}
        <AdSlot />

        {/* FAQ spécifique */}
        {guide.faqs.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-line">
            <h2 className="text-xl font-bold text-fg flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-accent" />
              Questions fréquentes
            </h2>
            <div className="space-y-3">
              {guide.faqs.map((faq, idx) => (
                <div key={idx} className="card p-4 border-line bg-surface rounded-xl space-y-1.5">
                  <h3 className="text-sm font-bold text-fg">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Autres guides */}
        {otherGuides.length > 0 && (
          <section className="space-y-4 pt-8 border-t border-line">
            <h2 className="text-lg font-bold text-fg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              À lire également
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {otherGuides.slice(0, 2).map((g) => (
                <Link
                  key={g.slug}
                  href={`/guide/${g.slug}`}
                  className="card p-4 border-line bg-surface hover:border-accent/60 transition-colors flex items-center justify-between text-xs group"
                >
                  <span className="font-semibold text-fg group-hover:text-accent transition-colors line-clamp-2">
                    {g.title}
                  </span>
                  <ChevronRight className="w-4 h-4 text-secondary shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
