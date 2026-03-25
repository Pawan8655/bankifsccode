import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Building2, BookOpen } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchFilters } from '@/components/SearchFilters';
import { Loader } from '@/components/Loader';
import { useIFSCData } from '@/hooks/useIFSCData';
import { getUniqueBanks, getOverallStats } from '@/lib/csvParser';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';

const featuredTools = [
  { title: 'EMI Calculator', slug: '/emi-calculator' },
  { title: 'SIP Calculator', slug: '/sip-calculator' },
  { title: 'FD Calculator', slug: '/fd-calculator' },
  { title: 'Tax Calculator', slug: '/income-tax-calculator-india' },
  { title: 'Net Worth Calculator', slug: '/net-worth-calculator' },
];

export default function Index() {
  const { data, indices, loading, error } = useIFSCData();

  const banks = useMemo(() => (indices ? indices.banks : getUniqueBanks(data)).slice(0, 8), [data, indices]);
  const stats = useMemo(() => getOverallStats(data), [data]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-16 md:pb-0">
      <SEO
        title="All-in-One Financial Tools & IFSC Search | bankifsccode.biz"
        description="bankifsccode.biz offers bank IFSC search and 50+ free financial tools online including EMI, SIP, FD, tax, inflation, and budget planning calculators."
        path="/"
      />
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-10">
          <div className="rounded-2xl bg-white border p-6 md:p-10">
            <h1 className="text-3xl md:text-5xl font-bold text-[#1e3a8a]">All-in-One Financial Tools</h1>
            <p className="mt-4 text-slate-600 max-w-3xl">Search bank IFSC codes and use professional financial tools online. Fast, mobile-friendly, and built for smart planning.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/tools"><Button className="bg-[#1e3a8a] hover:bg-[#1e40af]">Explore Tools <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
              <Link to="/blogs"><Button variant="outline">Read Blogs</Button></Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <div className="rounded-2xl bg-white border p-6">
            <h2 className="text-2xl font-semibold">IFSC Code Finder</h2>
            <p className="text-slate-600 mt-2">Find accurate branch-level details for NEFT, RTGS and IMPS transfers.</p>
            <div className="mt-4">
              {loading ? <Loader text="Loading IFSC data..." /> : error ? <p className="text-red-600">{error}</p> : <SearchFilters data={data} indices={indices} />}
            </div>
            <p className="mt-4 text-sm text-slate-500">{loading ? '...' : stats.totalBranches.toLocaleString()} branches indexed.</p>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2"><Calculator className="h-5 w-5 text-[#1e3a8a]" /> Featured Tools</h2>
            <Link className="text-[#1e3a8a] text-sm font-medium" to="/tools">View all 50+ tools</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {featuredTools.map((tool) => (
              <Link key={tool.slug} to={tool.slug} className="bg-white border rounded-xl p-4 hover:border-[#1e3a8a]">
                <h3 className="font-semibold">{tool.title}</h3>
                <p className="text-xs text-slate-500 mt-1">Open calculator</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4"><Building2 className="h-5 w-5 text-[#1e3a8a]" /> Popular Banks</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {banks.map((bank) => (
              <Link key={bank} to={`/bank/${encodeURIComponent(bank)}`}>
                <Card className="hover:border-[#1e3a8a] bg-white"><CardContent className="p-4"><p className="font-medium">{bank}</p></CardContent></Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4"><BookOpen className="h-5 w-5 text-[#1e3a8a]" /> Latest Blogs</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              'Best EMI Calculator in India (2026 Guide)',
              'How to Calculate SIP Returns Easily',
              'Top Free Financial Tools for Smart Planning',
            ].map((title) => (
              <Link key={title} to="/blogs" className="bg-white border rounded-xl p-5 hover:border-[#1e3a8a]">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-slate-500 mt-2">Read full article with internal tool links.</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
