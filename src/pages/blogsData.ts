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

const blogs: Blog[] = [
  {
    id: 1,
    title: "What is IFSC Code and Why It Is Important?",
    description:
      "Learn what an IFSC code is, how it works, and why it is required for online banking transactions.",
    questions: [
      { q: "What does IFSC stand for?", a: "IFSC stands for Indian Financial System Code." },
      { q: "Where is IFSC used?", a: "It is used in NEFT, RTGS, and IMPS transactions." },
      { q: "Is IFSC unique?", a: "Yes, every bank branch has a unique IFSC code." },
      { q: "Can IFSC change?", a: "Yes, if a branch is merged or relocated." },
      { q: "How many characters are in IFSC?", a: "It contains 11 characters." },
      { q: "Is IFSC required for UPI?", a: "No, UPI does not require IFSC." },
      { q: "Can I find IFSC online?", a: "Yes, on bank websites and IFSC lookup tools." },
      { q: "Is IFSC printed on cheque?", a: "Yes, it is printed on cheque leaves." },
      { q: "Do all banks have IFSC?", a: "Yes, all RBI-registered banks have IFSC." },
      { q: "Is IFSC case sensitive?", a: "No, it is not case sensitive." }
    ]
  },

  {
    id: 2,
    title: "How to Find Bank Branch Details Using IFSC Code",
    description:
      "A step-by-step guide to finding bank name, branch, city, and state using IFSC code.",
    questions: [
      { q: "Can IFSC tell branch name?", a: "Yes, IFSC uniquely identifies a branch." },
      { q: "Can I find city from IFSC?", a: "Yes, branch city details are available." },
      { q: "Is IFSC enough for bank transfer?", a: "Yes, along with account number." },
      { q: "Do rural branches have IFSC?", a: "Yes, every branch has IFSC." },
      { q: "Is MICR same as IFSC?", a: "No, MICR is different and used for cheques." },
      { q: "Can IFSC identify bank name?", a: "Yes, first 4 characters identify bank." },
      { q: "Is IFSC required for cash deposit?", a: "No, it is not required." },
      { q: "Can I search IFSC by branch?", a: "Yes, using IFSC lookup tools." },
      { q: "Does IFSC show state?", a: "Yes, branch state details are included." },
      { q: "Is IFSC mandatory?", a: "Yes, for online transfers." }
    ]
  },

  {
    id: 3,
    title: "Understanding NEFT vs RTGS: Key Differences",
    description:
      "Compare NEFT and RTGS transactions, their limits, timings, and when to use each.",
    questions: [
      { q: "What is NEFT?", a: "NEFT is National Electronic Funds Transfer for small amounts." },
      { q: "What is RTGS?", a: "RTGS is Real Time Gross Settlement for large amounts." },
      { q: "NEFT timing?", a: "NEFT operates in batches throughout the day." },
      { q: "RTGS timing?", a: "RTGS is real-time during banking hours." },
      { q: "NEFT limit?", a: "No upper limit, but lower for small transfers." },
      { q: "RTGS limit?", a: "Minimum ₹2 lakh, no upper limit." },
      { q: "NEFT charges?", a: "Low or zero charges." },
      { q: "RTGS charges?", a: "Higher charges than NEFT." },
      { q: "Which is faster?", a: "RTGS is faster for large amounts." },
      { q: "Both require IFSC?", a: "Yes, both need IFSC code." }
    ]
  },

  {
    id: 4,
    title: "IMPS: Instant Money Transfer Service Explained",
    description:
      "Learn about IMPS, how it works, and its advantages over other transfer methods.",
    questions: [
      { q: "What is IMPS?", a: "IMPS is Instant Money Transfer Service." },
      { q: "IMPS timing?", a: "24/7 instant transfers." },
      { q: "IMPS limit?", a: "₹2 lakh per transaction." },
      { q: "IMPS charges?", a: "Varies by bank and amount." },
      { q: "IMPS requires IFSC?", a: "No, uses MMID or mobile number." },
      { q: "IMPS for international?", a: "No, only domestic." },
      { q: "IMPS security?", a: "Uses OTP and PIN for security." },
      { q: "IMPS vs UPI?", a: "IMPS is older, UPI is newer and integrated." },
      { q: "IMPS availability?", a: "Available on mobile apps and SMS." },
      { q: "IMPS for merchants?", a: "Yes, supports merchant payments." }
    ]
  },

  {
    id: 5,
    title: "UPI: Unified Payments Interface Guide",
    description:
      "Complete guide to UPI, how to use it, and its benefits for digital payments.",
    questions: [
      { q: "What is UPI?", a: "UPI is Unified Payments Interface for instant payments." },
      { q: "UPI limit?", a: "₹1 lakh per transaction." },
      { q: "UPI timing?", a: "24/7 availability." },
      { q: "UPI charges?", a: "Mostly free." },
      { q: "UPI requires IFSC?", a: "No, uses UPI ID." },
      { q: "UPI apps?", a: "BHIM, Google Pay, PhonePe, etc." },
      { q: "UPI security?", a: "Uses UPI PIN and biometric." },
      { q: "UPI for international?", a: "Limited international support." },
      { q: "UPI vs IMPS?", a: "UPI is more user-friendly." },
      { q: "UPI for businesses?", a: "Yes, supports QR codes." }
    ]
  },

  {
    id: 6,
    title: "MICR Code: What It Is and How It Differs from IFSC",
    description:
      "Understand MICR codes, their purpose, and how they differ from IFSC codes.",
    questions: [
      { q: "What is MICR?", a: "MICR is Magnetic Ink Character Recognition." },
      { q: "MICR used for?", a: "Cheque processing." },
      { q: "MICR characters?", a: "9 digits." },
      { q: "MICR vs IFSC?", a: "MICR for cheques, IFSC for online transfers." },
      { q: "MICR location?", a: "Bottom of cheque." },
      { q: "MICR unique?", a: "Yes, per branch." },
      { q: "MICR required for online?", a: "No." },
      { q: "MICR printed?", a: "Yes, in magnetic ink." },
      { q: "MICR for ECS?", a: "Yes, used in ECS." },
      { q: "MICR international?", a: "No, India-specific." }
    ]
  },

  {
    id: 7,
    title: "Bank Account Types in India",
    description:
      "Overview of different bank account types available in Indian banks.",
    questions: [
      { q: "Savings account?", a: "For personal savings and transactions." },
      { q: "Current account?", a: "For businesses and frequent transactions." },
      { q: "Fixed deposit?", a: "For high interest savings." },
      { q: "Recurring deposit?", a: "Regular savings with interest." },
      { q: "Salary account?", a: "For salary credits." },
      { q: "NRI account?", a: "For Non-Resident Indians." },
      { q: "Joint account?", a: "Shared by multiple people." },
      { q: "Zero balance?", a: "No minimum balance required." },
      { q: "Senior citizen?", a: "Special benefits for seniors." },
      { q: "Student account?", a: "For students with low fees." }
    ]
  },

  {
    id: 8,
    title: "Online Banking Security Tips",
    description:
      "Essential security tips for safe online banking and digital transactions.",
    questions: [
      { q: "Use strong passwords?", a: "Yes, complex and unique." },
      { q: "Enable 2FA?", a: "Yes, for extra security." },
      { q: "Avoid public WiFi?", a: "Yes, for sensitive transactions." },
      { q: "Check URLs?", a: "Ensure https and correct domain." },
      { q: "Don't share OTP?", a: "Never share with anyone." },
      { q: "Use official apps?", a: "Download from official stores." },
      { q: "Regular logout?", a: "Always logout after use." },
      { q: "Monitor statements?", a: "Check regularly for fraud." },
      { q: "Update software?", a: "Keep apps and OS updated." },
      { q: "Report suspicious?", a: "Contact bank immediately." }
    ]
  },

  {
    id: 9,
    title: "Understanding Bank Charges and Fees",
    description:
      "Learn about various bank charges, fees, and how to minimize them.",
    questions: [
      { q: "Account maintenance?", a: "Monthly fee for accounts." },
      { q: "ATM withdrawal?", a: "Charges for cash withdrawal." },
      { q: "NEFT/RTGS fees?", a: "Transaction charges." },
      { q: "Cheque bounce?", a: "Penalty for insufficient funds." },
      { q: "SMS alerts?", a: "Charges for notifications." },
      { q: "Card replacement?", a: "Fee for lost cards." },
      { q: "Foreign transaction?", a: "Extra charges for international." },
      { q: "Late payment?", a: "Penalty for delayed payments." },
      { q: "Dormant account?", a: "Charges for inactive accounts." },
      { q: "How to avoid?", a: "Maintain balance, use online banking." }
    ]
  },

  {
    id: 10,
    title: "Digital Banking Trends in India",
    description:
      "Latest trends and innovations in digital banking in India.",
    questions: [
      { q: "UPI growth?", a: "Rapid adoption across India." },
      { q: "Contactless payments?", a: "Increasing with cards and phones." },
      { q: "AI in banking?", a: "Chatbots and fraud detection." },
      { q: "Blockchain?", a: "For secure transactions." },
      { q: "Open banking?", a: "Sharing data with third parties." },
      { q: "Mobile banking?", a: "Apps replacing branches." },
      { q: "Voice banking?", a: "Using voice commands." },
      { q: "Biometric auth?", a: "Fingerprint and face ID." },
      { q: "Digital wallets?", a: "Growing popularity." },
      { q: "Future outlook?", a: "More digital, less cash." }
    ]
  },

  {
    id: 11,
    title: "How to Open a Bank Account Online",
    description:
      "Step-by-step guide to opening a bank account through online channels.",
    questions: [
      { q: "Required documents?", a: "ID proof, address proof, photo." },
      { q: "Online process?", a: "Fill form, upload docs, verify." },
      { q: "Video KYC?", a: "Online verification process." },
      { q: "Account activation?", a: "After verification." },
      { q: "Digital signature?", a: "Required for some banks." },
      { q: "Nomination?", a: "Optional but recommended." },
      { q: "Initial deposit?", a: "Varies by bank." },
      { q: "Time taken?", a: "Few hours to days." },
      { q: "All banks online?", a: "Most major banks support." },
      { q: "Benefits?", a: "Convenient, no branch visit." }
    ]
  },

  {
    id: 12,
    title: "Credit Cards vs Debit Cards: Key Differences",
    description:
      "Compare credit and debit cards, their features, and usage.",
    questions: [
      { q: "Credit card?", a: "Borrow money up to limit." },
      { q: "Debit card?", a: "Use own money." },
      { q: "Interest?", a: "Credit cards charge interest." },
      { q: "Overdraft?", a: "Debit cards may allow." },
      { q: "Rewards?", a: "Both offer rewards." },
      { q: "Foreign transaction?", a: "Both support." },
      { q: "Cash withdrawal?", a: "Both allow." },
      { q: "Credit score?", a: "Credit cards affect score." },
      { q: "Security?", a: "Both use chip and PIN." },
      { q: "Best for?", a: "Credit for purchases, debit for cash." }
    ]
  },

  {
    id: 13,
    title: "Understanding Bank Statements",
    description:
      "How to read and understand your bank account statements.",
    questions: [
      { q: "What is statement?", a: "Record of all transactions." },
      { q: "Balance?", a: "Opening and closing balance." },
      { q: "Transaction details?", a: "Date, description, amount." },
      { q: "Credits?", a: "Money received." },
      { q: "Debits?", a: "Money spent." },
      { q: "Charges?", a: "Bank fees." },
      { q: "Interest?", a: "Earned or charged." },
      { q: "Period?", a: "Usually monthly." },
      { q: "Online access?", a: "Available on app/website." },
      { q: "Dispute?", a: "Contact bank for errors." }
    ]
  },

  {
    id: 14,
    title: "Mobile Banking Apps: Features and Benefits",
    description:
      "Explore features of mobile banking apps and their advantages.",
    questions: [
      { q: "Account balance?", a: "Check anytime." },
      { q: "Fund transfer?", a: "Easy transfers." },
      { q: "Bill payments?", a: "Pay utilities online." },
      { q: "Card management?", a: "Block/unblock cards." },
      { q: "Notifications?", a: "Transaction alerts." },
      { q: "Security?", a: "Biometric login." },
      { q: "Investment?", a: "Some apps offer." },
      { q: "Customer support?", a: "24/7 chat." },
      { q: "Offline features?", a: "Limited offline access." },
      { q: "Multi-bank?", a: "Some support multiple banks." }
    ]
  },

  {
    id: 15,
    title: "Bank Holidays in India",
    description:
      "Important information about bank holidays and their impact on transactions.",
    questions: [
      { q: "Sunday holiday?", a: "Banks closed on Sundays." },
      { q: "Second Saturday?", a: "Banks open, but limited." },
      { q: "Public holidays?", a: "Banks closed on gazetted holidays." },
      { q: "Regional holidays?", a: "Vary by state." },
      { q: "Online banking?", a: "Available on holidays." },
      { q: "ATM access?", a: "Available 24/7." },
      { q: "Transaction cutoff?", a: "Earlier on holidays." },
      { q: "Emergency services?", a: "Limited on holidays." },
      { q: "Holiday list?", a: "Available on RBI website." },
      { q: "Impact on transfers?", a: "May delay processing." }
    ]
  },

  {
    id: 16,
    title: "KYC: Know Your Customer Process",
    description:
      "Understanding KYC requirements and procedures for banking.",
    questions: [
      { q: "What is KYC?", a: "Know Your Customer verification." },
      { q: "Why KYC?", a: "Prevent money laundering." },
      { q: "Documents needed?", a: "ID, address, photo." },
      { q: "Video KYC?", a: "Online verification process." },
      { q: "KYC validity?", a: "Usually 10 years." },
      { q: "Periodic KYC?", a: "Update every few years." },
      { q: "Non-compliance?", a: "Account restrictions." },
      { q: "Digital KYC?", a: "Using Aadhaar." },
      { q: "For NRI?", a: "Additional documents." },
      { q: "KYC for minors?", a: "Guardian's documents." }
    ]
  },

  {
    id: 17,
    title: "Investment Options in Banks",
    description:
      "Various investment products offered by banks in India.",
    questions: [
      { q: "Fixed deposits?", a: "Safe investment with interest." },
      { q: "Recurring deposits?", a: "Regular savings." },
      { q: "Mutual funds?", a: "Through bank advisors." },
      { q: "Insurance?", a: "Life and general insurance." },
      { q: "Gold ETFs?", a: "Digital gold investment." },
      { q: "Senior citizen?", a: "Higher interest rates." },
      { q: "Tax saving?", a: "FDs under 80C." },
      { q: "Liquidity?", a: "FDs can be broken." },
      { q: "Risk level?", a: "Low risk investments." },
      { q: "Returns?", a: "Guaranteed returns." }
    ]
  },

  {
    id: 18,
    title: "Cheque Book Management",
    description:
      "How to manage cheque books, safety tips, and common issues.",
    questions: [
      { q: "Cheque request?", a: "Apply online or at branch." },
      { q: "Safe storage?", a: "Keep in secure place." },
      { q: "Cheque validity?", a: "3 months from issue." },
      { q: "Stop payment?", a: "Can stop lost cheques." },
      { q: "Cheque bounce?", a: "Due to insufficient funds." },
      { q: "Signature?", a: "Must match account signature." },
      { q: "Amount in words?", a: "Write clearly." },
      { q: "Crossing cheque?", a: "For safety." },
      { q: "Endorsement?", a: "For transfer." },
      { q: "Lost cheque?", a: "Report immediately." }
    ]
  },

  {
    id: 19,
    title: "ATM Safety and Usage Tips",
    description:
      "Safety precautions and best practices for ATM usage.",
    questions: [
      { q: "Choose ATM?", a: "Well-lit, busy locations." },
      { q: "Card insertion?", a: "Insert chip side up." },
      { q: "PIN security?", a: "Don't share, cover keypad." },
      { q: "Transaction check?", a: "Verify amount." },
      { q: "Card skimming?", a: "Check for tampering." },
      { q: "Shoulder surfing?", a: "Be aware of surroundings." },
      { q: "Night usage?", a: "Avoid if possible." },
      { q: "Multiple cards?", a: "Use one at a time." },
      { q: "Receipt?", a: "Keep for records." },
      { q: "Emergency?", a: "Contact bank immediately." }
    ]
  },

  {
    id: 20,
    title: "Future of Banking: Fintech Innovations",
    description:
      "Emerging technologies shaping the future of banking in India.",
    questions: [
      { q: "Digital currencies?", a: "CBDC in development." },
      { q: "5G banking?", a: "Faster mobile banking." },
      { q: "AI assistants?", a: "Personalized banking." },
      { q: "Biometric payments?", a: "Fingerprint, face ID." },
      { q: "IoT integration?", a: "Smart devices." },
      { q: "Quantum computing?", a: "Enhanced security." },
      { q: "Regtech?", a: "Regulatory technology." },
      { q: "Open APIs?", a: "Third-party integrations." },
      { q: "Sustainable banking?", a: "Green finance." },
      { q: "Customer experience?", a: "Seamless digital journey." }
    ]
  }
];

export default blogs;
