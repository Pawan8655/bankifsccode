import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';

const HOLIDAYS_2026 = [
  ['January 26, 2026', 'Republic Day', 'National'],
  ['March 21, 2026', 'Holi', 'Most States'],
  ['March 31, 2026', 'Id-ul-Fitr (Tentative)', 'Most States'],
  ['April 14, 2026', 'Dr Ambedkar Jayanti', 'Many States'],
  ['August 15, 2026', 'Independence Day', 'National'],
  ['August 29, 2026', 'Janmashtami', 'Many States'],
  ['October 2, 2026', 'Gandhi Jayanti', 'National'],
  ['October 20, 2026', 'Dussehra', 'Most States'],
  ['November 8, 2026', 'Diwali (Laxmi Pujan)', 'Most States'],
  ['December 25, 2026', 'Christmas', 'National'],
];

export default function BankHolidays() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Bank Holidays 2026 in India | State-wise Planning Guide"
        description="Check major bank holidays in India for 2026. Plan NEFT, RTGS, IMPS and branch visits with this simple holiday table."
        path="/bank-holidays"
        keywords="bank holidays 2026 india, today bank holiday, bank holiday near me, RBI holiday list"
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">📅 Bank Holidays 2026 (India)</h1>
        <p className="mt-3 text-sm text-slate-600">Short answer: Branch holidays me NEFT/RTGS processing delay ho sakta hai, lekin IMPS/UPI usually available rehta hai.</p>

        <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Holiday</th>
                <th className="p-3 text-left">Coverage</th>
              </tr>
            </thead>
            <tbody>
              {HOLIDAYS_2026.map(([date, holiday, coverage]) => (
                <tr key={date} className="border-t">
                  <td className="p-3">{date}</td>
                  <td className="p-3 font-medium">{holiday}</td>
                  <td className="p-3">{coverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
