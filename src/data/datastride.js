/**
 * DataStride — OranjeStride's interactive SQL learning product.
 * Promoted via a dedicated section + a first-visit popup.
 */
export const datastride = {
  pill: 'New from OranjeStride',
  name: 'DataStride',
  tagline: 'Interactive SQL Learning Platform',
  url: 'https://data-stride.vercel.app/',
  description:
    'Master SQL from the ground up in a fully browser-based, hands-on environment. DataStride is OranjeStride’s dedicated platform for building real query-writing fluency — no installation, no setup. Write live SQL, solve business-scenario challenges, and progress from SELECT basics to advanced window functions and joins, all in one place.',
  features: [
    {
      icon: 'bolt',
      title: 'Live SQL Editor',
      desc: 'Write and run real SQL queries directly in your browser with instant feedback.',
    },
    {
      icon: 'book',
      title: 'Structured Curriculum',
      desc: 'From SELECT & WHERE to JOINs, subqueries, aggregations, and window functions.',
    },
    {
      icon: 'target',
      title: 'Business Challenges',
      desc: 'Real-world datasets drawn from finance, retail, and HR to build job-ready skills.',
    },
  ],
  // Sample query shown in the section's product mock.
  sample: {
    query: [
      'SELECT region,',
      '       ROUND(SUM(revenue), 0) AS total',
      'FROM   sales',
      'WHERE  quarter = \'Q4\'',
      'GROUP  BY region',
      'ORDER  BY total DESC;',
    ],
    columns: ['region', 'total'],
    rows: [
      ['North', '1,284,000'],
      ['West', '961,500'],
      ['South', '744,200'],
    ],
  },
};
