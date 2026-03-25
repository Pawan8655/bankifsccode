import { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SEO } from '@/components/SEO';

declare global {
  interface Window {
    Chart?: any;
  }
}

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenureYears, setTenureYears] = useState(5);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<any>(null);

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const monthlyRate = interestRate / 12 / 100;
    const numberOfMonths = tenureYears * 12;
    const emiValue = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths) /
      (Math.pow(1 + monthlyRate, numberOfMonths) - 1);

    const totalPaymentValue = emiValue * numberOfMonths;
    const totalInterestValue = totalPaymentValue - loanAmount;

    return {
      emi: Number.isFinite(emiValue) ? emiValue : 0,
      totalInterest: Number.isFinite(totalInterestValue) ? totalInterestValue : 0,
      totalPayment: Number.isFinite(totalPaymentValue) ? totalPaymentValue : 0,
    };
  }, [loanAmount, interestRate, tenureYears]);

  useEffect(() => {
    if (!window.Chart || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new window.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Principal Amount', 'Total Interest'],
        datasets: [{
          data: [loanAmount, Math.max(totalInterest, 0)],
          backgroundColor: ['#1d4ed8', '#22c55e'],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [loanAmount, totalInterest]);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.bankifsccode.biz/' },
          { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.bankifsccode.biz/tools' },
          { '@type': 'ListItem', position: 3, name: 'EMI Calculator', item: 'https://www.bankifsccode.biz/emi-calculator' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
      {
        '@type': 'Question',
        name: 'How is EMI calculated for Indian loans?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'EMI is calculated with principal, monthly interest rate, and tenure in months using the standard reducing balance formula used by most Indian lenders.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can EMI reduce if I prepay loan amount?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, prepayment can reduce your outstanding principal. Banks may either reduce EMI or tenure depending on your request and loan policy.',
        },
      },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="EMI Calculator India 2026 - Loan EMI, Interest & Repayment | bankifsccode.biz tools"
        description="Use our EMI Calculator to estimate monthly loan EMIs, total interest, and repayment amount instantly. Optimized for home loan, car loan, and personal loan planning in India."
        path="/emi-calculator"
        schema={faqSchema}
      />
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-8">
          <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'EMI Calculator' }]} />
          <h1 className="text-3xl font-bold mt-4">EMI Calculator for Indian Borrowers</h1>
          <p className="mt-3 text-muted-foreground max-w-4xl">Before you use any financial tool, understand your borrowing behavior. A strong EMI plan improves eligibility, protects cash flow, and keeps your credit profile healthy.</p>

          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            <div className="rounded-xl border p-6 bg-card">
              <div className="space-y-5">
                <label className="block">
                  <span className="font-medium">Loan Amount </span>
                  <span className="font-medium">Loan Amount (₹)</span>
                  <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full mt-2 rounded-md border px-3 py-2" />
                </label>
                <label className="block">
                  <span className="font-medium">Annual Interest Rate (%)</span>
                  <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full mt-2 rounded-md border px-3 py-2" />
                </label>
                <label className="block">
                  <span className="font-medium">Tenure (Years)</span>
                  <input type="number" value={tenureYears} onChange={(e) => setTenureYears(Number(e.target.value))} className="w-full mt-2 rounded-md border px-3 py-2" />
                </label>
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <p><strong>Monthly EMI:</strong> {emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p><strong>Total Interest:</strong> {totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p><strong>Total Payment:</strong> {totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p><strong>Monthly EMI:</strong> ₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p><strong>Total Interest:</strong> ₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p><strong>Total Payment:</strong> ₹{totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
            <div className="rounded-xl border p-6 bg-card h-[360px]">
              <canvas ref={chartRef} aria-label="EMI breakdown chart" />
            </div>
          </div>

          <article className="prose prose-slate max-w-none mt-10">
            <h2>Complete EMI Planning Guide (India)</h2>
            <p>An EMI calculator is not only a monthly payment tool. It is a financial planning framework that helps you evaluate affordability before committing to a home loan, car loan, education loan, or personal loan. In India, many borrowers compare only interest rates and forget that total borrowing cost depends on rate, tenure, and repayment discipline together. A low advertised interest rate can still produce a high total payout if the tenure is long. That is why a reliable EMI calculator is one of the most useful pre-loan tools for salaried professionals, business owners, and first-time borrowers.</p>
            <p>The formula used by this tool is the reducing balance EMI method. This is the same core formula followed by most Indian financial institutions for standard term loans. Each EMI consists of an interest component and a principal component. In early months, the interest share is usually higher because the outstanding principal is larger. Over time, the principal component rises and interest reduces. Understanding this progression helps you plan intelligent prepayments. If you prepay principal earlier in the tenure, the impact on interest savings is significantly higher compared to prepayment near the end of the loan cycle.</p>
            <p>When using an EMI calculator, begin with your post-tax monthly income and fixed obligations. Experts generally suggest keeping total EMIs within a manageable percentage of income so you can preserve emergency savings, insurance premiums, and investment goals. Many borrowers make the mistake of selecting the maximum eligible loan sanctioned by the bank. Eligibility is not equal to affordability. A bank evaluates your ability to repay based on current details, but your personal budget must also account for future uncertainties such as medical expenses, temporary income disruption, education needs, and inflation in living costs.</p>
            <p>Tenure selection is one of the most underrated decisions in loan planning. A longer tenure reduces EMI and improves short-term comfort, but increases total interest outgo over the full repayment period. A shorter tenure raises EMI but significantly reduces cumulative interest burden. The right strategy is to choose a tenure where EMI remains comfortable even after stress testing your budget. For example, simulate a scenario where income drops by ten percent or unavoidable expenses rise. If EMI still remains manageable, your loan structure is more resilient. This stress-first approach is practical for financial stability.</p>
            <p>Interest rate type matters as well. Floating-rate loans are linked to benchmark rates and can change with market conditions. Fixed-rate loans provide predictability but may start at a higher rate. Borrowers should revisit EMI calculation whenever rates reset. Even a small percentage change can materially alter long-term cost for large-ticket loans. A calculator helps you quickly estimate revised EMI, additional annual burden, and potential benefit of partial prepayment. It also improves negotiation outcomes because informed borrowers can compare effective cost rather than just headline offers.</p>
            <p>Processing charges, insurance bundling, legal verification charges, and foreclosure terms should also be reviewed. Many people calculate EMI and ignore these transactional costs. For transparent comparison, add one-time charges into total loan cost estimation. If two lenders offer similar EMI but one has lower additional fees or better prepayment flexibility, it may be the financially smarter choice. Your objective should be total cost optimization with repayment flexibility, not only lowest first-month EMI.</p>
            <p>For home loans, consider linking annual bonus, incentives, or maturity proceeds toward strategic prepayments. A yearly prepayment schedule can reduce tenure by several years. For personal loans and credit conversion products, avoid extending tenure unnecessarily because these products often carry higher rates. For auto loans, compare whether a higher down payment can bring EMI to a healthier level and reduce insurance-linked financing burden. In each case, EMI simulation allows better decision quality before signing loan documentation.</p>
            <p>Finally, treat EMI calculation as part of a complete financial system. Keep an emergency fund, ensure adequate health and term insurance, and automate repayment from a stable account to avoid penalty interest and late fees. Borrow only for goals with genuine value and avoid debt stacking across multiple products. Use this EMI calculator repeatedly while planning, negotiating, and reviewing your loan journey. Consistent review helps you stay in control of debt and align repayment with long-term financial freedom goals. If you are comparing banks, combine EMI insights with bank IFSC code accuracy and branch support information available on bankifsccode.biz tools for practical execution readiness.</p>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}
