export interface FAQItem {
  q: string;
  a: string;
}

export interface BlogSection {
  heading: string;
  body: string;
  points?: string[];
}

export interface Blog {
  id: number;
  category: string;
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  sections: BlogSection[];
  faqs: FAQItem[];
}

const blogs: Blog[] = [
  {
    id: 1,
    category: 'IFSC & MICR Knowledge',
    slug: 'how-to-find-ifsc-code-of-any-bank-in-india',
    title: 'How to Find IFSC Code of Any Bank in India',
    description: 'Step-by-step Hinglish guide to find IFSC from passbook, cheque, bank site and IFSC code finder tools.',
    keywords: ['IFSC code finder', 'bank IFSC search', 'find IFSC code India'],
    sections: [
      { heading: 'IFSC Code Basics', body: 'IFSC code 11 character ka branch identifier hai jo online fund transfer ke liye mandatory hota hai. Pehle 4 letters bank code, 5th zero, last 6 branch code hote hain.' },
      { heading: 'Method 1: Bank Website', body: 'Har bank ka official branch locator hota hai. Bank select karo, state-city-branch choose karo aur IFSC copy karo.' },
      { heading: 'Method 2: Passbook and Cheque', body: 'Passbook ke first page aur cheque leaf par IFSC printed milta hai. MICR code bhi cheque ke bottom par milta hai.' },
      { heading: 'Method 3: IFSC Finder Tool', body: 'bankifsccode.biz jaise tool par bank + location filter use karke seconds mein IFSC mil jata hai.', points: ['Bank-wise page open karo', 'State aur city select karo', 'Branch choose karke IFSC verify karo'] },
      { heading: 'SEO Tip for Users', body: 'Long-tail search use karo jaise “SBI IFSC code Mumbai branch” ya “HDFC IFSC code Delhi”. Isse exact branch result jaldi milta hai.' },
    ],
    faqs: [
      { q: 'IFSC code kitne digit ka hota hai?', a: 'IFSC total 11 characters ka hota hai.' },
      { q: 'Kya IFSC aur branch code same hain?', a: 'Branch code IFSC ka part hota hai, lekin IFSC full 11-character code hai.' },
      { q: 'Kya IFSC online transfer mein mandatory hai?', a: 'Haan, NEFT/RTGS/IMPS ke liye required hota hai.' },
    ],
  },
  {
    id: 2,
    category: 'IFSC & MICR Knowledge',
    slug: 'ifsc-code-vs-micr-code-complete-guide',
    title: 'IFSC Code vs MICR Code – Complete Guide',
    description: 'IFSC vs MICR ka practical difference samjho: online transfer vs cheque clearing use-cases.',
    keywords: ['MICR code India', 'IFSC vs MICR difference'],
    sections: [
      { heading: 'IFSC Kya Hai?', body: 'IFSC digital transfer routing code hai jo RBI regulated banking system mein use hota hai.' },
      { heading: 'MICR Kya Hai?', body: 'MICR 9-digit code hai jo magnetic ink printing ke sath cheque clearing automation mein use hota hai.' },
      { heading: 'Main Difference', body: 'IFSC = NEFT/RTGS/IMPS routing. MICR = cheque processing. Dono ka role alag aur important hai.' },
      { heading: 'Real-world Use', body: 'Agar aap online transfer kar rahe ho to IFSC lagega. Agar cheque submit kar rahe ho to MICR relevant hoga.' },
    ],
    faqs: [{ q: 'Kya MICR online transfer mein chahiye?', a: 'Nahi, online transfer ke liye mostly IFSC chahiye.' }],
  },
  {
    id: 3,
    category: 'Online Transactions',
    slug: 'what-is-neft-rtgs-imps-full-comparison',
    title: 'What is NEFT, RTGS, IMPS – Full Comparison',
    description: 'NEFT RTGS IMPS difference with speed, limit, charges and best use-case in simple Hinglish.',
    keywords: ['NEFT RTGS IMPS difference'],
    sections: [
      { heading: 'NEFT Overview', body: 'NEFT batch-based fund transfer system hai, small to medium amount ke liye commonly use hota hai.' },
      { heading: 'RTGS Overview', body: 'RTGS high-value real-time settlement system hai, urgent large transactions ke liye suitable.' },
      { heading: 'IMPS Overview', body: 'IMPS instant 24x7 transfer option hai jo mobile/internet banking mein useful hai.' },
      { heading: 'Kaunsa Kab Use Kare?', body: 'High value urgent -> RTGS, normal transfer -> NEFT, instant anytime -> IMPS.' },
    ],
    faqs: [{ q: 'Kya teeno mein IFSC lagta hai?', a: 'Most account-based transfer flows mein IFSC required hota hai.' }],
  },
  {
    id: 4,
    category: 'Online Transactions',
    slug: 'how-to-transfer-money-using-ifsc-code',
    title: 'How to Transfer Money Using IFSC Code',
    description: 'Beneficiary add karke IFSC se secure transfer karne ka full workflow.',
    keywords: ['how to use IFSC code for online transfer'],
    sections: [
      { heading: 'Beneficiary Add Process', body: 'Recipient name, account number, IFSC enter karo aur confirm karo.' },
      { heading: 'Verification Steps', body: 'Branch match, bank name match aur account number double-check karo.' },
      { heading: 'Transfer Execution', body: 'NEFT/RTGS/IMPS mode select karo, amount daalo, OTP verify karke transfer complete karo.' },
    ],
    faqs: [{ q: 'Wrong IFSC hone par?', a: 'Transaction fail ya delay ho sakta hai; immediately bank support contact karein.' }],
  },
  {
    id: 5,
    category: 'Banking Guides',
    slug: 'list-of-all-banks-ifsc-codes-in-india',
    title: 'List of All Banks IFSC Codes in India',
    description: 'Bank-wise IFSC navigation strategy: SBI, HDFC, ICICI, PNB aur more.',
    keywords: ['bank branch details India', 'all banks IFSC codes'],
    sections: [{ heading: 'Bank-wise Navigation', body: 'Website architecture bank -> state -> city -> branch model follow karti hai jisse crawlability aur user journey dono improve hote hain.' }],
    faqs: [{ q: 'Top searched banks kaunse?', a: 'SBI, HDFC, ICICI, Axis, PNB, Canara usually highest demand mein rehte hain.' }],
  },
  {
    id: 6,
    category: 'Banking Guides',
    slug: 'how-to-check-bank-branch-details-online',
    title: 'How to Check Bank Branch Details Online',
    description: 'Address, contact, IFSC, MICR, district aur state details online kaise dekhein.',
    keywords: ['bank branch details India'],
    sections: [{ heading: 'Branch Detail Checklist', body: 'Branch name, IFSC, MICR, address, contact number aur PIN code verify karna best practice hai.' }],
    faqs: [{ q: 'Kya branch code aur IFSC same cheez hai?', a: 'Branch code IFSC ka last part hota hai, dono exactly same nahi.' }],
  },
  {
    id: 7,
    category: 'IFSC & MICR Knowledge',
    slug: 'what-happens-if-you-enter-wrong-ifsc-code',
    title: 'What Happens if You Enter Wrong IFSC Code',
    description: 'Wrong IFSC ke scenarios, failure cases aur recovery steps.',
    keywords: ['wrong IFSC code'],
    sections: [{ heading: 'Possible Outcomes', body: 'Wrong format par transaction reject ho jata hai. Valid but wrong branch par delay/manual intervention ho sakta hai.' }],
    faqs: [{ q: 'Refund kitne time mein aata hai?', a: 'Bank aur rail type par depend karta hai, usually 1-7 working days.' }],
  },
  {
    id: 8,
    category: 'Banking Guides',
    slug: 'how-to-find-ifsc-code-without-passbook',
    title: 'How to Find IFSC Code Without Passbook',
    description: 'Passbook nahi hai? Online methods aur quick alternatives dekho.',
    keywords: ['find IFSC without passbook'],
    sections: [{ heading: 'Alternatives', body: 'Cheque leaf, net banking beneficiary screen, SMS alerts, official bank branch pages use karo.' }],
    faqs: [{ q: 'Kya customer care IFSC batata hai?', a: 'Basic verification ke baad bank support IFSC help de sakta hai.' }],
  },
  {
    id: 9,
    category: 'Banking Guides',
    slug: 'top-10-banks-in-india-and-their-ifsc-codes',
    title: 'Top 10 Banks in India and Their IFSC Codes',
    description: 'Popular Indian banks aur unke IFSC prefix examples ke sath quick guide.',
    keywords: ['SBI IFSC code Mumbai branch', 'HDFC IFSC code Delhi'],
    sections: [{ heading: 'Popular Prefixes', body: 'SBI = SBIN, HDFC = HDFC, ICICI = ICIC jaise prefixes branch identification fast banate hain.' }],
    faqs: [{ q: 'Prefix se branch milti hai?', a: 'Prefix bank batata hai, exact branch ke liye full IFSC chahiye.' }],
  },
  {
    id: 10,
    category: 'Online Transactions',
    slug: 'how-to-use-ifsc-code-for-online-transfer',
    title: 'How to Use IFSC Code for Online Transfer',
    description: 'Online transfer flow with beneficiary activation and safe transaction checks.',
    keywords: ['bank IFSC search'],
    sections: [{ heading: 'Safe Transfer Flow', body: 'Beneficiary add -> cool-off period -> test transfer -> full transfer. Yeh flow fraud risk kam karta hai.' }],
    faqs: [{ q: 'Kya small test transfer karna chahiye?', a: 'Haan, first-time beneficiary par recommended hai.' }],
  },
  {
    id: 11,
    category: 'Online Transactions',
    slug: 'difference-between-neft-and-rtgs',
    title: 'Difference Between NEFT and RTGS',
    description: 'NEFT vs RTGS practical comparison for amount, urgency and settlement.',
    keywords: ['NEFT RTGS IMPS difference'],
    sections: [{ heading: 'Key Comparison', body: 'RTGS high-value urgent transfer ke liye better hai, NEFT regular non-urgent payments ke liye suitable.' }],
    faqs: [{ q: 'RTGS always instant hota hai?', a: 'Generally real-time settlement hota hai, bank-side processing factors remain.' }],
  },
  {
    id: 12,
    category: 'Banking Guides',
    slug: 'how-to-open-bank-account-online-in-india',
    title: 'How to Open Bank Account Online in India',
    description: 'Digital account opening process with CKYC, Aadhaar OTP and video KYC.',
    keywords: ['open bank account online India'],
    sections: [{ heading: 'Online Account Opening', body: 'PAN, Aadhaar, mobile verification aur video KYC ke saath few minutes mein account open ho sakta hai.' }],
    faqs: [{ q: 'Kya zero balance account online khul sakta hai?', a: 'Many banks digital zero balance products offer karte hain.' }],
  },
  {
    id: 13,
    category: 'Personal Finance',
    slug: 'best-savings-accounts-in-india',
    title: 'Best Savings Accounts in India',
    description: 'Savings account compare karte waqt interest, charges, ATM limit aur digital features kaise evaluate karein.',
    keywords: ['best savings account India'],
    sections: [{ heading: 'Comparison Framework', body: 'Interest rate + service quality + app usability + hidden charges check karo, sirf promotional rate par depend na karo.' }],
    faqs: [{ q: 'High interest account always best hai?', a: 'Nahi, charges aur service experience bhi equally important hai.' }],
  },
  {
    id: 14,
    category: 'Loan & EMI Guides',
    slug: 'how-to-calculate-emi-with-formula',
    title: 'How to Calculate EMI (with formula)',
    description: 'EMI formula, variables aur practical examples with EMI calculator India.',
    keywords: ['EMI calculator India'],
    sections: [{ heading: 'EMI Formula', body: 'EMI = P × r × (1+r)^n / ((1+r)^n - 1). Yahan P principal, r monthly rate, n tenure months hai.' }],
    faqs: [{ q: 'EMI kam kaise kare?', a: 'Longer tenure, lower rate negotiation, partial prepayment se EMI reduce ho sakti hai.' }],
  },
  {
    id: 15,
    category: 'Credit Cards & Banking Tips',
    slug: 'what-is-cibil-score-and-how-to-improve-it',
    title: 'What is CIBIL Score and How to Improve It',
    description: 'CIBIL score basics, score range meaning and practical improvement strategy.',
    keywords: ['CIBIL score improve'],
    sections: [{ heading: 'Improvement Strategy', body: 'On-time payments, low utilization, limited hard enquiries aur healthy credit mix se score improve hota hai.' }],
    faqs: [{ q: 'Good CIBIL score kitna hota hai?', a: 'Generally 750+ score ko strong profile mana jata hai.' }],
  },
];

export default blogs;
