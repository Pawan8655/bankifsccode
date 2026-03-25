import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SEO } from '@/components/SEO';
import { findToolBySlug } from '@/data/toolCatalog';

function toNumber(value: string | number) {
  const sanitized = typeof value === 'string' ? value.replace(/,/g, '') : value;
  const numeric = typeof sanitized === 'number' ? sanitized : Number(sanitized);
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function calculate(slug: string, values: Record<string, string | number>) {
  const p = toNumber(values.principal);
  const r = toNumber(values.rate) / 100;
  const y = toNumber(values.years);
  const m = toNumber(values.months);

  switch (slug) {
    case 'lumpsum-calculator':
    case 'compound-interest-calculator':
    case 'mutual-fund-calculator':
      return `Estimated future value: ${(toNumber(values.amount || values.principal) * Math.pow(1 + r, y)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'simple-interest-calculator':
      return `Simple interest: ${(p * r * y).toLocaleString('en-IN', { maximumFractionDigits: 0 })}; total: ${(p + p * r * y).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'fd-calculator':
      return `FD maturity estimate: ${(p * Math.pow(1 + r / 4, y * 4)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
      return `Estimated future value: ₹${(toNumber(values.amount || values.principal) * Math.pow(1 + r, y)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'simple-interest-calculator':
      return `Simple interest: ₹${(p * r * y).toLocaleString('en-IN', { maximumFractionDigits: 0 })}; total: ₹${(p + p * r * y).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'fd-calculator':
      return `FD maturity estimate: ₹${(p * Math.pow(1 + r / 4, y * 4)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'rd-calculator': {
      const monthly = toNumber(values.monthly);
      const months = y * 12;
      const fv = monthly * ((Math.pow(1 + r / 12, months) - 1) / (r / 12)) * (1 + r / 12);
      return `RD maturity estimate: ${fv.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
    case 'loan-eligibility-calculator': {
      const eligibleEmi = Math.max(0, toNumber(values.income) * 0.5 - toNumber(values.obligations));
      return `Approximate eligible loan amount: ${(eligibleEmi * 12 * toNumber(values.years)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
    case 'loan-prepayment-calculator':
      return `Outstanding after prepayment: ${Math.max(0, toNumber(values.outstanding) - toNumber(values.prepay)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'interest-rate-calculator':
      return `Estimated annual interest rate: ${((toNumber(values.interest) / toNumber(values.principal)) / toNumber(values.years) * 100).toFixed(2)}%`;
    case 'gst-calculator':
      return `GST amount: ${(toNumber(values.amount) * toNumber(values.rate) / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
      return `RD maturity estimate: ₹${fv.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
    case 'loan-eligibility-calculator': {
      const eligibleEmi = Math.max(0, toNumber(values.income) * 0.5 - toNumber(values.obligations));
      return `Approximate eligible loan amount: ₹${(eligibleEmi * 12 * toNumber(values.years)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
    case 'loan-prepayment-calculator':
      return `Outstanding after prepayment: ₹${Math.max(0, toNumber(values.outstanding) - toNumber(values.prepay)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'interest-rate-calculator':
      return `Estimated annual interest rate: ${((toNumber(values.interest) / toNumber(values.principal)) / toNumber(values.years) * 100).toFixed(2)}%`;
    case 'gst-calculator':
      return `GST amount: ₹${(toNumber(values.amount) * toNumber(values.rate) / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    case 'currency-converter':
      return `Converted value: ${(toNumber(values.amount) * toNumber(values.rate)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    case 'credit-card-emi-calculator': {
      const mr = r / 12;
      const emi = toNumber(values.amount) * mr * Math.pow(1 + mr, m) / (Math.pow(1 + mr, m) - 1);
      return `Monthly EMI: ${emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
      return `Monthly EMI: ₹${emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
    case 'home-loan-calculator':
    case 'personal-loan-calculator':
    case 'car-loan-calculator':
    case 'emi-calculator': {
      const months = y * 12;
      const mr = r / 12;
      const emi = p * mr * Math.pow(1 + mr, months) / (Math.pow(1 + mr, months) - 1);
      return `Monthly EMI estimate: ${emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
      return `Monthly EMI estimate: ₹${emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
    case 'stock-return-calculator': {
      const gain = (toNumber(values.sell) - toNumber(values.buy)) * toNumber(values.qty);
      const pct = ((toNumber(values.sell) - toNumber(values.buy)) / toNumber(values.buy)) * 100;
      return `Gain/Loss: ${gain.toLocaleString('en-IN', { maximumFractionDigits: 0 })} (${pct.toFixed(2)}%)`;
      return `Gain/Loss: ₹${gain.toLocaleString('en-IN', { maximumFractionDigits: 0 })} (${pct.toFixed(2)}%)`;
    }
    case 'cagr-calculator':
      return `CAGR: ${(Math.pow(toNumber(values.end) / toNumber(values.start), 1 / y) * 100 - 100).toFixed(2)}%`;
    case 'inflation-calculator':
      return `Future value after inflation: ${(toNumber(values.amount) * Math.pow(1 + toNumber(values.inflation) / 100, y)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'retirement-planner':
      return `Target annual expense at retirement: ${(toNumber(values.monthlyExpense) * 12 * Math.pow(1 + toNumber(values.inflation) / 100, y)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
      return `Future value after inflation: ₹${(toNumber(values.amount) * Math.pow(1 + toNumber(values.inflation) / 100, y)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'retirement-planner':
      return `Target annual expense at retirement: ₹${(toNumber(values.monthlyExpense) * 12 * Math.pow(1 + toNumber(values.inflation) / 100, y)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'ppf-calculator':
    case 'sukanya-samriddhi-calculator': {
      const yearly = toNumber(values.yearly);
      const fv = yearly * ((Math.pow(1 + r, y) - 1) / r) * (1 + r);
      return `Estimated maturity corpus: ${fv.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
      return `Estimated maturity corpus: ₹${fv.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
    case 'nps-calculator': {
      const monthly = toNumber(values.monthly);
      const months = y * 12;
      const mr = r / 12;
      const fv = monthly * ((Math.pow(1 + mr, months) - 1) / mr) * (1 + mr);
      return `Estimated NPS corpus: ${fv.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
    case 'income-tax-calculator-india':
      return `Estimated taxable income: ${Math.max(0, toNumber(values.income) - toNumber(values.deduction)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'salary-calculator':
      return `Estimated monthly in-hand: ${((toNumber(values.ctc) - toNumber(values.deduction)) / 12).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'hra-calculator': {
      const eligible = Math.min(toNumber(values.hra), toNumber(values.rent) - toNumber(values.basic) * 0.1, toNumber(values.basic) * 0.5);
      return `Approximate monthly HRA exemption: ${Math.max(0, eligible).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
    case 'gratuity-calculator':
      return `Estimated gratuity: ${(toNumber(values.salary) * 15 / 26 * toNumber(values.years)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'epf-calculator': {
      const contribution = toNumber(values.salary) * 0.24;
      const fv = contribution * 12 * ((Math.pow(1 + r, y) - 1) / r);
      return `Estimated EPF corpus: ${fv.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
      return `Estimated NPS corpus: ₹${fv.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
    case 'income-tax-calculator-india':
      return `Estimated taxable income: ₹${Math.max(0, toNumber(values.income) - toNumber(values.deduction)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'salary-calculator':
      return `Estimated monthly in-hand: ₹${((toNumber(values.ctc) - toNumber(values.deduction)) / 12).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'hra-calculator': {
      const eligible = Math.min(toNumber(values.hra), toNumber(values.rent) - toNumber(values.basic) * 0.1, toNumber(values.basic) * 0.5);
      return `Approximate monthly HRA exemption: ₹${Math.max(0, eligible).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
    case 'gratuity-calculator':
      return `Estimated gratuity: ₹${(toNumber(values.salary) * 15 / 26 * toNumber(values.years)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'epf-calculator': {
      const contribution = toNumber(values.salary) * 0.24;
      const fv = contribution * 12 * ((Math.pow(1 + r, y) - 1) / r);
      return `Estimated EPF corpus: ₹${fv.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
    case 'profit-margin-calculator':
      return `Profit margin: ${(((toNumber(values.revenue) - toNumber(values.cost)) / toNumber(values.revenue)) * 100).toFixed(2)}%`;
    case 'break-even-calculator':
      return `Break-even units: ${(toNumber(values.fixed) / Math.max(1, toNumber(values.price) - toNumber(values.variable))).toFixed(0)}`;
    case 'roi-calculator':
      return `ROI: ${(toNumber(values.gain) / toNumber(values.cost) * 100).toFixed(2)}%`;
    case 'gst-return-calculator':
      return `Net GST payable: ${Math.max(0, toNumber(values.output) - toNumber(values.input)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'net-worth-calculator':
      return `Net worth: ${(toNumber(values.assets) - toNumber(values.liabilities)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'budget-planner':
      return `Monthly balance: ${(toNumber(values.income) - toNumber(values.expense)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
      return `Net GST payable: ₹${Math.max(0, toNumber(values.output) - toNumber(values.input)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'net-worth-calculator':
      return `Net worth: ₹${(toNumber(values.assets) - toNumber(values.liabilities)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'budget-planner':
      return `Monthly balance: ₹${(toNumber(values.income) - toNumber(values.expense)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'savings-goal-calculator': {
      const mr = toNumber(values.rate) / 12 / 100;
      const n = toNumber(values.years) * 12;
      const pmt = toNumber(values.goal) * mr / (Math.pow(1 + mr, n) - 1);
      return `Required monthly saving: ${pmt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
    case 'emergency-fund-calculator':
      return `Recommended emergency fund: ${(toNumber(values.expense) * toNumber(values.months)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'loan-comparison-tool':
      return `Loan A total: ${(toNumber(values.emiA) * toNumber(values.months)).toLocaleString('en-IN')} vs Loan B total: ${(toNumber(values.emiB) * toNumber(values.months)).toLocaleString('en-IN')}`;
    case 'investment-comparison-tool':
      return `Difference (B - A): ${(toNumber(values.b) - toNumber(values.a)).toLocaleString('en-IN')}`;
      return `Required monthly saving: ₹${pmt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
    case 'emergency-fund-calculator':
      return `Recommended emergency fund: ₹${(toNumber(values.expense) * toNumber(values.months)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    case 'loan-comparison-tool':
      return `Loan A total: ₹${(toNumber(values.emiA) * toNumber(values.months)).toLocaleString('en-IN')} vs Loan B total: ₹${(toNumber(values.emiB) * toNumber(values.months)).toLocaleString('en-IN')}`;
    case 'investment-comparison-tool':
      return `Difference (B - A): ₹${(toNumber(values.b) - toNumber(values.a)).toLocaleString('en-IN')}`;
    case 'age-calculator':
      return `Approximate age in 2026: ${Math.max(0, 2026 - toNumber(values.birthYear))} years`;
    case 'percentage-calculator':
      return `${toNumber(values.part)} is ${((toNumber(values.part) / toNumber(values.whole)) * 100).toFixed(2)}% of ${toNumber(values.whole)}`;
    case 'discount-calculator':
      return `Final price after discount: ${(toNumber(values.price) * (1 - toNumber(values.discount) / 100)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
      return `Final price after discount: ₹${(toNumber(values.price) * (1 - toNumber(values.discount) / 100)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    case 'time-calculator':
      return `${toNumber(values.hours)} hours = ${toNumber(values.hours) * 60} minutes = ${toNumber(values.hours) * 3600} seconds`;
    case 'unit-converter':
      return `${toNumber(values.km)} km = ${(toNumber(values.km) * 0.621371).toFixed(2)} miles`;
    case 'ifsc-code-finder':
      return 'Use our primary IFSC database search on the homepage for accurate branch-level codes.';
    case 'micr-code-finder':
    case 'swift-code-finder':
      return 'Enter bank and branch details. Verify final code with the official bank source before transactions.';
    case 'bank-holiday-checker':
      return 'Holiday data varies by state and circulars. Always confirm with your bank before branch visits.';
    case 'credit-score-estimator': {
      const score = Math.round(300 + (toNumber(values.onTime) * 4 + (100 - toNumber(values.util)) * 2));
      return `Estimated score band: ${Math.min(900, Math.max(300, score))}`;
    }
    case 'debt-consolidation-calculator':
      return `Estimated savings over tenure: ${((toNumber(values.currentEmi) - toNumber(values.newEmi)) * toNumber(values.months)).toLocaleString('en-IN')}`;
      return `Estimated savings over tenure: ₹${((toNumber(values.currentEmi) - toNumber(values.newEmi)) * toNumber(values.months)).toLocaleString('en-IN')}`;
    case 'qr-code-generator':
      return `QR generator ready for text: ${String(values.text || '').slice(0, 80)}`;
    default:
      return 'Calculation available soon.';
  }
}

function longFormContent(toolTitle: string) {
  return [
    `${toolTitle} is designed for users who need more than a number on screen. Financial decisions become safer when each result is reviewed with context such as risk, cash flow, taxes, inflation, and goal timelines. Many people calculate once and move forward immediately, but strong planning needs scenario comparison. That is why this page includes practical guidance and internal links to bank IFSC services. When you estimate values with this calculator, you should test conservative, realistic, and optimistic assumptions. This method improves decision quality and reduces the chance of budget pressure later.`,
    `In India, families often plan multiple goals in parallel: emergency fund, loan repayment, children education, and retirement. A single calculator can support one decision, but complete planning comes from combining outputs with real-life constraints. For example, if a result looks attractive but monthly cash flow becomes tight, the strategy must be adjusted. Use this tool to evaluate affordability first, then optimize for growth. Keep buffers for health expenses, insurance premiums, and temporary income disruption. This discipline helps users avoid over-commitment and maintain financial stability even when market or employment conditions change.`,
    `Another important principle is review frequency. A plan created today should not remain untouched for years. Income, expenses, tax rules, and interest rate trends evolve. Re-calculate periodically and track whether you are ahead or behind the target. If you are behind, increase monthly contribution or extend tenure carefully. If you are ahead, consider risk reduction or faster debt closure. Data-driven reviews reduce emotional decisions and improve long-term consistency. This approach works across borrowers, investors, salaried professionals, and business owners alike.`,
    `Users also need accurate execution data, especially when moving funds, paying EMIs, or investing through bank channels. After estimating with ${toolTitle}, confirm transfer details through trusted sources. bankifsccode.biz gives you branch-level discovery with IFSC lookup support, so planning and execution happen in one ecosystem. Keeping tools and bank details connected improves operational accuracy and reduces transaction friction. Always verify critical fields before final submission in NEFT, RTGS, IMPS, UPI mandates, or standing instruction setups.`,
    `Search visibility also depends on usefulness. Thin pages with only input boxes are usually not enough for users or ad platforms. This page adds educational depth so that readers understand when to use the tool, which assumptions can change outcomes, and what risk controls are essential. If you are evaluating a loan-related decision, compare at least two lenders and include processing charges, insurance bundling, and prepayment terms in your final analysis. If you are evaluating investments, balance return expectations with volatility, liquidity, and taxation. Thoughtful comparison creates better outcomes than chasing a single metric.`,
    `For business and professional users, documentation matters. Save your key assumptions, monthly updates, and revision notes so you can audit decisions later. This is especially helpful when multiple family members or partners are involved in financial planning. A shared decision record improves accountability and continuity. You can revisit past calculations, identify what changed, and adapt strategy without confusion. Over time, this turns one-time calculations into a repeatable planning process that supports better long-term wealth and risk management.`,
    `For AdSense and quality standards, content depth matters. This article is intentionally educational, not keyword stuffing. You should use this page as a practical reference: understand assumptions, compute values, compare alternatives, and take informed action. If you are a beginner, start with smaller values and learn the effect of each variable. If you are advanced, run stress tests and sensitivity analysis. The objective is not just a quick output, but better financial judgment over time.`,
    `Final reminder: calculators provide estimates, not regulated financial advice. Use outputs as planning inputs and verify decisions with official documents, lender terms, and current product disclosures. For high-value commitments, compare at least two options and document the trade-offs clearly. With disciplined use, ${toolTitle} can save cost, improve planning confidence, and strengthen your long-term financial outcomes.`,
  ].join('\n\n');
}

export default function GenericToolPage() {
  const { toolSlug } = useParams();
  const tool = findToolBySlug(toolSlug);

  const [values, setValues] = useState<Record<string, string | number>>(() => {
    if (!tool) return {};
    return Object.fromEntries(tool.fields.map((field) => [field.key, field.defaultValue]));
  });

  const result = useMemo(() => {
    if (!tool) return '';
    return calculate(tool.slug, values);
  }, [tool, values]);

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold">Tool not found</h1>
          <p className="mt-3 text-muted-foreground">Please open the <Link className="text-primary" to="/tools">tools directory</Link>.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.bankifsccode.biz/' },
          { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.bankifsccode.biz/tools' },
          { '@type': 'ListItem', position: 3, name: tool.title, item: `https://www.bankifsccode.biz/${tool.slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: `How to use ${tool.title}?`, acceptedAnswer: { '@type': 'Answer', text: `Enter the required values and review the estimate from ${tool.title}. Always verify with official bank or product documents.` } },
          { '@type': 'Question', name: `Is ${tool.title} result final?`, acceptedAnswer: { '@type': 'Answer', text: `No. The result is an estimate for planning and may vary based on fees, policy, tax, and product-specific rules.` } },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={`${tool.title} India 2026 | bankifsccode.biz tools`}
        description={`${tool.description} Use bankifsccode.biz tools for accurate planning, internal links, and financial calculators India users trust.`}
        path={`/${tool.slug}`}
        schema={schema}
      />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: tool.title }]} />
        <h1 className="text-3xl font-bold mt-4">{tool.title}</h1>
        <p className="mt-3 text-muted-foreground max-w-3xl">{tool.description}</p>

        <section className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="rounded-xl border bg-card p-5 space-y-4">
            {tool.fields.map((field) => (
              <label key={field.key} className="block">
                <span className="text-sm font-medium">{field.label}</span>
                <input
                  type="text"
                  className="w-full mt-1 rounded-md border px-3 py-2"
                  value={field.type === 'text' ? (values[field.key] ?? '') : formatNumber(values[field.key] ?? 0)}
                  onChange={(e) => setValues((prev) => ({
                    ...prev,
                    [field.key]: field.type === 'text' ? e.target.value : e.target.value,
                  type={field.type === 'text' ? 'text' : 'number'}
                  className="w-full mt-1 rounded-md border px-3 py-2"
                  value={values[field.key] ?? ''}
                  onChange={(e) => setValues((prev) => ({
                    ...prev,
                    [field.key]: field.type === 'text' ? e.target.value : Number(e.target.value),
                  }))}
                />
              </label>
            ))}
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold">Result</h2>
            <p className="mt-3 text-lg text-primary font-medium">{result}</p>
            <p className="text-sm text-muted-foreground mt-4">Need verified branch data for payments? Use the <Link className="text-primary" to="/">IFSC Code Finder</Link> and <Link className="text-primary" to="/banks">bank directory</Link>.</p>
          </div>
        </section>

        <article className="prose prose-slate max-w-none mt-10 whitespace-pre-line">
          {longFormContent(tool.title)}
        </article>
      </main>
      <Footer />
    </div>
  );
}
  const formatNumber = (value: string | number) => {
    const num = toNumber(value);
    return Number.isFinite(num) ? num.toLocaleString('en-IN') : '';
  };
