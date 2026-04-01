import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';

const KEYWORDS = [
  'sbi ifsc code mumbai fort branch','hdfc bank ifsc code near me in delhi','icici bank ifsc code bangalore indiranagar','pnb ifsc code lucknow hazratganj branch','axis bank ifsc code pune kothrud','kotak bank ifsc code hyderabad gachibowli','canara bank ifsc code chennai t nagar','bank of baroda ifsc code ahmedabad navrangpura','union bank ifsc code jaipur vaishali nagar','indusind bank ifsc code kolkata salt lake',
  'near me bank branch ifsc code finder','nearest sbi branch ifsc code near me','nearest hdfc branch ifsc code near me','bank ifsc micr code near me','closest bank branch for neft near me','ifsc code by gps location india','branch code finder near my location','today open bank branch near me ifsc','atm cum branch ifsc code near me','weekend open bank branch near me',
  'what is ifsc code in bank transfer','how to find ifsc code from account number','is ifsc required for imps transfer','can i transfer without ifsc code','difference between ifsc and micr code','how to verify correct ifsc code online','which ifsc code to use for rtgs','how to find home branch ifsc code','why neft transfer failed wrong ifsc','how to check ifsc code is active',
  'sbi branch ifsc code in noida sector 62','hdfc ifsc code gurgaon cyber city','icici ifsc code chennai anna nagar','axis bank ifsc code indore vijay nagar','yes bank ifsc code surat adajan','bob ifsc code varanasi cantt','canara ifsc code coimbatore gandhipuram','idfc first bank ifsc code thane','federal bank ifsc code kochi mg road','central bank ifsc code patna boring road',
  'best ifsc code search website india','ifsc code checker with branch address','bank branch ifsc finder by city and state','ifsc code for salary account branch','ifsc code for rent payment transfer','ifsc code for school fee transfer','ifsc code for online beneficiary add','ifsc lookup for neft rtgs imps india','bank holiday and ifsc transfer timing','ifsc code list of all banks in india'
];

const FAQS = [
  ['What is IFSC code?', 'IFSC ek 11-character bank branch code hai jo online transfer routing ke liye use hota hai.'],
  ['Where to find IFSC quickly?', 'Passbook, cheque leaf, bank app, ya IFSC search page par branch name se.'],
  ['Is IFSC needed for IMPS?', 'Haan, IMPS me account + IFSC route ke liye IFSC required hota hai.'],
  ['IFSC and MICR same hai kya?', 'Nahi, IFSC online transfer ke liye aur MICR cheque processing ke liye hota hai.'],
  ['Wrong IFSC dalne se kya hoga?', 'Transfer fail ho sakta hai ya delay ho sakta hai, isliye submit se pehle verify karein.'],
  ['Can I use old IFSC?', 'Bank merger ke baad IFSC change ho sakta hai, latest code hi use karein.'],
  ['How to check branch near me?', 'Near me finder ya city-wise IFSC branch list se nearest branch identify karein.'],
  ['NEFT timing kya hoti hai?', 'NEFT mostly 24x7 batches me process hota hai, bank cut-off ke hisab se delay aa sakta hai.'],
  ['RTGS kab use karein?', 'High-value urgent transfer ke liye RTGS best option hota hai.'],
  ['Is IFSC page safe to use?', 'Haan, verification ke liye useful hai, final confirmation bank se cross-check karein.'],
];

const BLOG_IDEAS = [
  'IFSC Code kya hota hai? Beginner guide for India',
  'NEFT vs RTGS vs IMPS: simple comparison',
  'Beneficiary add karte waqt 10 common mistakes',
  'Wrong IFSC se transfer fail? Recovery steps',
  'Bank holidays me fund transfer planning kaise karein',
  'Online banking safety checklist for first-time users',
  'UPI vs IMPS: speed, limit, use cases',
  'MICR code explained in simple Hinglish',
  'City-wise branch search strategy for business payments',
  'How to verify branch address before large transfer',
  'Salary account transfer guide with IFSC verification',
  'Rent payment via bank transfer: full checklist',
  'RTGS large payment compliance basics',
  'How bank mergers changed IFSC codes in India',
  'Branch code, IFSC, SWIFT difference explained',
  'Senior citizens ke liye secure online banking tips',
  'Cheque se online transfer shift karne ka simple roadmap',
  'Best practices for vendor payment using NEFT',
  'Festival season me banking fraud se kaise bachein',
  'Top tools for EMI, FD and SIP financial planning',
];

export default function BankComparison() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Bank Comparison, IFSC SEO Keywords, FAQs & Blog Ideas"
        description="Get IFSC SEO resources: 50 long-tail keywords, 10 featured-snippet FAQs, and 20 blog ideas for Indian banking traffic growth."
        path="/bank-comparison"
        keywords="ifsc seo keywords india, bank comparison pages, ifsc faq schema, banking blog ideas"
      />
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold">📊 Bank Comparison & SEO Resource Hub</h1>

        <section className="rounded-xl border bg-white p-5">
          <h2 className="text-xl font-semibold">50 Long-tail IFSC SEO Keywords</h2>
          <ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">
            {KEYWORDS.map((keyword) => <li key={keyword} className="rounded border p-2">• {keyword}</li>)}
          </ul>
        </section>

        <section className="rounded-xl border bg-white p-5">
          <h2 className="text-xl font-semibold">10 SEO-friendly FAQs (Featured Snippet style)</h2>
          <div className="mt-3 space-y-3 text-sm">
            {FAQS.map(([q, a]) => (
              <div key={q}>
                <h3 className="font-semibold">{q}</h3>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border bg-white p-5">
          <h2 className="text-xl font-semibold">20 Blog Post Ideas (Banking + IFSC + Transfers)</h2>
          <ol className="mt-3 list-decimal pl-5 text-sm space-y-1">
            {BLOG_IDEAS.map((idea) => <li key={idea}>{idea}</li>)}
          </ol>
        </section>
      </main>
      <Footer />
    </div>
  );
}
