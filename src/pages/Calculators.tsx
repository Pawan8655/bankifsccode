import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Calculator, ArrowRight, TrendingUp, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';

const tools = [
  {
    title: 'EMI Calculator',
    slug: '/emi-calculator',
    description: 'Estimate loan EMI, interest burden, and total repayment in seconds with chart visualization.',
  },
  {
    title: 'SIP Calculator',
    slug: '/sip-calculator',
    description: 'Project long-term SIP wealth creation with growth chart and inflation-aware planning guidance.',
  },
];

export default function Calculators() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Financial Calculators India | bankifsccode.biz tools"
        description="Explore bankifsccode.biz tools including EMI calculator and SIP calculator with clean URLs, live calculations, and practical financial guidance for India."
        path="/tools"
      />
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-8">
          <Breadcrumbs items={[{ label: 'Banking Calculator Tools' }]} />
          <h1 className="text-4xl font-bold mt-4">Financial Calculators India</h1>
          <p className="mt-3 text-muted-foreground max-w-4xl">
            Welcome to bankifsccode.biz tools. Before jumping into calculations, review assumptions, loan terms,
            and risk profile. These free calculators are designed for practical planning and faster financial decisions.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {tools.map((tool) => (
              <article key={tool.slug} className="rounded-2xl border p-6 bg-card hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calculator className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">{tool.title}</h2>
                </div>
                <p className="text-muted-foreground">{tool.description}</p>
                <Link to={tool.slug} className="inline-flex items-center gap-2 mt-5 text-primary font-medium">
                  Open tool <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-600" /> Why use these tools?</h3>
              <ul className="mt-3 text-sm space-y-2 text-muted-foreground list-disc pl-5">
                <li>Live calculations with no registration needed.</li>
                <li>SEO-rich educational content for better financial understanding.</li>
                <li>Internal links to IFSC search pages for end-to-end execution.</li>
              </ul>
            </div>
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold flex items-center gap-2"><Landmark className="h-4 w-4 text-blue-600" /> Related bank services</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Need branch and transfer details after calculation? Use our <Link className="text-primary" to="/">bank IFSC code search</Link> and <Link className="text-primary" to="/banks">bank directory</Link> to find verified branch data quickly.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
