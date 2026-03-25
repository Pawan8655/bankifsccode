import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { TOOL_CATALOG, TOOL_CATEGORY_ORDER } from '@/data/toolCatalog';

export default function Calculators() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="50+ Financial Calculators India | bankifsccode.biz tools"
        description="Explore 50+ financial tools: EMI, SIP, FD, RD, tax, GST, loan, investment, business and utility calculators for India."
        path="/tools"
      />
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-8">
          <Breadcrumbs items={[{ label: 'Financial Tools' }]} />
          <h1 className="text-4xl font-bold mt-4">50+ Financial Tools for India</h1>
          <p className="mt-3 text-muted-foreground max-w-4xl">Every tool includes practical guidance, live output, internal linking, and SEO-friendly content for real-world planning. Start with bank IFSC code lookup, then calculate loans, taxes, investments, and business metrics in one place.</p>

          {TOOL_CATEGORY_ORDER.map((category) => {
            const tools = TOOL_CATALOG.filter((tool) => tool.category === category);
            if (!tools.length) return null;
            return (
              <section key={category} className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">{category}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tools.map((tool) => (
                    <Link key={tool.slug} to={`/${tool.slug}`} className="rounded-xl border bg-card p-4 hover:border-primary/40 transition-colors">
                      <h3 className="font-semibold">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{tool.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </section>
      </main>
      <Footer />
    </div>
  );
}
