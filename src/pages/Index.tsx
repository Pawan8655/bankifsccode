import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Landmark, MapPin, Search, Shield, Building, Map, GitBranch, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { StatsCards } from '@/components/StatsCards';
import { useIFSCData } from '@/hooks/useIFSCData';
import { getBranchByIFSC, getOverallStats } from '@/lib/csvParser';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SEO } from '@/components/SEO';
import { TOOL_CATALOG } from '@/data/toolCatalog';
import blogs from './blogsData';

const POPULAR_SEARCHES = [
  { label: 'SBI Mumbai IFSC', bank: 'State Bank of India', state: 'MAHARASHTRA', city: 'MUMBAI' },
  { label: 'HDFC Delhi IFSC', bank: 'HDFC Bank', state: 'DELHI', city: 'DELHI' },
  { label: 'ICICI Bangalore IFSC', bank: 'ICICI Bank', state: 'KARNATAKA', city: 'BANGALORE' },
];

const POPULAR_BANK_LINKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Punjab National Bank'];

const encode = (value: string) => encodeURIComponent(value);
const buildBranchPath = (bank: string, state: string, city: string, branch: string) => `/bank/${encode(bank)}/${encode(state)}/${encode(city)}/${encode(branch)}`;

export default function Index() {
  const navigate = useNavigate();
  const { data, indices, loading, error } = useIFSCData();

  const [bank, setBank] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [branch, setBranch] = useState('');
  const [ifscQuick, setIfscQuick] = useState('');

  const stats = useMemo(() => getOverallStats(data), [data]);

  const banks = useMemo(() => indices?.banks ?? [], [indices]);
  const states = useMemo(() => (bank ? Array.from(indices?.statesMap.get(bank) ?? []).sort() : []), [bank, indices]);
  const cities = useMemo(() => (bank && state ? Array.from(indices?.citiesMap.get(bank)?.get(state) ?? []).sort() : []), [bank, state, indices]);
  const branches = useMemo(() => {
    if (!bank || !state || !city) return [];
    const branchRows = indices?.branchesMap.get(bank)?.get(state)?.get(city) ?? [];
    return [...new Set(branchRows.map((item) => item.Branch))].sort();
  }, [bank, state, city, indices]);

  const latestBlogs = useMemo(() => blogs.slice(0, 5), []);

  const onSearch = () => {
    if (!bank || !state || !city || !branch) return;
    navigate(buildBranchPath(bank, state, city, branch));
  };

  const onQuickIFSCSearch = () => {
    const found = getBranchByIFSC(data, ifscQuick.trim());
    if (!found) return;
    navigate(buildBranchPath(found.Bank, found.State, found.City, found.Branch));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SEO
        title="IFSC Code Finder – Bank IFSC Search India | bankifsccode"
        description="Find IFSC code, MICR code, and bank branch details across India instantly."
        path="/"
        keywords="IFSC code finder, bank IFSC search, MICR code India"
        schema={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'IFSC code kya hota hai?', acceptedAnswer: { '@type': 'Answer', text: 'IFSC bank branch ka unique 11-character code hota hai jo online transfer routing ke liye use hota hai.' } },
                { '@type': 'Question', name: 'MICR code India ka use kya hai?', acceptedAnswer: { '@type': 'Answer', text: 'MICR code cheque clearing aur branch identification ke liye use hota hai.' } },
              ],
            },
            {
              '@type': 'WebSite',
              name: 'bankifsccode.biz',
              url: 'https://www.bankifsccode.biz/',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://www.bankifsccode.biz/branch/{search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            },
          ],
        }}
      />

      <Header />
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-100/70">
          <div className="container mx-auto px-4 py-10 sm:py-14">
            <div className="mx-auto max-w-5xl text-center">
              <Badge className="mb-4 border-0 bg-primary text-primary-foreground">Fast IFSC Search Experience</Badge>
              <h1 className="text-3xl font-bold leading-tight sm:text-5xl">IFSC Code Finder – Bank IFSC Search India</h1>
              <p className="mx-auto mt-4 max-w-3xl text-sm text-slate-600 sm:text-base">Powerful dependent dropdown search ke saath bank, state, city, branch select karo aur instantly branch page open karo with IFSC, MICR, address aur contact details.</p>
            </div>

            <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Field icon={Building} label="Select Bank">
                  <select value={bank} onChange={(e) => { setBank(e.target.value); setState(''); setCity(''); setBranch(''); }} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm">
                    <option value="">Select Bank</option>
                    {banks.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </Field>

                <Field icon={Map} label="Select State">
                  <select value={state} onChange={(e) => { setState(e.target.value); setCity(''); setBranch(''); }} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm" disabled={!bank}>
                    <option value="">Select State</option>
                    {states.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </Field>

                <Field icon={MapPin} label="Select City">
                  <select value={city} onChange={(e) => { setCity(e.target.value); setBranch(''); }} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm" disabled={!state}>
                    <option value="">Select City</option>
                    {cities.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </Field>

                <Field icon={GitBranch} label="Select Branch">
                  <select value={branch} onChange={(e) => setBranch(e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm" disabled={!city}>
                    <option value="">Select Branch</option>
                    {branches.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </Field>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button onClick={onSearch} disabled={!branch} className="h-11 rounded-lg px-6">
                  <Search className="mr-2 h-4 w-4" /> Search IFSC Code
                </Button>
                <div className="flex w-full max-w-md gap-2">
                  <Input placeholder="Quick search by IFSC (e.g. SBIN0001234)" value={ifscQuick} onChange={(e) => setIfscQuick(e.target.value.toUpperCase())} className="h-11" />
                  <Button variant="outline" onClick={onQuickIFSCSearch} disabled={!ifscQuick.trim()}>
                    Quick Search
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="font-semibold text-slate-600">Popular searches:</span>
                {POPULAR_SEARCHES.map((item) => (
                  <button key={item.label} className="rounded-full border px-3 py-1 hover:bg-slate-100" onClick={() => {
                    setBank(item.bank);
                    setState(item.state);
                    setCity(item.city);
                    setBranch('');
                  }}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 sm:py-10">{loading ? <Loader text="Loading IFSC data..." /> : <StatsCards stats={stats} variant="gradient" />}{error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}</section>

        <section className="container mx-auto px-4 pb-10">
          <Card><CardContent className="p-6">
            <h2 className="text-2xl font-semibold">🏦 About IFSC Code</h2>
            <p className="mt-3 text-sm text-slate-700">IFSC code (Indian Financial System Code) ek unique 11-character bank branch code hai. Online transaction mein correct IFSC use karna important hai taaki amount sahi branch mein safely transfer ho.</p>
          </CardContent></Card>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <h2 className="text-2xl font-semibold">🔍 How to Use IFSC Finder</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {['Bank select karein', 'State aur City choose karein', 'Branch select karke Search IFSC Code button click karein'].map((step) => (
              <Card key={step}><CardContent className="p-4 flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" /><p className="text-sm">{step}</p></CardContent></Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <h2 className="text-2xl font-semibold">⚡ Popular Banks</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {POPULAR_BANK_LINKS.map((b) => <Link key={b} to={`/bank/${encode(b)}`} className="rounded-full border bg-white px-4 py-2 text-sm hover:bg-slate-100">{b}</Link>)}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <h2 className="text-2xl font-semibold">🧮 Financial Calculators</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              { title: 'EMI Calculator', href: '/emi-calculator' },
              { title: 'SIP Calculator', href: '/sip-calculator' },
              { title: 'FD Calculator', href: '/fd-calculator' },
            ].map((tool) => (
              <Link key={tool.title} to={tool.href} className="rounded-xl border bg-white p-4 hover:border-primary/40">
                <h3 className="font-semibold">{tool.title}</h3>
                <p className="text-sm text-slate-600 mt-2">Use {tool.title.toLowerCase()} for fast planning and better financial decisions.</p>
              </Link>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-600">Total tools available: <strong>{TOOL_CATALOG.length}+</strong></p>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <h2 className="text-2xl font-semibold">📝 Latest Blog Posts</h2>
          <div className="mt-4 space-y-3">
            {latestBlogs.map((post) => (
              <Link key={post.id} to="/blogs" className="block rounded-lg border bg-white p-4 hover:border-primary/40">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{post.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-slate-700" /><h2 className="text-2xl font-semibold">FAQ</h2></div>
          <div className="space-y-3">
            {[
              ['IFSC code finder se kya milta hai?', 'Aapko IFSC, MICR code India details, address, bank branch details milte hain.'],
              ['Bank IFSC search ka best method?', 'Bank + state + city + branch dependent dropdown method sabse accurate hota hai.'],
              ['Kya direct IFSC se search kar sakte hain?', 'Haan, quick search input mein IFSC daal ke direct branch page open kar sakte hain.'],
              ['MICR code India kahan use hota hai?', 'Cheque processing aur ECS workflow mein use hota hai.'],
            ].map(([q, a]) => (
              <Card key={q}><CardContent className="p-4"><h3 className="font-semibold">{q}</h3><p className="mt-2 text-sm text-slate-600">{a}</p></CardContent></Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({ icon: Icon, label, children }: { icon: typeof Building2; label: string; children: ReactNode }) {
  return (
    <label className="space-y-1 text-left">
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600"><Icon className="h-3.5 w-3.5" /> {label}</span>
      {children}
    </label>
  );
}
