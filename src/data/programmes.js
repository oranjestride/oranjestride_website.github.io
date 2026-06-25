/**
 * Training streams — rendered as a tabbed section.
 * Each stream has groups; each group has an optional subhead and a card grid.
 * A card may carry: badge, title, desc, tags[], meta[{v,k}], list[], certificate.
 */
export const programmeStreams = [
  {
    id: 'corporate',
    tab: 'Corporate & Leadership',
    icon: 'building',
    intro:
      'Your team doesn’t need to become data scientists — they need to use data to make better calls. We run practical, sector-specific programmes for managers and functional teams, and strategic AI-fluency sessions for the leaders making the big decisions.',
    groups: [
      {
        subhead: 'For Managers & Functional Teams — Sector-Specific',
        layout: 'three',
        cards: [
          {
            badge: 'High Demand',
            title: 'Banking & Financial Services',
            desc: 'Move BFSI teams from instinct to insight — ML for credit risk, fraud detection, customer segmentation, and forecasting on real datasets.',
            tags: ['Credit Risk', 'Fraud ML', 'Forecasting', 'Gen AI'],
            meta: [{ v: 'Half-day to 5-day', k: 'Duration' }, { v: 'On-site / Virtual', k: 'Mode' }],
          },
          {
            title: 'Healthcare & Pharma',
            desc: 'Help clinical and administrative teams make sense of patient data, spot inefficiencies early, and understand how AI is reshaping diagnostics and operations.',
            tags: ['Patient Analytics', 'Ops ML', 'AI Strategy'],
            meta: [{ v: 'Half-day to 5-day', k: 'Duration' }, { v: 'On-site / Virtual', k: 'Mode' }],
          },
          {
            title: 'Insurance',
            desc: 'From underwriting to claims — build smarter risk models, predict churn before it happens, and price policies with confidence, using real insurance scenarios.',
            tags: ['Claims AI', 'Churn Models', 'Risk Pricing'],
            meta: [{ v: 'Half-day to 5-day', k: 'Duration' }, { v: 'On-site / Virtual', k: 'Mode' }],
          },
          {
            title: 'FMCG & Retail',
            desc: 'Apply AI to the decisions that move margins — demand forecasting, customer lifetime value, supply-chain optimisation, and basket analysis.',
            tags: ['Demand Forecast', 'CLV', 'Supply Chain AI'],
            meta: [{ v: 'Half-day to 5-day', k: 'Duration' }, { v: 'On-site / Virtual', k: 'Mode' }],
          },
          {
            title: 'Government & Public Sector',
            desc: 'Build practical AI literacy and dashboard capability with senior bureaucrats and policy teams — focused executive workshops, evidence over experience.',
            tags: ['Policy Analytics', 'BI Dashboards', 'AI Fluency'],
            meta: [{ v: 'Half-day to 5-day', k: 'Duration' }, { v: 'On-site / Virtual', k: 'Mode' }],
          },
          {
            title: 'Media, Tech & Telecom',
            desc: 'Harness AI for audience intelligence, content recommendation, and workflow automation — practical skills for the teams driving your digital agenda.',
            tags: ['Gen AI', 'Audience AI', 'NLP', 'Automation'],
            meta: [{ v: 'Half-day to 5-day', k: 'Duration' }, { v: 'On-site / Virtual', k: 'Mode' }],
          },
        ],
      },
      {
        subhead: 'For C-Suite & Senior Leaders — Strategic AI',
        layout: 'two',
        cards: [
          {
            badge: 'Flagship',
            title: 'AI for Leaders — Strategic Fluency',
            desc: 'A clear-eyed view of what Generative AI and ML actually do, where they create leverage, how to evaluate vendors, and how to build a culture that makes AI stick — no code required.',
            tags: ['Gen AI Strategy', 'AI ROI', 'Change Management', 'Vendor Evaluation'],
            meta: [{ v: 'Half-day to 2-day', k: 'Duration' }, { v: 'C-Suite / Board', k: 'Level' }],
          },
          {
            title: 'AI Adoption Roadmap Workshop',
            desc: 'A working session: leave with a concrete, prioritised AI adoption plan — where to start, build vs. buy, governance and ethics, and a board-ready strategy document.',
            tags: ['Roadmap Design', 'Build vs Buy', 'AI Governance', 'Impact KPIs'],
            meta: [{ v: '1-day to 2-day', k: 'Duration' }, { v: 'Leadership Team', k: 'Level' }],
          },
          {
            title: 'Executive Analytics for Decision-Makers',
            desc: 'Give directors and VPs the tools to interpret dashboards critically, challenge analytical assumptions, and make smarter calls when the data points a certain way.',
            tags: ['Data Interpretation', 'BI Dashboards', 'KPI Design', 'Model Literacy'],
            meta: [{ v: 'Half-day to 2-day', k: 'Duration' }, { v: 'Directors / VPs', k: 'Level' }],
          },
          {
            title: 'Strategic Innovation with AI',
            desc: 'Use AI-driven intelligence to inform the big moves — spotting market shifts before competitors, identifying white spaces, and making strategic bets earlier.',
            tags: ['AI Market Intel', 'Competitive AI', 'Opportunity Mapping', 'Strategy Design'],
            meta: [{ v: '1-day to 2-day', k: 'Duration' }, { v: 'Senior Leadership', k: 'Level' }],
          },
        ],
      },
    ],
  },
  {
    id: 'university',
    tab: 'University & Campus',
    icon: 'campus',
    intro:
      'Most students graduate with theory but freeze on a real dataset. We fix that — programmes co-delivered with universities and taught by practitioners. Every student leaves with applicable skills, a portfolio project, and a certificate that carries genuine institutional weight.',
    groups: [
      {
        layout: 'two',
        cards: [
          {
            badge: 'Undergraduate Track',
            title: 'Data Analytics for Undergraduates',
            desc: 'BBA · B.Com · B.Sc · B.Tech · Any Stream',
            list: [
              'Excel from basics to advanced — every analyst’s first tool',
              'MySQL & databases — how data is stored and queried',
              'Tableau & Power BI — dashboards that tell a story',
              'Python for data — handling, cleaning, visualising',
              'Business statistics — the thinking behind every insight',
              'Capstone: a live business case from your own sector',
            ],
            certificate: 'Certificate jointly signed by OranjeStride & a university of repute in India.',
          },
          {
            badge: 'Postgraduate / MBA Track',
            title: 'Business Analytics & ML for Managers',
            desc: 'MBA · M.Com · M.Sc · PGDM · Any PG Programme',
            list: [
              'Python for business analytics — pandas, numpy, seaborn',
              'Regression models for finance and strategy',
              'ML in action — Random Forest, clustering, forecasting',
              'Credit risk, churn, and revenue modelling on real data',
              'Tableau & Power BI — reporting that makes a case',
              'Capstone: a sector-mapped ML project for interviews',
            ],
            certificate: 'Certificate jointly signed by OranjeStride & a university of repute in India.',
          },
        ],
      },
      {
        subhead: 'Flagship Campus Programmes',
        layout: 'two',
        cards: [
          {
            badge: 'Flagship',
            title: 'Business Analytics with Python',
            desc: 'The full analytics journey — wrangling messy data, building intuition through EDA, running regression and classification models, and forecasting. Every concept tied to a real business scenario.',
            tags: ['pandas / numpy', 'Regression', 'Random Forest', 'K-Means', 'ARIMA', 'ROC-AUC'],
            meta: [{ v: 'Instructor-Led', k: 'Format' }, { v: 'PG / MBA', k: 'Level' }, { v: 'Blended', k: 'Mode' }],
          },
          {
            title: 'Generative AI & Agentic AI Bootcamp',
            desc: 'Get students ready for AI-first workplaces by building things — how LLMs work, RAG pipelines, prompt engineering, and deploying AI agents.',
            tags: ['LLMs', 'RAG', 'Agents', 'Prompt Eng.', 'MCP', 'Deployment'],
            meta: [{ v: 'Live + Hands-On', k: 'Format' }, { v: 'UG / PG', k: 'Level' }, { v: 'Online / Offline', k: 'Mode' }],
          },
        ],
      },
    ],
  },
];
