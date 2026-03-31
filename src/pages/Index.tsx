import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Landmark, MapPin, Search, Shield } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { StatsCards } from '@/components/StatsCards';
import { useIFSCData } from '@/hooks/useIFSCData';
import { getOverallStats } from '@/lib/csvParser';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SEO } from '@/components/SEO';
import { TOOL_CATALOG } from '@/data/toolCatalog';

type Suggestion = { label: string; href: string; type: 'bank' | 'tool' };
type Tool = { title: string; description: string; href: string; icon: typeof Search };

const POPULAR_BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Canara Bank'];

const TOOLS: Tool[] = [
  { title: 'IFSC Code Finder India', description: 'Bank IFSC search by bank, state, city and branch.', href: '/banks', icon: Search },
  { title: 'Find MICR Code Online', description: 'Search MICR code for cheque clearing needs.', href: '/micr-code-finder', icon: Landmark },
  { title: 'Bank Branch Details India', description: 'Locate branch address, contact and code details.', href: '/banks', icon: MapPin },
  { title: 'NEFT IFSC Search Tool', description: 'Verify IFSC before NEFT transfer.', href: '/neft-ifsc-search', icon: Building2 },
  { title: 'RTGS IFSC Search Tool', description: 'Check IFSC for high-value RTGS payments.', href: '/rtgs-ifsc-search', icon: Building2 },
  { title: 'IMPS IFSC Search Tool', description: 'Instant IFSC lookup for IMPS transfer.', href: '/imps-ifsc-search', icon: Building2 },
];

const faqItems = [
  { q: 'IFSC code kya hota hai?', a: 'IFSC ek 11 character code hota hai jo India ke har bank branch ko uniquely identify karta hai.' },
  { q: 'MICR code ka use kya hai?', a: 'MICR code cheque processing, CTS clearing aur ECS related transactions mein use hota hai.' },
  { q: 'IFSC code kaise find kare?', a: 'Passbook, cheque leaf, bank website ya hamare IFSC finder tool se easily find kar sakte ho.' },
  { q: 'Kya IFSC code same hota hai har branch ka?', a: 'Nahi, har branch ka IFSC code alag hota hai. Bank same ho sakta hai, branch code alag hoga.' },
  { q: 'IFSC aur MICR mein difference kya hai?', a: 'IFSC online transfer (NEFT/RTGS/IMPS) ke liye hota hai, MICR cheque clearing ke liye hota hai.' },
  { q: 'NEFT mein IFSC zaroori hai?', a: 'Haan, NEFT transfer karte time beneficiary account number ke saath IFSC mandatory hota hai.' },
  { q: 'RTGS kis amount se start hota hai?', a: 'RTGS generally high-value transfer ke liye hota hai, minimum bank policies ke according hota hai.' },
  { q: 'IMPS 24x7 chalta hai kya?', a: 'Haan, IMPS mostly 24x7 available hota hai aur instant settlement deta hai.' },
  { q: 'Wrong IFSC daalne par kya hoga?', a: 'Aksar transaction fail ho jata hai. Agar code valid but wrong branch hai to delay ho sakta hai, turant bank ko contact karein.' },
  { q: 'Kya IFSC code update/change ho sakta hai?', a: 'Haan, merger, branch relocation ya bank restructuring ke baad IFSC change ho sakta hai.' },
  { q: 'SBI IFSC code Mumbai branch kaise milega?', a: 'Search box mein SBI + Mumbai + branch name enter karke directly result pa sakte ho.' },
  { q: 'HDFC IFSC code Delhi ka fastest method kya hai?', a: 'Bank IFSC search tool par HDFC, Delhi, branch select karo aur code copy karo.' },
];

export default function Index() {
  const navigate = useNavigate();
  const { data, indices, loading, error } = useIFSCData();
  const [query, setQuery] = useState('');

  const stats = useMemo(() => getOverallStats(data), [data]);
  const suggestions = useMemo<Suggestion[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const banks = (indices?.banks ?? POPULAR_BANKS)
      .filter((bank) => bank.toLowerCase().includes(q))
      .slice(0, 5)
      .map((bank) => ({ label: bank, href: `/bank/${encodeURIComponent(bank)}`, type: 'bank' as const }));

    const tools = TOOLS
      .filter((toolItem) => toolItem.title.toLowerCase().includes(q))
      .slice(0, 3)
      .map((toolItem) => ({ label: toolItem.title, href: toolItem.href, type: 'tool' as const }));

    return [...banks, ...tools].slice(0, 8);
  }, [indices, query]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SEO
        title="IFSC Code Finder India, MICR Search & 100+ Calculators | bankifsccode"
        description="IFSC code finder, bank IFSC search, MICR code India lookup, bank branch details India aur 100+ financial, health, math calculators ek hi platform par."
        path="/"
        keywords="IFSC code finder, bank IFSC search, MICR code, bank branch details India, SBI IFSC code Mumbai branch, HDFC IFSC code Delhi, ICICI bank IFSC near me"
        schema={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.bankifsccode.biz/' },
              ],
            },
            {
              '@type': 'FAQPage',
              mainEntity: faqItems.slice(0, 8).map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
              })),
            },
          ],
        }}
      />

      <Header />
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-100/70">
          <div className="container mx-auto px-4 py-10 sm:py-16">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 border-0 bg-primary text-primary-foreground">Best IFSC Code Finder</Badge>
              <h1 className="text-3xl font-bold leading-tight sm:text-5xl">IFSC Code Finder India + MICR Code Finder + Bank Branch Details</h1>
              <p className="mx-auto mt-4 max-w-3xl text-sm text-slate-600 sm:text-base">
                Bankifsccode.biz par aapko bank IFSC search, MICR code lookup, NEFT/RTGS/IMPS guide aur 100+ calculators milte hain. Simple Hinglish interface, fast search aur mobile-friendly design.
              </p>

              <div className="mx-auto mt-8 max-w-3xl">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search IFSC Code, Bank Branch, City..." className="h-14 rounded-xl border-slate-200 bg-white pl-12 text-base shadow-sm" />
                  {suggestions.length > 0 && (
                    <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-xl">
                      {suggestions.map((item) => (
                        <button key={`${item.type}-${item.label}`} onClick={() => navigate(item.href)} className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-sm last:border-b-0 hover:bg-slate-50">
                          <span>{item.label}</span>
                          <Badge variant="outline" className="capitalize">{item.type}</Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button asChild className="rounded-full"><Link to="/banks">Open IFSC Finder</Link></Button>
                <Button asChild variant="outline" className="rounded-full"><Link to="/tools">Explore 100+ Tools</Link></Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 sm:py-10">
          {loading ? <Loader text="Loading IFSC data..." /> : <StatsCards stats={stats} variant="gradient" />}
          {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        </section>

        <section className="container mx-auto px-4 pb-10">
          <div className="mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-slate-700" /><h2 className="text-xl font-semibold sm:text-2xl">Bank IFSC Search Tool & Featured Services</h2></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{TOOLS.map((item) => (<Link key={item.title} to={item.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><item.icon className="mb-3 h-5 w-5 text-slate-700" /><h3 className="font-semibold">{item.title}</h3><p className="mt-1 text-sm text-slate-600">{item.description}</p></Link>))}</div>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <Card><CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">What is IFSC Code? (11 Character Structure)</h2>
            <p>IFSC ka full form Indian Financial System Code hota hai. Yeh 11 character ka alphanumeric code hota hai: pehle 4 letters bank ko show karte hain, 5th character हमेशा 0 hota hai, aur last 6 characters branch code hote hain.</p>
            <h3 className="text-lg font-semibold">What is MICR Code?</h3>
            <p>MICR (Magnetic Ink Character Recognition) 9-digit code hota hai jo cheque clearing system mein use hota hai. Iska kaam branch aur city clearing house identify karna hota hai.</p>
            <h3 className="text-lg font-semibold">IFSC vs MICR Difference</h3>
            <p>IFSC online transfer ke liye (NEFT, RTGS, IMPS), jabki MICR cheque processing ke liye. Dono bank branch identity se linked hain, but use-case alag hai.</p>
          </CardContent></Card>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <h2 className="text-2xl font-semibold">How to Find IFSC Code Online (Step-by-Step)</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card><CardContent className="p-5"><h3 className="font-semibold">Step 1: Bank Website</h3><p className="text-sm text-slate-600 mt-2">Official bank site par branch locator use karke IFSC aur branch details nikaal sakte ho.</p></CardContent></Card>
            <Card><CardContent className="p-5"><h3 className="font-semibold">Step 2: Passbook</h3><p className="text-sm text-slate-600 mt-2">Passbook ke front page ya account details section mein IFSC usually printed hota hai.</p></CardContent></Card>
            <Card><CardContent className="p-5"><h3 className="font-semibold">Step 3: Cheque Leaf</h3><p className="text-sm text-slate-600 mt-2">Cheque par branch name ke aas-paas IFSC aur niche MICR code available hota hai.</p></CardContent></Card>
            <Card><CardContent className="p-5"><h3 className="font-semibold">Step 4: IFSC Finder Tool</h3><p className="text-sm text-slate-600 mt-2">Hamare tool mein bank/state/city/branch select karke instant IFSC copy kar lo.</p></CardContent></Card>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <h2 className="text-2xl font-semibold">Internal Linking Structure (SEO + UX)</h2>
          <ul className="mt-3 list-disc pl-6 space-y-2 text-sm text-slate-700">
            <li><Link to="/banks" className="text-primary underline">Bank-wise pages</Link> → SBI, HDFC, ICICI, PNB, Axis, BoB pages.</li>
            <li><Link to="/banks" className="text-primary underline">State-wise pages</Link> → States → Cities → Branch detail pages.</li>
            <li><Link to="/tools" className="text-primary underline">Calculator tools</Link> → Financial, health, math, utility, advanced categories.</li>
            <li><Link to="/blogs" className="text-primary underline">Blog articles</Link> → IFSC guides, NEFT RTGS IMPS, EMI and finance tips.</li>
          </ul>
          <p className="mt-4 text-sm text-slate-600">Currently available calculators: <strong>{TOOL_CATALOG.length} tools</strong> with dedicated SEO-friendly pages.</p>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <Card key={item.q}><CardContent className="p-4"><h3 className="font-semibold">{item.q}</h3><p className="mt-2 text-sm text-slate-600">{item.a}</p></CardContent></Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
