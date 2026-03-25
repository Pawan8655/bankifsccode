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

export default function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(15);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<any>(null);

  const { invested, estimatedReturns, maturityValue, trend } = useMemo(() => {
    const monthlyRate = annualReturn / 12 / 100;
    const months = years * 12;
    const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const investedAmount = monthlyInvestment * months;
    const returns = futureValue - investedAmount;

    const trendPoints = [];
    for (let y = 1; y <= years; y += 1) {
      const m = y * 12;
      const value = monthlyInvestment * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
      trendPoints.push(Number.isFinite(value) ? Math.round(value) : 0);
    }

    return {
      invested: Number.isFinite(investedAmount) ? investedAmount : 0,
      estimatedReturns: Number.isFinite(returns) ? returns : 0,
      maturityValue: Number.isFinite(futureValue) ? futureValue : 0,
      trend: trendPoints,
    };
  }, [monthlyInvestment, annualReturn, years]);

  useEffect(() => {
    if (!window.Chart || !chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: years }, (_, i) => `Year ${i + 1}`),
        datasets: [{
          label: 'Projected SIP Value',
          data: trend,
          borderColor: '#1d4ed8',
          backgroundColor: 'rgba(34, 197, 94, 0.18)',
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            ticks: {
              callback: (value: number) => `${Number(value).toLocaleString('en-IN')}`,
              callback: (value: number) => `₹${Number(value).toLocaleString('en-IN')}`,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [trend, years]);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.bankifsccode.biz/' },
          { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.bankifsccode.biz/tools' },
          { '@type': 'ListItem', position: 3, name: 'SIP Calculator', item: 'https://www.bankifsccode.biz/sip-calculator' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a SIP calculator?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A SIP calculator estimates maturity value from monthly mutual fund investments based on expected annual return and duration.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is SIP return guaranteed?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. SIP returns are market linked and can vary. The calculator gives projections based on assumptions, not guaranteed outcomes.',
        },
      },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="SIP Calculator India 2026 - Mutual Fund SIP Return Tool | bankifsccode.biz tools"
        description="Calculate SIP maturity value, invested amount, and estimated returns instantly. Use this financial calculator India investors can rely on for long-term planning."
        path="/sip-calculator"
        schema={faqSchema}
      />
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-8">
          <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'SIP Calculator' }]} />
          <h1 className="text-3xl font-bold mt-4">SIP Calculator for Mutual Fund Planning</h1>
          <p className="mt-3 text-muted-foreground max-w-4xl">This tool helps Indian investors estimate long-term wealth creation using monthly SIP contributions with compound growth assumptions.</p>

          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            <div className="rounded-xl border p-6 bg-card">
              <div className="space-y-5">
                <label className="block">
                  <span className="font-medium">Monthly Investment </span>
                  <span className="font-medium">Monthly Investment (₹)</span>
                  <input type="number" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(Number(e.target.value))} className="w-full mt-2 rounded-md border px-3 py-2" />
                </label>
                <label className="block">
                  <span className="font-medium">Expected Annual Return (%)</span>
                  <input type="number" step="0.1" value={annualReturn} onChange={(e) => setAnnualReturn(Number(e.target.value))} className="w-full mt-2 rounded-md border px-3 py-2" />
                </label>
                <label className="block">
                  <span className="font-medium">Investment Duration (Years)</span>
                  <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full mt-2 rounded-md border px-3 py-2" />
                </label>
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <p><strong>Total Invested:</strong> {invested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p><strong>Estimated Returns:</strong> {estimatedReturns.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p><strong>Maturity Value:</strong> {maturityValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p><strong>Total Invested:</strong> ₹{invested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p><strong>Estimated Returns:</strong> ₹{estimatedReturns.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p><strong>Maturity Value:</strong> ₹{maturityValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
            <div className="rounded-xl border p-6 bg-card h-[360px]">
              <canvas ref={chartRef} aria-label="SIP growth projection chart" />
            </div>
          </div>

          <article className="prose prose-slate max-w-none mt-10">
            <h2>Complete SIP Strategy Guide for India</h2>
            <p>A SIP calculator is one of the most practical tools for long-term financial planning in India. It converts abstract investment goals into monthly action steps. Instead of relying on guesswork, investors can estimate how much to invest each month, how long to stay invested, and what wealth range may be achieved under different return assumptions. Whether your goal is retirement corpus creation, child education planning, down payment savings, or wealth compounding for financial independence, a SIP calculator improves decision quality before money is deployed.</p>
            <p>Systematic Investment Plan, commonly known as SIP, is a disciplined way to invest in mutual funds. You invest a fixed amount at regular intervals, usually monthly. Over time this approach benefits from rupee cost averaging and compounding. In volatile markets, you buy more units when prices are low and fewer units when prices are high, which can smooth purchase cost over long cycles. A SIP calculator models this discipline by projecting potential maturity value based on monthly contribution, expected return, and duration. Though returns are not guaranteed, the projection is useful for planning and benchmarking progress.</p>
            <p>Many first-time investors focus on return percentage and ignore consistency. In reality, consistency has a major impact on outcomes. Missing SIP installments or pausing investing during market volatility can reduce long-term corpus significantly. A calculator helps reinforce commitment by showing what even a modest monthly amount can become over 10, 15, or 20 years. For example, extending duration often contributes more to final wealth than trying to chase a slightly higher return with frequent fund switching. Time in the market and disciplined contributions usually outperform emotional timing attempts.</p>
            <p>To use SIP calculations effectively, start with a goal-based method. Define a financial target and assign timeline. Next estimate inflation-adjusted future value of that goal. Then use the calculator to arrive at required monthly SIP. This approach is stronger than selecting a random SIP amount. If the required monthly amount feels high, increase timeline, add step-up SIP, or blend goals into priority buckets. A structured framework prevents underfunding and reduces stress closer to the goal date. You can also create separate SIPs for short, medium, and long-term objectives to keep tracking cleaner.</p>
            <p>Expected return input should be realistic. Equity mutual funds may generate strong long-term returns over complete cycles, but short-term results can be volatile. Debt-oriented products provide relatively stable behavior but lower expected growth. Hybrid allocation can balance risk and return depending on your profile. Avoid over-optimistic assumptions while planning. Conservative projections make plans more robust and reduce disappointment. You can run scenarios such as base case, optimistic case, and conservative case. This range-based planning helps you prepare for uncertainty and stay invested through market fluctuations.</p>
            <p>Step-up SIP is another powerful strategy. As your income rises, increasing SIP amount annually can accelerate corpus creation dramatically. Even a ten percent annual step-up can close large goal gaps without requiring sudden high contributions later. If your salary revision cycle is predictable, align SIP top-up with that month. This creates an automatic wealth escalation framework. A SIP calculator can be used repeatedly each year to reassess projections and adjust contribution levels. Annual review is essential because goals, income, inflation, and risk appetite evolve over time.</p>
            <p>Tax treatment also matters in investment decisions. Equity mutual funds and debt funds have different taxation rules and holding period implications. Investors should consider post-tax return rather than pre-tax projection alone. For long-duration goals, tax-efficient asset selection can improve net wealth substantially. Also maintain emergency funds separately to avoid redeeming SIP investments prematurely for short-term needs. Premature redemptions can interrupt compounding and weaken long-term outcomes. A stable emergency reserve and insurance coverage protect your investment plan from avoidable disruptions.</p>
            <p>Finally, combine SIP planning with practical execution hygiene. Use direct debit from bank account, monitor mandate status, keep nominee details updated, and review fund overlap annually. If you are selecting funds from different categories, maintain allocation discipline instead of reacting to short-term rankings. SIP wealth creation is a marathon, not a sprint. This calculator on bankifsccode.biz tools helps you estimate and visualize your trajectory so you can make informed, data-driven decisions. Revisit your projections regularly, stay consistent through market cycles, and align every SIP with a clearly defined life goal for stronger financial outcomes over time.</p>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}
