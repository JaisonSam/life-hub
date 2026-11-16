export interface ScriptureDay {
  dayOfYear: number; // 1 - 366
  reference: string;
  text: string;
  translation: "NIV" | "ESV" | "NLT" | "KJV";
  theme: string;
  readingPlan: string;
  reflection: string;
  prayer: string;
}

export const SCRIPTURE_COLLECTION: Omit<ScriptureDay, "dayOfYear">[] = [
  {
    reference: "Proverbs 3:5-6",
    text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    translation: "NIV",
    theme: "Trust & Guidance",
    readingPlan: "Proverbs 3 & Romans 8",
    reflection: "Human analysis is valuable, but finite. When you anchor your decisions in humble trust in God, He orders your priorities and removes unseen friction.",
    prayer: "Lord, I give my schedule and ambitions to You today. Guide my decisions and straighten my path.",
  },
  {
    reference: "Philippians 4:6-7",
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    translation: "NIV",
    theme: "Peace of Mind",
    readingPlan: "Philippians 4 & Psalm 23",
    reflection: "Anxiety is an alarm bell reminding us to pray. Replace mental spirals with specific gratitude, and supernatural quiet will guard your focus.",
    prayer: "Heavenly Father, I trade my worries for Your peace. Guard my mind against distraction and stress.",
  },
  {
    reference: "Isaiah 40:31",
    text: "Those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    translation: "NIV",
    theme: "Resilience & Energy",
    readingPlan: "Isaiah 40 & Psalm 103",
    reflection: "Physical and intellectual endurance have limits; spiritual strength compounds through patient stillness and hope in God's promises.",
    prayer: "Lord, renew my strength today. When tiredness creeps in, remind me that You are my unending power source.",
  },
  {
    reference: "Joshua 1:9",
    text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.",
    translation: "NIV",
    theme: "Courage & Boldness",
    readingPlan: "Joshua 1 & Psalm 27",
    reflection: "Courage is not the absence of fear, but taking the next necessary step with full confidence that God walks ahead of you.",
    prayer: "God, grant me the courage to tackle difficult problems with confidence and conviction today.",
  },
  {
    reference: "Romans 8:28",
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    translation: "NIV",
    theme: "Purpose & Hope",
    readingPlan: "Romans 8 & Psalm 139",
    reflection: "Even delays, obstacles, and unexpected pivots are woven into God's sovereign developmental plan for your character and impact.",
    prayer: "Father, I trust that today's circumstances are shaping me for Your greater purpose. Amen.",
  },
  {
    reference: "Colossians 3:23-24",
    text: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters, since you know that you will receive an inheritance from the Lord as a reward.",
    translation: "NIV",
    theme: "Excellence at Work",
    readingPlan: "Colossians 3 & Proverbs 16",
    reflection: "Every spreadsheet, meeting, line of code, and communication is an act of spiritual worship when executed with uncompromising diligence and integrity.",
    prayer: "Lord, may my work today reflect Your craftsmanship, patience, and honor.",
  },
  {
    reference: "Proverbs 16:3",
    text: "Commit to the LORD whatever you do, and he will establish your plans.",
    translation: "NIV",
    theme: "Strategic Execution",
    readingPlan: "Proverbs 16 & James 4",
    reflection: "Committing work to God means dedicating the motives, the ethics, and the outcome to His glory. When intentions align with His will, momentum follows.",
    prayer: "Lord, I dedicate all my plans, career milestones, and studies to You. Establish my steps.",
  },
  {
    reference: "Matthew 6:33",
    text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.",
    translation: "NIV",
    theme: "First Priorities",
    readingPlan: "Matthew 6 & Psalm 37",
    reflection: "When you put spiritual devotion, character, and love at the top of your hierarchy, secondary concerns fall effortlessly into their rightful place.",
    prayer: "Lord, align my desires so that seeking Your truth and kingdom is always my primary compass.",
  },
  {
    reference: "2 Timothy 1:7",
    text: "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.",
    translation: "NIV",
    theme: "Self-Discipline",
    readingPlan: "2 Timothy 1 & Titus 2",
    reflection: "You are not designed for passivity or doubt. God has wired your spirit for decisive power, genuine empathy, and rigorous self-mastery.",
    prayer: "Holy Spirit, fill me with discipline, focus, and love as I approach today's challenges.",
  },
  {
    reference: "Psalm 46:10",
    text: "Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.",
    translation: "NIV",
    theme: "Stillness & Solitude",
    readingPlan: "Psalm 46 & Mark 1:35-39",
    reflection: "In a hyperactive, noisy world, stillness is a superpower. Silence before God recalibrates perspective and melts away artificial urgency.",
    prayer: "Lord, teach my soul to be still and recognize Your presence throughout this day.",
  },
  {
    reference: "Galatians 6:9",
    text: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.",
    translation: "NIV",
    theme: "Perseverance & Compounding",
    readingPlan: "Galatians 6 & Psalm 126",
    reflection: "Spiritual and worldly growth obey the law of the harvest. Quiet daily compounding produces exponential breakthroughs in due time.",
    prayer: "Father, protect me from discouragement. Give me grit to continue faithful daily execution.",
  },
  {
    reference: "James 1:5",
    text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
    translation: "NIV",
    theme: "Divine Wisdom",
    readingPlan: "James 1 & 1 Kings 3",
    reflection: "Knowledge comes from studying data, but wisdom comes from God. Before complex negotiations or architectural decisions, ask for divine clarity.",
    prayer: "Generous Father, grant me wisdom beyond my experience for every decision I make today.",
  },
  {
    reference: "Psalm 119:105",
    text: "Your word is a lamp for my feet, a light on my path.",
    translation: "NIV",
    theme: "Clarity & Truth",
    readingPlan: "Psalm 119:97-120 & John 1",
    reflection: "A lamp doesn't illuminate miles ahead; it shines light on the next faithful step. Trust God for the immediate step, and the road will unfold.",
    prayer: "Lord, let Your Word guide my steps today, illuminating truth in every interaction.",
  },
  {
    reference: "Romans 12:2",
    text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God’s will is—his good, pleasing and perfect will.",
    translation: "NIV",
    theme: "Mental Renewal",
    readingPlan: "Romans 12 & Ephesians 4",
    reflection: "Your mind is your executive cockpit. Guard what enters your senses, immerse your thoughts in eternal truths, and your decisions will achieve exceptional clarity.",
    prayer: "Lord, renew my mind today. Keep me free from cynicism, vanity, and shallow distraction.",
  },
  {
    reference: "Jeremiah 29:11",
    text: "For I know the plans I have for you,” declares the LORD, “plans to prosper you and not to harm you, plans to give you hope and a future.",
    translation: "NIV",
    theme: "God's Providence",
    readingPlan: "Jeremiah 29 & Psalm 138",
    reflection: "You do not walk blindly into the future. The Architect of the universe has already mapped out a trajectory marked by redemption, growth, and hope.",
    prayer: "Heavenly Father, I rest in the assurance of Your good plans for my life, family, and vocation.",
  },
  {
    reference: "Psalm 37:4-5",
    text: "Take delight in the LORD, and he will give you the desires of your heart. Commit your way to the LORD; trust in him and he will do this.",
    translation: "NIV",
    theme: "Delight & Alignment",
    readingPlan: "Psalm 37:1-11 & Matthew 5:1-12",
    reflection: "When you delight in God's character, your desires naturally synchronize with His will. What you pray for aligns with what He intends to build.",
    prayer: "Lord, shape my deepest desires so they reflect Your heartbeat and righteousness.",
  },
  {
    reference: "Ephesians 3:20-21",
    text: "Now to him who is able to do immeasurably more than all we ask or imagine, according to his power that is at work within us, to him be glory in the church and in Christ Jesus throughout all generations, for ever and ever! Amen.",
    translation: "NIV",
    theme: "Immeasurable Grace",
    readingPlan: "Ephesians 3 & Isaiah 55",
    reflection: "Never cap God's capacity with your current circumstances. His capability infinitely exceeds our most ambitious spreadsheets and visions.",
    prayer: "Lord, expand my faith to expect Your extraordinary work in and through my daily life.",
  },
  {
    reference: "Micah 6:8",
    text: "He has shown you, O mortal, what is good. And what does the LORD require of you? To act justly and to love mercy and to walk humbly with your God.",
    translation: "NIV",
    theme: "Justice & Humility",
    readingPlan: "Micah 6 & Amos 5",
    reflection: "True greatness is surprisingly simple: treat others with uncompromising fairness, show relentless compassion, and walk in quiet humility before God.",
    prayer: "Lord, keep me humble in success and merciful to others in all circumstances.",
  },
  {
    reference: "Proverbs 4:23",
    text: "Above all else, guard your heart, for everything you do flows from it.",
    translation: "NIV",
    theme: "Emotional & Spiritual Guardrails",
    readingPlan: "Proverbs 4 & Luke 6:43-45",
    reflection: "Your inner state dictates your external outputs. If your heart is full of gratitude and peace, your leadership and speech will produce life.",
    prayer: "Father, put a guard over my heart today against bitterness, comparison, and impatience.",
  },
  {
    reference: "Hebrews 11:1",
    text: "Now faith is confidence in what we hope for and assurance about what we do not see.",
    translation: "NIV",
    theme: "Faith & Vision",
    readingPlan: "Hebrews 11 & Genesis 15",
    reflection: "Faith is not wishful thinking; it is operating on God's character as an established fact before the physical evidence catches up.",
    prayer: "Lord, deepen my faith so I can execute with bold certainty in Your sovereign promises.",
  },
  {
    reference: "Lamentations 3:22-23",
    text: "Because of the LORD’s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.",
    translation: "NIV",
    theme: "Fresh Grace Everyday",
    readingPlan: "Lamentations 3 & Psalm 30",
    reflection: "Every sunrise brings a complete clean slate. Yesterday's shortcomings and fatigue have expired; God's mercies have just been refilled for you.",
    prayer: "Thank You, Lord, for new mercies today. I step into this day forgiven, refreshed, and empowered.",
  },
  {
    reference: "Psalm 90:12",
    text: "Teach us to number our days, that we may gain a heart of wisdom.",
    translation: "NIV",
    theme: "Time Stewardship",
    readingPlan: "Psalm 90 & Ephesians 5:15-20",
    reflection: "Time is our most non-renewable asset. Recognizing the briefness of life infuses today's hours with urgent, joyful stewardship.",
    prayer: "Lord, teach me to number my hours and minutes today, investing them in what truly matters.",
  },
  {
    reference: "1 Corinthians 10:31",
    text: "So whether you eat or drink or whatever you do, do it all for the glory of God.",
    translation: "NIV",
    theme: "Sacred Everyday",
    readingPlan: "1 Corinthians 10 & Psalm 115",
    reflection: "There is no divide between the sacred and the secular. When done with love and excellence, everyday tasks become holy offerings.",
    prayer: "Lord, receive everything I do today—from meetings to physical training—as worship to You.",
  },
  {
    reference: "John 15:5",
    text: "I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.",
    translation: "NIV",
    theme: "Abiding in Christ",
    readingPlan: "John 15 & Galatians 5:16-26",
    reflection: "Branches do not strain to produce fruit; they stay connected to the vine and fruit happens organically. Stay intimately connected to Christ.",
    prayer: "Jesus, I abide in You today. Flow Your wisdom, love, and energy through me.",
  },
  {
    reference: "Psalm 1:1-3",
    text: "Blessed is the one who does not walk in step with the wicked... but whose delight is in the law of the LORD... That person is like a tree planted by streams of water, which yields its fruit in season and whose leaf does not wither.",
    translation: "NIV",
    theme: "Rooted & Fruitful",
    readingPlan: "Psalm 1 & Jeremiah 17:7-8",
    reflection: "Like a deep-rooted tree in fertile soil, a person immersed in God's wisdom survives droughts, storms, and seasons without losing vitality.",
    prayer: "Lord, sink my roots deep into Your truth so I remain steadfast regardless of external volatility.",
  },
  {
    reference: "Matthew 11:28-30",
    text: "Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls.",
    translation: "NIV",
    theme: "Soul Rest & Recovery",
    readingPlan: "Matthew 11 & Hebrews 4",
    reflection: "True rest is not merely sleep; it is unburdening your soul from the crushing pressure to prove yourself. Walk at Christ's unhurried pace.",
    prayer: "Jesus, I take Your gentle yoke today. Relieve my inner burdens and grant deep rest to my soul.",
  },
  {
    reference: "Psalm 23:1-3",
    text: "The LORD is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
    translation: "NIV",
    theme: "Divine Provision",
    readingPlan: "Psalm 23 & John 10:1-18",
    reflection: "Because God is your Shepherd, you are never without what you truly need. He knows where to lead you for restoration and safety.",
    prayer: "Good Shepherd, lead me today into spaces of clarity, peace, and spiritual refreshment.",
  },
  {
    reference: "Colossians 3:12-14",
    text: "Therefore, as God’s chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience. Bear with each other and forgive one another... And over all these virtues put on love.",
    translation: "NIV",
    theme: "Compassion & Empathy",
    readingPlan: "Colossians 3 & 1 Corinthians 13",
    reflection: "Before you step into complex corporate discussions or family moments, consciously clothe yourself with patience and grace.",
    prayer: "Lord, clothe my heart with gentleness and patience toward every person I cross paths with today.",
  },
  {
    reference: "1 Thessalonians 5:16-18",
    text: "Rejoice always, pray continually, give thanks in all circumstances; for this is God’s will for you in Christ Jesus.",
    translation: "NIV",
    theme: "Unceasing Gratitude",
    readingPlan: "1 Thessalonians 5 & Psalm 100",
    reflection: "Gratitude is an executive state of mind. It changes your brain chemistry, defuses stress, and opens your eyes to God's constant activity.",
    prayer: "Lord, fill my mouth with thanksgiving today, even when things do not go as planned.",
  },
  {
    reference: "Ecclesiastes 3:1",
    text: "There is a time for everything, and a season for every activity under the heavens.",
    translation: "NIV",
    theme: "Seasons & Timing",
    readingPlan: "Ecclesiastes 3 & Psalm 104",
    reflection: "Do not demand harvest in a season of planting, nor planting in a season of rest. Discern and embrace the specific season God has placed you in.",
    prayer: "Lord, give me discernment to honor the season I am in with patience and purpose.",
  },
  {
    reference: "Revelation 21:4-5",
    text: "He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away. He who was seated on the throne said, 'I am making everything new!'",
    translation: "NIV",
    theme: "Eternal Hope & Renewal",
    readingPlan: "Revelation 21 & Isaiah 65:17-25",
    reflection: "Our story ends in complete restoration, renewal, and celebration. Let the certainty of this eternal dawn infuse your present work with joy.",
    prayer: "Lord Jesus, I anchor my hope in Your eternal renewal. You are making all things new.",
  },
];

/**
 * Calculates the 1-based day of year for a given date
 */
export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Returns the deterministic ScriptureDay for the given date.
 * Rotates through the collection deterministically by day-of-year.
 */
export function getDailyScripture(date: Date = new Date(), offsetDays: number = 0): ScriptureDay {
  const targetDate = new Date(date);
  if (offsetDays !== 0) {
    targetDate.setDate(targetDate.getDate() + offsetDays);
  }
  const doy = getDayOfYear(targetDate);
  const index = (doy - 1 + SCRIPTURE_COLLECTION.length) % SCRIPTURE_COLLECTION.length;
  const item = SCRIPTURE_COLLECTION[index];

  return {
    ...item,
    dayOfYear: doy,
  };
}
