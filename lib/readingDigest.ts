export interface StrategicRecommendation {
  id: string;
  source: string;
  sourceUrl: string;
  sourceBadgeColor: string;
  title: string;
  author: string;
  readTime: string;
  category: "Systems & Models" | "Strategy & Tech" | "Finance & Capital" | "Execution";
  mentalModel: string;
  keyInsight: string;
  url: string;
}

export interface AeonEssay {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  readTime: string;
  category: "Philosophy of Mind" | "Systems & Nature" | "Time & Epistemology" | "Society & Ethics";
  coreQuestion: string;
  keyExcerpt: string;
  url: string;
}

export const dailyStrategicRecommendations: StrategicRecommendation[] = [
  {
    id: "fs-second-order",
    source: "Farnam Street",
    sourceUrl: "https://fs.blog",
    sourceBadgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    title: "Second-Order Thinking: What Comes Next?",
    author: "Shane Parrish",
    readTime: "7 min read",
    category: "Systems & Models",
    mentalModel: "Second & Third-Order Consequence Mapping",
    keyInsight:
      "First-order thinking is fast and easy. Second-order thinking is deliberate and hard. It asks: 'And then what?' Almost all high-leverage strategic advantage lies in bearing short-term friction for non-linear long-term compounding.",
    url: "https://fs.blog/second-order-thinking/",
  },
  {
    id: "pg-great-work",
    source: "Paul Graham",
    sourceUrl: "https://paulgraham.com",
    sourceBadgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    title: "How to Do Great Work",
    author: "Paul Graham",
    readTime: "18 min read",
    category: "Execution",
    mentalModel: "Compounding Curiosity & Non-Consensus Depth",
    keyInsight:
      "If you want to do great work, look for things that seem interesting to you and boring to others. That is the hallmark of a comparative advantage where compounding operates without fierce zero-sum competition.",
    url: "https://paulgraham.com/greatwork.html",
  },
  {
    id: "stratechery-aggregation",
    source: "Stratechery",
    sourceUrl: "https://stratechery.com",
    sourceBadgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    title: "Aggregation Theory & Technology Moats",
    author: "Ben Thompson",
    readTime: "12 min read",
    category: "Strategy & Tech",
    mentalModel: "Zero-Marginal Cost Value Chains & Chokepoint Dynamics",
    keyInsight:
      "The value chain has inverted: the entities that win are not those that control physical manufacturing or distribution, but those that aggregate demand through superior, frictionless user experience.",
    url: "https://stratechery.com/aggregation-theory/",
  },
  {
    id: "collabfund-psychology-money",
    source: "Collaborative Fund",
    sourceUrl: "https://collabfund.com",
    sourceBadgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    title: "The Psychology of Money & The Art of Patience",
    author: "Morgan Housel",
    readTime: "10 min read",
    category: "Finance & Capital",
    mentalModel: "Compounding Asymmetry & Room for Error",
    keyInsight:
      "The most important part of every plan is planning on your plan not going according to plan. Compounding only works if you give an asset years to compound without interrupting it unnecessarily during downturns.",
    url: "https://collabfund.com/blog/the-psychology-of-money/",
  },
  {
    id: "julian-mental-models",
    source: "Julian Shapiro",
    sourceUrl: "https://julian.com",
    sourceBadgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    title: "Mental Models: How High Performers Think in Bottlenecks",
    author: "Julian Shapiro",
    readTime: "11 min read",
    category: "Systems & Models",
    mentalModel: "Theory of Constraints & Bottleneck Prioritization",
    keyInsight:
      "In any multi-stage pipeline, optimizing any step that is NOT the current bottleneck produces exactly zero increase in net system throughput. Relentlessly identify the limiting step before spending energy.",
    url: "https://www.julian.com/guide/growth/mental-models",
  },
  {
    id: "firstround-leverage",
    source: "First Round Review",
    sourceUrl: "https://review.firstround.com",
    sourceBadgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    title: "The Three Levels of Managerial Leverage",
    author: "Camille Fournier",
    readTime: "14 min read",
    category: "Execution",
    mentalModel: "Multiplier Architecture & Operational Runbooks",
    keyInsight:
      "True managerial leverage is not logging 80 hours a week. It is designing automated data pipelines, decision rubrics, and living documentation that enable entire teams to execute with high fidelity autonomously.",
    url: "https://review.firstround.com/the-three-levels-of-managerial-leverage/",
  },
  {
    id: "ribbonfarm-tempo",
    source: "Ribbonfarm",
    sourceUrl: "https://ribbonfarm.com",
    sourceBadgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    title: "Tempo: Narrative Timing & Operational Decisions",
    author: "Venkatesh Rao",
    readTime: "15 min read",
    category: "Strategy & Tech",
    mentalModel: "Operational OODA Loops & Strategic Tempo",
    keyInsight:
      "Strategy is rarely a rigid checklist; strategy is a tempo. The operator who maintains a rhythmic decision cadence and adapts inside the environment's feedback delay dictates the trajectory of the market.",
    url: "https://ribbonfarm.com/2011/04/14/tempo-a-decision-making-framework/",
  },
];

export const dailyAeonEssays: AeonEssay[] = [
  {
    id: "aeon-extended-mind",
    title: "The Mind Beyond the Skull: Why Tools Literally Constitute Human Thinking",
    author: "Michael Wheeler",
    authorRole: "Professor of Philosophy, University of Stirling",
    readTime: "14 min read",
    category: "Philosophy of Mind",
    coreQuestion:
      "Is human thinking confined inside the cranium, or do our notebooks, digital tools, and physical systems physically constitute our mind?",
    keyExcerpt:
      "When external artifacts such as commonplace notebooks, software architectures, and e-readers are coupled with the biological brain in a reliable, continuous loop, they do not merely assist thinking—they become active constitutive components of the cognitive system itself.",
    url: "https://aeon.co/essays/how-tools-and-environment-shape-human-thought",
  },
  {
    id: "aeon-theseus",
    title: "The Ship of Theseus and the Illusion of Fixed Identity",
    author: "Rebecca Roache",
    authorRole: "Senior Lecturer in Philosophy, Royal Holloway University of London",
    readTime: "11 min read",
    category: "Systems & Nature",
    coreQuestion:
      "If an enterprise, a farm, or a human replaces every single constituent cell or employee over time, where does its identity truly reside?",
    keyExcerpt:
      "Identity is not an immutable static substance; identity is an ongoing computational process of dynamic continuity. A complex system survives not through its static matter, but through the enduring coherence of its information feedback loops.",
    url: "https://aeon.co/essays/identity-is-not-what-it-seems-when-parts-are-replaced",
  },
  {
    id: "aeon-stoicism-cybernetics",
    title: "The Inner Fortress: Why Stoic Control is Modern Cognitive Cybernetics",
    author: "Massimo Pigliucci",
    authorRole: "K.D. Irani Professor of Philosophy, City College of New York",
    readTime: "12 min read",
    category: "Philosophy of Mind",
    coreQuestion:
      "How does radical acceptance of external randomness unlock supreme internal execution velocity?",
    keyExcerpt:
      "The dichotomy of control is the fundamental algorithm of human sanity: divide all things strictly into what is up to you (beliefs, impulses, desires) and what is not (market prices, weather, others' choices). Invest 100% of your emotional energy strictly into the former.",
    url: "https://aeon.co/essays/why-stoicism-is-one-of-the-best-mind-hacks-for-modern-life",
  },
  {
    id: "aeon-good-ancestor",
    title: "The Good Ancestor: How to Break the Tyranny of the Immediate",
    author: "Roman Krznaric",
    authorRole: "Philosopher & Senior Research Fellow, Oxford University",
    readTime: "16 min read",
    category: "Time & Epistemology",
    coreQuestion:
      "Why are human brains biologically biased toward short-term gratification, and how do we build multi-decade compounding horizons?",
    keyExcerpt:
      "We live in an era of pathological presentism. To plant perennial orchards or build enduring intellectual systems requires 'cathedral thinking'—the cognitive capacity to lay foundation stones for structures whose full canopy you may never personally stand under.",
    url: "https://aeon.co/essays/why-humanity-needs-to-reclaim-long-term-thinking",
  },
  {
    id: "aeon-what-is-life",
    title: "What is Life? Why Biology Defies Simple Thermodynamic Reductions",
    author: "Philip Ball",
    authorRole: "Science Writer & Former Physical Sciences Editor at Nature",
    readTime: "15 min read",
    category: "Systems & Nature",
    coreQuestion:
      "How do self-organizing organic ecosystems resist entropy and maintain homeostatic order without a central commander?",
    keyExcerpt:
      "Living systems do not operate like mechanical clockwork. They are agency-driven distributed networks that continuously harvest energy from their environment to maintain dynamic non-equilibrium order, resilience, and reciprocal adaptation.",
    url: "https://aeon.co/essays/what-is-life-the-answer-is-getting-curiouser-and-curiouser",
  },
  {
    id: "aeon-slow-reading",
    title: "The Rebel Act of Slow Reading in an Accelerated World",
    author: "Tom Chatfield",
    authorRole: "Philosopher of Technology & Author",
    readTime: "13 min read",
    category: "Philosophy of Mind",
    coreQuestion:
      "In an era of infinite algorithmic dopamine feeds, why is sustained solitary book reading the ultimate act of cognitive sovereignty?",
    keyExcerpt:
      "Deep reading is not merely information ingestion. It is an intentional neurological gymnasium where the brain holds complex, multi-threaded ideas in working memory long enough to synthesize wholly original mental models.",
    url: "https://aeon.co/essays/why-slow-reading-is-essential-in-the-age-of-digital-distraction",
  },
  {
    id: "aeon-willpower-environment",
    title: "The Architecture of Willpower: Why Environment Always Beats Discipline",
    author: "Neil Levy",
    authorRole: "Professor of Philosophy, Macquarie University",
    readTime: "10 min read",
    category: "Philosophy of Mind",
    coreQuestion:
      "Is willpower a heroic moral muscle or simply the downstream output of intentional environment design?",
    keyExcerpt:
      "People who appear to possess extraordinary self-discipline rarely exert constant heroic effort. Instead, they engineer low-friction environments where the desired virtuous action is the default path of least physical resistance.",
    url: "https://aeon.co/essays/willpower-is-not-what-keeps-you-on-track-it-s-your-environment",
  },
];

export function getDayOfYearIndex(totalItems: number, offset = 0): number {
  if (typeof window === "undefined") return 0;
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return (dayOfYear + offset) % totalItems;
}
