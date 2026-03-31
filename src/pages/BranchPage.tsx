import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useIFSCData } from '@/hooks/useIFSCData';
import { getBranchByIFSC, getBranchesForBankStateCity } from '@/lib/csvParser';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';

import { useMemo } from 'react';

function truncate(value: string, max: number) {
  return value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`;
}

function buildMetaDescription(bank: string, branch: string, city: string, state: string, ifsc: string) {
  const base = `Find ${bank} ${branch}, ${city}, ${state} IFSC ${ifsc}, MICR, address, and branch info for NEFT, RTGS, IMPS transfers and safe online banking use.`;
  if (base.length >= 150 && base.length <= 160) return base;

  const trimmed = truncate(base, 160);
  if (trimmed.length >= 150) return trimmed;

  return `${trimmed} Fast lookup.`.slice(0, 160);
}

export default function BranchPage() {
  const { ifsc, bankName, stateName, cityName, branchName } = useParams();
  const { data, indices, loading, error } = useIFSCData();

  const branch = useMemo(() => {
    if (ifsc) return getBranchByIFSC(data, ifsc);

    if (!bankName || !stateName || !cityName || !branchName) return undefined;
    const bank = decodeURIComponent(bankName);
    const state = decodeURIComponent(stateName);
    const city = decodeURIComponent(cityName);
    const branchParam = decodeURIComponent(branchName);

    return data.find((item) =>
      item.Bank === bank && item.State === state && item.City === city && item.Branch === branchParam,
    );
  }, [data, ifsc, bankName, stateName, cityName, branchName]);

  const relatedBranches = useMemo(() => {
    if (!branch) return [];
    if (indices && indices.branchesMap.has(branch.Bank)) {
      const cityBranches = indices.branchesMap.get(branch.Bank)?.get(branch.State)?.get(branch.City);
      if (cityBranches) {
        return cityBranches
          .filter(b => b.IFSC !== branch.IFSC)
          .slice(0, 4);
      }
    }
    return getBranchesForBankStateCity(data, branch.Bank, branch.State, branch.City)
      .filter(b => b.IFSC !== branch.IFSC)
      .slice(0, 4);
  }, [branch, data, indices]);


  const breadcrumbItems = branch ? [
    { label: 'Banks', href: '/banks' },
    { label: branch.Bank, href: `/bank/${encodeURIComponent(branch.Bank)}` },
    { label: branch.State, href: `/bank/${encodeURIComponent(branch.Bank)}/${encodeURIComponent(branch.State)}` },
    { label: branch.City, href: `/bank/${encodeURIComponent(branch.Bank)}/${encodeURIComponent(branch.State)}/${encodeURIComponent(branch.City)}` },
    { label: branch.Branch },
  ] : [];

  const seoTitle = branch
    ? truncate(`${branch.Bank} ${branch.Branch} IFSC ${branch.IFSC} ${branch.City}`, 60)
    : `IFSC Code ${ifsc || ''} Branch Details | bankifsccode.biz`;

  const seoDescription = branch
    ? buildMetaDescription(branch.Bank, branch.Branch, branch.City, branch.State, branch.IFSC)
    : `Find branch details using IFSC code ${ifsc || ''}. Get bank, state, city and branch information in one place.`;

  const seoKeywords = branch
    ? `${branch.IFSC}, ${branch.Bank} IFSC code, ${branch.City} IFSC code, ${branch.State} bank IFSC code`
    : `${ifsc || ''} IFSC code, IFSC code branch details, bank IFSC code search`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        path={branch ? `/bank/${encodeURIComponent(branch.Bank)}/${encodeURIComponent(branch.State)}/${encodeURIComponent(branch.City)}/${encodeURIComponent(branch.Branch)}` : `/branch/${encodeURIComponent(ifsc || '')}`}
        keywords={seoKeywords}
      />
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-12">{error}</div>
          ) : !branch ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Branch Not Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find a branch with IFSC code "{ifsc}"
              </p>
              <Button asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go to Home
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <Breadcrumbs items={breadcrumbItems} />

              <article className="rounded-xl border border-border bg-card p-5 md:p-8 space-y-5">
                <header>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                    {branch.Bank} {branch.Branch} IFSC Code {branch.IFSC} {branch.City}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-2">
                    Updated branch profile for quick and safe bank transfer reference.
                  </p>
                </header>

                <div className="overflow-x-auto rounded-lg border border-border/70">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ['Bank', branch.Bank],
                        ['Branch', branch.Branch],
                        ['IFSC', branch.IFSC],
                        ['MICR', branch.MICR || 'NA'],
                        ['Address', branch.Address],
                        ['City', branch.City],
                        ['State', branch.State],
                      ].map(([label, value]) => (
                        <tr key={label} className="odd:bg-muted/30 border-b border-border/50 last:border-none">
                          <th className="text-left font-semibold p-3 w-36">{label}</th>
                          <td className="p-3">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <section className="space-y-4 text-sm md:text-base leading-7 text-foreground/90">
                  <p>
                    Looking for trusted branch details? You are on the right page. This listing gives complete and easy-to-read details for <strong>{branch.Bank}</strong> <strong>{branch.Branch}</strong> in <strong>{branch.City}</strong>, <strong>{branch.State}</strong>. On bankifsccode, our goal is simple: help users quickly verify bank details before making any money transfer. Whether you are sending salary, paying rent, transferring family support, or adding a new beneficiary, these branch details help reduce typing mistakes and transfer delays. Simple language mein bolein toh, yeh page aapka quick verification partner hai.
                  </p>
                  <p>
                    About the bank: <strong>{branch.Bank}</strong> serves customers through its branch and digital banking network across India. The <strong>{branch.Branch}</strong> branch supports common banking needs like account operations, cash services, passbook updates, and transfer-related assistance. If you are visiting in person, always cross-check branch timing and holidays before travel. For online users, this page works like a handy checklist—bank name, branch name, IFSC, MICR, city, and full address in one place—so you can confirm every detail in a few seconds.
                  </p>
                  <p>
                    Branch location details matter because similar branch names can exist in different districts or cities. This branch is listed in <strong>{branch.District}</strong> district and <strong>{branch.City}</strong> city, with address: <strong>{branch.Address}</strong>. When you add a beneficiary in net banking or mobile banking app, matching city/state plus IFSC is a smart safety step. If your transfer amount is large, do one small test transfer first, then continue with the full amount after confirmation. This small habit can save time and stress.
                  </p>
                  <p>
                    IFSC code explanation: The IFSC for this branch is <strong>{branch.IFSC}</strong>. IFSC stands for Indian Financial System Code, an 11-character code used to identify a specific branch in electronic payment systems. Banks and payment apps use IFSC to route funds to the correct destination. You need IFSC while adding beneficiaries and while sending money through <strong>NEFT</strong>, <strong>RTGS</strong>, and <strong>IMPS</strong>. NEFT is useful for regular transfers, RTGS is often preferred for high-value real-time settlement, and IMPS is great for instant transfers 24x7.
                  </p>
                  <p>
                    MICR code explanation: MICR (Magnetic Ink Character Recognition) code helps identify bank branches mainly for cheque processing and clearing. The MICR listed here is <strong>{branch.MICR || 'NA'}</strong>. Even if many users today rely on UPI and online transfers, MICR is still relevant in cheque-related banking workflows. In short, IFSC is key for online fund transfer routing, while MICR is important for cheque system identification. Dono codes alag kaam karte hain, and both are useful for accurate banking records.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">FAQs</h2>
                  <div className="space-y-3 text-sm md:text-base">
                    <div>
                      <h3 className="font-semibold">1) What is the IFSC code of {branch.Bank} {branch.Branch}?</h3>
                      <p>The IFSC code is <strong>{branch.IFSC}</strong>.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">2) Can I use this IFSC code for NEFT, RTGS, and IMPS?</h3>
                      <p>Yes, IFSC is required for NEFT/RTGS/IMPS beneficiary setup and transfer routing.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">3) Why do I need MICR code for this branch?</h3>
                      <p>MICR is mainly used in cheque clearing and branch identification in cheque-based workflows.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">4) How can I verify branch location before transfer?</h3>
                      <p>Match bank name, branch, city, district, address, and IFSC together before you proceed.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">5) Is this page useful for first-time beneficiary addition?</h3>
                      <p>Absolutely. It gives a one-page snapshot to copy correct values while adding a new payee.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">Internal Links You May Find Useful</h2>
                  <ul className="list-disc ml-5 space-y-1 text-sm md:text-base">
                    <li>
                      <Link className="text-primary hover:underline" to={`/bank/${encodeURIComponent(branch.Bank)}`}>
                        Explore all {branch.Bank} branches
                      </Link>
                    </li>
                    <li>
                      <Link className="text-primary hover:underline" to={`/bank/${encodeURIComponent(branch.Bank)}/${encodeURIComponent(branch.State)}`}>
                        View {branch.Bank} branches in {branch.State}
                      </Link>
                    </li>
                    <li>
                      <Link className="text-primary hover:underline" to={`/bank/${encodeURIComponent(branch.Bank)}/${encodeURIComponent(branch.State)}/${encodeURIComponent(branch.City)}`}>
                        Check branches in {branch.City}
                      </Link>
                    </li>
                    <li>
                      <Link className="text-primary hover:underline" to="/emi-calculator">
                        Try EMI Calculator
                      </Link>
                    </li>
                    <li>
                      <Link className="text-primary hover:underline" to="/sip-calculator">
                        Try SIP Calculator
                      </Link>
                    </li>
                  </ul>
                </section>
              </article>

              {/* Related Branches */}
              {relatedBranches.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Other Branches in {branch.City}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {relatedBranches.map((b) => (
                      <Link
                        key={b.IFSC}
                        to={`/bank/${encodeURIComponent(b.Bank)}/${encodeURIComponent(b.State)}/${encodeURIComponent(b.City)}/${encodeURIComponent(b.Branch)}`}
                        className="p-4 rounded-lg border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg transition-all"
                      >
                        <h3 className="font-medium text-foreground mb-1 line-clamp-1">{b.Branch}</h3>
                        <p className="text-sm text-muted-foreground font-mono">{b.IFSC}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
