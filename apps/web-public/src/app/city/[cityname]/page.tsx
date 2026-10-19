import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateSeoMetadata } from '@/lib/seo/metadata';
import { buildFaqJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo/jsonld';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

interface CityData {
  slug: string;
  name: string;
  urduName: string;
  description: string;
  stats: {
    verifiedProfiles: string;
    avgMatchDays: string;
    universities: string[];
  };
  faqs: { question: string; answer: string }[];
}

const CITIES: Record<string, CityData> = {
  lahore: {
    slug: 'lahore',
    name: 'Lahore',
    urduName: 'لاہور',
    description: 'Find educated, verified Muslim candidates in Lahore. Comprehensive background checks, LUMS/UET/PU alumni verification, and family-assisted introductions.',
    stats: {
      verifiedProfiles: '15,000+',
      avgMatchDays: '18 Days',
      universities: ['LUMS', 'UET Lahore', 'Punjab University', 'FAST NUCES', 'KEMU']
    },
    faqs: [
      {
        question: 'How are Lahore matrimonial profiles verified on Wasl?',
        answer: 'Every candidate in Lahore must verify their CNIC via NADRA-compliant selfie liveness, plus submit degree certificates from institutions like LUMS, FAST, or PU before receiving verification badges.'
      },
      {
        question: 'Can Lahore families participate in the proposal review?',
        answer: 'Yes. Candidates can invite parents or guardians residing in Lahore (e.g. DHA, Gulberg, Model Town, Johar Town) with permission to review proposals and attend supervised chats.'
      }
    ]
  },
  islamabad: {
    slug: 'islamabad',
    name: 'Islamabad & Rawalpindi',
    urduName: 'اسلام آباد اور راولپنڈی',
    description: 'Connect with verified civil servants, tech professionals, and doctors in Islamabad & Rawalpindi with family guardianship and explainable compatibility.',
    stats: {
      verifiedProfiles: '9,500+',
      avgMatchDays: '14 Days',
      universities: ['NUST', 'Quaid-i-Azam University', 'COMSATS', 'FAST Islamabad']
    },
    faqs: [
      {
        question: 'Are government and corporate professionals verified in Islamabad?',
        answer: 'Yes, Wasl verifies employment credentials for civil servants, multinational executives, and tech professionals across the twin cities.'
      }
    ]
  },
  karachi: {
    slug: 'karachi',
    name: 'Karachi',
    urduName: 'کراچی',
    description: 'Premier verified matrimonial platform for Karachi professionals. Verified IBA, NED, and AKU graduates with family chaperone options.',
    stats: {
      verifiedProfiles: '22,000+',
      avgMatchDays: '21 Days',
      universities: ['IBA Karachi', 'NED University', 'Aga Khan University', 'Karachi University']
    },
    faqs: [
      {
        question: 'How does Wasl handle photo privacy for Karachi candidates?',
        answer: 'Wasl enforces blur-by-default and reveal-on-mutual-interest with dynamic viewer watermarking to prevent unauthorized screenshotting.'
      }
    ]
  },
  faisalabad: {
    slug: 'faisalabad',
    name: 'Faisalabad',
    urduName: 'فیصل آباد',
    description: 'Verified matrimonial matchmaking for Faisalabad business and professional families with structured family participation.',
    stats: {
      verifiedProfiles: '5,000+',
      avgMatchDays: '20 Days',
      universities: ['UAF', 'GCUF', 'NFC IEFR']
    },
    faqs: [
      {
        question: 'Is family mode suitable for traditional Faisalabad rishta customs?',
        answer: 'Yes, Wasl was engineered to honor family customs by allowing guardians full proposal review rights while candidates maintain sovereign consent.'
      }
    ]
  }
};

export async function generateStaticParams() {
  return Object.keys(CITIES).map(cityname => ({ cityname }));
}

export async function generateMetadata({ params }: { params: Promise<{ cityname: string }> }): Promise<Metadata> {
  const { cityname } = await params;
  const city = CITIES[cityname.toLowerCase()];
  if (!city) return notFound();

  return generateSeoMetadata({
    title: `Verified Matrimonial in ${city.name} | Rishta Platform`,
    description: city.description,
    canonicalPath: `/city/${city.slug}`
  });
}

export default async function CityPage({ params }: { params: Promise<{ cityname: string }> }) {
  const { cityname } = await params;
  const city = CITIES[cityname.toLowerCase()];
  if (!city) return notFound();

  const faqJsonLd = buildFaqJsonLd(city.faqs);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: `Rishta in ${city.name}`, url: `/city/${city.slug}` }
  ]);

  return (
    <div className="space-y-16 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <MapPin className="w-4 h-4" /> Localized Matrimonial in {city.name} • <span className="urdu-text text-sm font-normal">{city.urduName}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Verified Rishta & Matrimonial Services in <span className="text-emerald-800">{city.name}</span>
        </h1>

        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          {city.description}
        </p>

        {/* Localized stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-3xl font-extrabold text-emerald-800">{city.stats.verifiedProfiles}</div>
            <div className="text-sm font-medium text-slate-600 mt-1">Verified {city.name} Profiles</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-3xl font-extrabold text-slate-900">{city.stats.avgMatchDays}</div>
            <div className="text-sm font-medium text-slate-600 mt-1">Average Introduction Time</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Verified Alumni From</div>
            <div className="flex flex-wrap gap-1.5">
              {city.stats.universities.map(u => (
                <span key={u} className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-800">
                  {u}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Local FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h2 className="text-2xl font-bold text-slate-900 text-center">Frequently Asked Questions — {city.name}</h2>
        <div className="space-y-4">
          {city.faqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h3 className="text-base font-semibold text-slate-900">{faq.question}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-emerald-800 text-white p-12 rounded-3xl space-y-6 shadow-xl">
        <h2 className="text-3xl font-bold">Start Meeting Verified Candidates in {city.name}</h2>
        <p className="text-emerald-100 max-w-xl mx-auto text-sm leading-relaxed">
          Create your verified profile in under 3 minutes. Your documents remain strictly encrypted and confidential.
        </p>
        <Link
          href="/how-it-works"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-emerald-900 font-bold hover:bg-emerald-50 transition shadow-md"
        >
          Register for {city.name} <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
