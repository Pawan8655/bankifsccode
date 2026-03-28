interface Question {
  q: string;
  a: string;
}

interface Blog {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

const trendTopics = [
  'Best Credit Card for Online Shopping in India (2026)',
  'How to Improve CIBIL Score Before Loan Application',
  'Top Zero Balance Savings Accounts for Salaried Users',
  'Personal Loan vs Credit Card EMI: Which Is Better?',
  'Best Demat Accounts for Beginner Investors',
  'How to Choose Health Insurance for Family Floater Plans',
  'Top Cashback Credit Cards for UPI and Utility Bills',
  'FD vs Debt Mutual Fund: Safety and Returns Comparison',
  'How to Pick a Personal Loan with Lowest Total Cost',
  'SIP Strategy for New Investors: Monthly vs Weekly',
  'Credit Card Annual Fee Waiver: How It Works',
  'Best Travel Credit Cards in India for 2026',
  'How to Compare Home Loan Interest Rates Smartly',
  'Emergency Fund Planning with Liquid Instruments',
  'Top Banking Apps for Budgeting and Expense Tracking',
  'UPI Safety Checklist for Daily Transactions',
  'How to Select Term Insurance with Right Cover Amount',
  'Gold Loan vs Personal Loan: Which One to Choose?',
  'How to Build a Low-Risk Portfolio for Beginners',
  'Tax Saving Options Beyond Section 80C',
  'Best Salary Account Benefits You Should Negotiate',
  'How to Choose Child Education Investment Plans',
  'Loan Prepayment vs Investing Extra Money',
  'How to Avoid Hidden Charges in Bank Accounts',
  'Beginner Guide to ETF Investing in India',
  'Smart Ways to Use Credit Card Reward Points',
  'How to Compare Insurance Claim Settlement Ratios',
  'Best Senior Citizen Savings Options in 2026',
  'Understanding Co-Branded Credit Cards',
  'How to Create a Debt Repayment Roadmap',
  'Top Finance Tools Every Freelancer Should Use',
  'How to Choose the Right ULIP for Long-Term Goals',
  'Mutual Fund Expense Ratio Explained Simply',
  'How to Use EMI Calculator Before Buying Gadgets',
  'Best Health Insurance Add-ons Worth Paying For',
  'How to Evaluate Instant Loan App Offers Safely',
  'Secured Card vs Unsecured Card for First-Time Users',
  'How to Manage Multiple Bank Accounts Efficiently',
  'Best SIP Categories for Long-Term Wealth Creation',
  'How to Build Credit History from Scratch in India',
  'Car Loan vs Leasing: Detailed Cost Breakdown',
  'Best Premium Credit Cards for Airport Lounge Access',
  'How to Pick NRE/NRO Accounts for NRIs',
  'Insurance Waiting Periods: What Buyers Must Know',
  'How to Analyze Your Monthly Bank Statement Like a Pro',
  'Best Financial Products for Young Professionals',
  'How to Choose a Broker for Intraday and Delivery',
  'Top Mistakes to Avoid While Taking a Personal Loan',
  'How to Plan for Early Retirement in India',
  'Best Finance Trends to Watch in 2026 for Indian Users',
];

const makeQuestions = (title: string): Question[] => [
  {
    q: `What is the key benefit of ${title}?`,
    a: 'It helps users compare options quickly and choose products with better value, lower costs, and clearer eligibility.',
  },
  {
    q: 'Which users should read this guide first?',
    a: 'Beginners, salaried professionals, and families planning better banking, credit, loan, insurance, and investment decisions.',
  },
  {
    q: 'How does this topic connect to financial tools?',
    a: 'The article explains which calculators, comparison checklists, and category-wise product filters should be used before applying.',
  },
  {
    q: 'Can this topic help avoid common financial mistakes?',
    a: 'Yes. Each guide includes practical checks for fees, risk, documentation, and repayment capacity.',
  },
  {
    q: 'Is this content India-focused?',
    a: 'Yes, every article is tailored for Indian users, products, regulations, and real banking workflows.',
  },
];

const blogs: Blog[] = trendTopics.map((title, index) => ({
  id: index + 1,
  title,
  description: `Practical, India-focused guide on ${title.toLowerCase()} with actionable insights, product comparisons, and tool-based planning tips.`,
  questions: makeQuestions(title),
}));

export default blogs;
