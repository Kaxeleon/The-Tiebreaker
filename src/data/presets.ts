export interface DecisionPreset {
  id: string;
  category: string;
  title: string;
  description: string;
  options: string[];
  priorities: string[];
  urgency: string;
  riskTolerance: 'Low' | 'Moderate' | 'High';
}

export const PRESET_DECISIONS: DecisionPreset[] = [
  {
    id: 'career-startup-vs-corporate',
    category: 'Career & Life',
    title: 'Accept Series-B Startup Lead Offer vs Stay at Big Tech with Promotion Track',
    description: 'Offered a Head of Engineering role at a 40-person startup with 0.8% equity and $190k base. Currently a Senior Engineer at Big Tech earning $260k total comp with 401k match, predictable 40-hour weeks, and a promotion review in 6 months.',
    options: ['Accept Startup Head of Eng Role', 'Stay at Big Tech for Promotion', 'Counter-offer Big Tech with Startup Offer'],
    priorities: ['Long-term Wealth & Equity', 'Work-Life Balance', 'Accelerated Leadership Growth', 'Current Job Security'],
    urgency: 'Offer expires in 5 days',
    riskTolerance: 'Moderate',
  },
  {
    id: 'buy-home-vs-rent-invest',
    category: 'Finance & Real Estate',
    title: 'Buy a $650,000 Suburban Home Now vs Continue Renting and Investing in S&P 500',
    description: 'We have $130,000 in liquid savings. Mortgage interest rates are around 6.5%. Rent for our 2-bedroom downtown apartment is $2,800/mo. Buying will push monthly out-of-pocket costs to $4,300 including taxes and maintenance, but locks in housing and gives us a yard.',
    options: ['Buy the $650k Home with 20% Down', 'Rent Downtown & Invest Surplus into Index Funds', 'Look for a 2-4 Unit Multi-family House Hack'],
    priorities: ['Net Worth Growth over 10 Years', 'Lifestyle Flexibility & Commute', 'Emotional Peace of Mind', 'Liquidity for Emergencies'],
    urgency: 'Next 3 months before lease renewal',
    riskTolerance: 'Moderate',
  },
  {
    id: 'relocate-europe-vs-stay',
    category: 'Personal & Adventure',
    title: 'Relocate to Amsterdam for a 2-Year International Transfer vs Remain in Hometown',
    description: 'Employer approved an intra-company transfer to Amsterdam with visa sponsorship and a 15% local cost adjustment. Moving means leaving close family, elderly parents, and established friend networks, but offers European travel, new cultural immersion, and life perspective.',
    options: ['Relocate to Amsterdam on 2-Year Term', 'Decline Transfer & Stay in Current City', 'Propose a 3-Month Trial Work-Remote Sabbatical'],
    priorities: ['Life Adventure & Perspective', 'Proximity to Family & Aging Parents', 'Career Story & Differentiation', 'Mental Health & Comfort'],
    urgency: 'Need to accept or decline within 2 weeks',
    riskTolerance: 'High',
  },
  {
    id: 'bootstrap-vs-venture-capital',
    category: 'Business & Entrepreneurship',
    title: 'Bootstrap Our B2B AI Tool with Organic Profits vs Raise a $1.5M Seed Round',
    description: 'Product currently generates $18,000 Monthly Recurring Revenue with 85% gross margins and 2 co-founders. Two reputable venture funds offered a $1.5M term sheet at a $7M post-money valuation to hire 3 engineers and scale paid acquisition quickly.',
    options: ['Remain Bootstrapped & Self-Sustaining', 'Accept $1.5M Venture Capital Seed Round', 'Raise a Smaller $350k Angel Safe Round'],
    priorities: ['Preserving 100% Founder Autonomy', 'Market Speed & Competitor Defense', 'Downside Failure Protection', 'Company Longevity'],
    urgency: 'Term sheet expires at month end',
    riskTolerance: 'High',
  }
];
