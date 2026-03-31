export interface ToolField {
  key: string;
  label: string;
  type?: 'number' | 'text';
  defaultValue: number | string;
}

export interface ToolDefinition {
  slug: string;
  title: string;
  category: string;
  description: string;
  fields: ToolField[];
}

const MONEY_FIELDS: ToolField[] = [
  { key: 'amount', label: 'Amount (₹)', defaultValue: 100000 },
  { key: 'rate', label: 'Rate (%)', defaultValue: 10 },
  { key: 'years', label: 'Years', defaultValue: 5 },
];

const QUICK_FIELDS: ToolField[] = [
  { key: 'value1', label: 'Value 1', defaultValue: 100 },
  { key: 'value2', label: 'Value 2', defaultValue: 50 },
];

const TEXT_QUERY: ToolField[] = [{ key: 'query', label: 'Search Query', type: 'text', defaultValue: '' }];

const tool = (slug: string, title: string, category: string, description: string, fields: ToolField[] = MONEY_FIELDS): ToolDefinition => ({
  slug,
  title,
  category,
  description,
  fields,
});

const CORE_TOOLS: ToolDefinition[] = [
  tool('ifsc-code-finder', 'IFSC Code Finder', 'Banking Tools', 'Search branch-wise IFSC code finder India results.', TEXT_QUERY),
  tool('micr-code-finder', 'MICR Code Finder', 'Banking Tools', 'Find MICR code online for cheque and ECS details.', TEXT_QUERY),
  tool('bank-branch-details', 'Bank Branch Details India', 'Banking Tools', 'Get bank branch details India by bank, state, city, branch.', TEXT_QUERY),
  tool('emi-calculator', 'EMI Calculator', 'Financial Calculators', 'Calculate monthly EMI, interest and total repayment for any loan.'),
  tool('loan-calculator', 'Loan Calculator', 'Financial Calculators', 'Quick loan repayment planning with interest breakup.'),
  tool('interest-calculator', 'Interest Calculator', 'Financial Calculators', 'Simple interest planning for savings and loans.'),
  tool('compound-interest-calculator', 'Compound Interest Calculator', 'Financial Calculators', 'Estimate yearly compounding growth and maturity value.'),
  tool('mortgage-calculator', 'Mortgage Calculator', 'Financial Calculators', 'Estimate mortgage EMI and long-term interest outgo.'),
  tool('amortization-calculator', 'Amortization Calculator', 'Financial Calculators', 'View principal and interest split month by month.'),
  tool('sip-calculator', 'SIP Calculator', 'Financial Calculators', 'Calculate SIP maturity, invested amount and returns.'),
  tool('fd-calculator', 'FD Calculator', 'Financial Calculators', 'Project fixed deposit maturity with compounding.'),
  tool('rd-calculator', 'RD Calculator', 'Financial Calculators', 'Calculate recurring deposit corpus for goal planning.'),
  tool('roi-calculator', 'Financial Calculators', 'Financial Calculators', 'Check return on investment percentage and amount.', QUICK_FIELDS),
  tool('irr-calculator', 'IRR Calculator', 'Financial Calculators', 'Estimate internal rate of return for cashflow series.', QUICK_FIELDS),
  tool('payback-period-calculator', 'Payback Period Calculator', 'Financial Calculators', 'Find years required to recover initial investment.', QUICK_FIELDS),
  tool('present-value-calculator', 'Present Value Calculator', 'Financial Calculators', 'Discount future cashflows to current value.'),
  tool('future-value-calculator', 'Future Value Calculator', 'Financial Calculators', 'Estimate future value of current investment.'),
  tool('retirement-calculator', 'Retirement Calculator', 'Financial Calculators', 'Plan retirement corpus and monthly post-retirement income.'),
  tool('pension-calculator', 'Pension Calculator', 'Financial Calculators', 'Estimate pension corpus and annuity income.'),
  tool('income-tax-calculator', 'Income Tax Calculator', 'Financial Calculators', 'Calculate tax liability as per India slabs.'),
  tool('salary-calculator', 'Salary Calculator', 'Financial Calculators', 'Convert CTC to in-hand salary estimate.'),
  tool('gst-calculator', 'GST Calculator', 'Financial Calculators', 'Find GST inclusive and exclusive amounts.'),
  tool('credit-card-calculator', 'Credit Card Calculator', 'Financial Calculators', 'Estimate revolving credit card interest cost.', QUICK_FIELDS),
  tool('debt-payoff-calculator', 'Debt Payoff Calculator', 'Financial Calculators', 'Plan debt snowball or avalanche payoff timeline.', QUICK_FIELDS),
  tool('personal-loan-calculator', 'Personal Loan Calculator', 'Financial Calculators', 'Compare personal loan EMI options quickly.'),
  tool('business-loan-calculator', 'Business Loan Calculator', 'Financial Calculators', 'Estimate MSME or business loan EMI and cost.'),
  tool('budget-calculator', 'Budget Calculator', 'Financial Calculators', 'Track income vs expenses and savings rate.', QUICK_FIELDS),
  tool('commission-calculator', 'Commission Calculator', 'Financial Calculators', 'Calculate sales commission and payout.', QUICK_FIELDS),
];

const AUTO_TOOLS = [
  'Auto Loan Calculator', 'Lease Calculator', 'Mileage Calculator', 'Fuel Cost Calculator', 'Car Affordability Calculator', 'Road Trip Cost Calculator', 'Bike Loan Calculator',
].map((title) => tool(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), title, 'Auto Calculators', `${title} for car and vehicle planning.`, QUICK_FIELDS));

const INVESTMENT_TOOLS = [
  'Mutual Fund Calculator', 'Stock Return Calculator', 'Bond Calculator', 'Average Return Calculator', 'Lumpsum Calculator', 'CAGR Calculator', 'XIRR Calculator', 'Dividend Yield Calculator', 'Asset Allocation Calculator', 'Risk Reward Calculator', 'ETF Return Calculator', 'PPF Calculator', 'NPS Calculator', 'Sukanya Samriddhi Calculator', 'Gold Investment Calculator', 'SWP Calculator',
].map((title) => tool(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), title, 'Investment Tools', `${title} to plan better investing decisions.`, MONEY_FIELDS));

const HEALTH_TOOLS = [
  'BMI Calculator', 'Calorie Calculator', 'BMR Calculator', 'Body Fat Calculator', 'Ideal Weight Calculator', 'Pregnancy Calculator', 'Ovulation Calculator', 'Water Intake Calculator', 'Protein Intake Calculator', 'Macro Calculator', 'Body Surface Area Calculator', 'Heart Rate Zone Calculator', 'Due Date Calculator', 'TDEE Calculator',
].map((title) => tool(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), title, 'Health Calculators', `${title} with easy inputs and quick output.`, QUICK_FIELDS));

const MATH_TOOLS = [
  'Percentage Calculator', 'Scientific Calculator', 'Fraction Calculator', 'Probability Calculator', 'Standard Deviation Calculator', 'Mean Median Mode Calculator', 'Matrix Calculator', 'Log Calculator', 'LCM HCF Calculator', 'Ratio Calculator', 'Permutation Combination Calculator', 'Quadratic Equation Calculator', 'Prime Number Calculator', 'Simple Algebra Calculator', 'Geometry Calculator',
].map((title) => tool(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), title, 'Math Calculators', `${title} for students and daily problem solving.`, QUICK_FIELDS));

const UTILITY_TOOLS = [
  'Age Calculator', 'Date Calculator', 'Time Calculator', 'GPA Calculator', 'Grade Calculator', 'Tip Calculator', 'Inflation Calculator', 'Currency Converter', 'Unit Converter', 'Password Generator', 'IP Subnet Calculator', 'Random Number Generator', 'Binary Converter', 'Text Case Converter', 'URL Encoder Decoder', 'File Size Converter', 'Loan Comparison Tool', 'Investment Comparison Tool', 'Savings Goal Calculator', 'Emergency Fund Calculator',
].map((title) => tool(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), title, 'Utility Calculators', `${title} for daily productivity and finance utility.`, QUICK_FIELDS));

const ADVANCED_TOOLS = [
  'Ohms Law Calculator', 'Voltage Calculator', 'Speed Calculator', 'Density Calculator', 'Power Calculator', 'Current Calculator', 'Resistor Color Code Calculator', 'Bandwidth Calculator', 'Data Transfer Calculator', 'Simple Machine Calculator', 'Break-even Calculator', 'Profit Margin Calculator', 'Inventory Turnover Calculator', 'Working Capital Calculator', 'Depreciation Calculator', 'NPV Calculator', 'Scenario Analysis Calculator', 'Cash Flow Calculator', 'Net Worth Calculator', 'Credit Utilization Calculator',
].map((title) => tool(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), title, 'Advanced Tools', `${title} for advanced professional use cases.`, QUICK_FIELDS));

export const TOOL_CATALOG: ToolDefinition[] = [
  ...CORE_TOOLS,
  ...AUTO_TOOLS,
  ...INVESTMENT_TOOLS,
  ...HEALTH_TOOLS,
  ...MATH_TOOLS,
  ...UTILITY_TOOLS,
  ...ADVANCED_TOOLS,
  tool('neft-ifsc-search', 'NEFT IFSC Search Tool', 'Banking Tools', 'Find IFSC code for NEFT transfer safely.', TEXT_QUERY),
  tool('rtgs-ifsc-search', 'RTGS IFSC Search Tool', 'Banking Tools', 'Validate IFSC for RTGS large-value payments.', TEXT_QUERY),
  tool('imps-ifsc-search', 'IMPS IFSC Search Tool', 'Banking Tools', 'Quick IFSC check before IMPS transfer.', TEXT_QUERY),
  tool('sbi-ifsc-code-mumbai-branch', 'SBI IFSC Code Mumbai Branch Finder', 'Banking Tools', 'Long-tail search page for SBI IFSC code Mumbai branch.', TEXT_QUERY),
  tool('hdfc-ifsc-code-delhi', 'HDFC IFSC Code Delhi Finder', 'Banking Tools', 'Keyword-focused search page for HDFC IFSC code Delhi.', TEXT_QUERY),
  tool('icici-bank-ifsc-near-me', 'ICICI Bank IFSC Near Me Finder', 'Banking Tools', 'Find ICICI bank IFSC near me by nearby city and branch.', TEXT_QUERY),
];

export const TOOL_CATEGORY_ORDER = [
  'Banking Tools',
  'Financial Calculators',
  'Auto Calculators',
  'Investment Tools',
  'Health Calculators',
  'Math Calculators',
  'Utility Calculators',
  'Advanced Tools',
];

export const findToolBySlug = (slug?: string) => TOOL_CATALOG.find((toolItem) => toolItem.slug === slug);
