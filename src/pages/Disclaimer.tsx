import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SEO } from '@/components/SEO';

export default function Disclaimer() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Disclaimer | bankifsccode.biz"
        description="Read the legal disclaimer for bankifsccode.biz tools, IFSC data usage, and calculator result limitations."
        path="/disclaimer"
      />
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-8 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Disclaimer' }]} />
          <h1 className="text-3xl font-bold mt-4">Disclaimer</h1>
          <p className="mt-4 text-muted-foreground">Information published on bankifsccode.biz is provided for educational and informational purposes only. We attempt to keep IFSC data, branch details, and calculator logic accurate and updated; however, we do not guarantee completeness, reliability, or suitability for any specific transaction.</p>
          <p className="mt-4 text-muted-foreground">Users must verify critical banking details directly with the official bank website, branch, or RBI-authorized sources before processing payments, NEFT, RTGS, IMPS, or any high-value financial activity. Calculator outputs are estimates based on user inputs and standard formulas, not financial advice.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
