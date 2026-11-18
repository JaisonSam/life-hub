export interface CuratedAlbum {
  id: string;
  title: string;
  artist: string;
  category: "worship" | "focus" | "energy";
  tag: string;
  trackCount: number;
  coverUrl: string;
  ytUrl: string;
  moodDescription: string;
  bpmOrVibe: string;
}

export const CURATED_ALBUMS: CuratedAlbum[] = [
  // Worship & Sanctuary
  {
    id: "w-1",
    title: "Acoustic Worship & Intimate Prayer",
    artist: "Maverick City Music, Elevation, Bethel",
    category: "worship",
    tag: "Devotional Sanctuary",
    trackCount: 38,
    coverUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80",
    ytUrl: "https://music.youtube.com/search?q=acoustic+worship+intimate+prayer+elevation+maverick+city",
    moodDescription: "Deep acoustic strings, peaceful worship, and prayerful surrender.",
    bpmOrVibe: "Acoustic & Piano",
  },
  {
    id: "w-2",
    title: "Instrumental Peace: Romans Companion",
    artist: "Peaceful Piano & Ambient Cello Hymns",
    category: "worship",
    tag: "Scripture Study",
    trackCount: 24,
    coverUrl: "https://images.unsplash.com/photo-1520523839898-507127053c37?auto=format&fit=crop&w=600&q=80",
    ytUrl: "https://music.youtube.com/search?q=peaceful+christian+instrumental+piano+hymns",
    moodDescription: "Calm instrumental hymnody calibrated for morning reading in Book of Romans.",
    bpmOrVibe: "60 BPM Calm",
  },
  {
    id: "w-3",
    title: "Live Kingdom Anthems & Praise",
    artist: "Brandon Lake, Phil Wickham, Chris Tomlin",
    category: "worship",
    tag: "Faith Anthems",
    trackCount: 42,
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    ytUrl: "https://music.youtube.com/search?q=brandon+lake+phil+wickham+live+worship+anthems",
    moodDescription: "Bold, soaring declarations of victory and sovereign faith.",
    bpmOrVibe: "High Inspiration",
  },

  // Focus & GMAT Sprint
  {
    id: "f-1",
    title: "GMAT 715+ Quant Flow: Lo-Fi Beats",
    artist: "Chilled Beats & Calm Keyboard",
    category: "focus",
    tag: "GMAT Sprint Flow",
    trackCount: 50,
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    ytUrl: "https://music.youtube.com/search?q=lofi+beats+to+study+solve+quant+problems",
    moodDescription: "Steady 80 BPM rhythm designed to eliminate cognitive fatigue during algebra & DI sprints.",
    bpmOrVibe: "80 BPM Lo-Fi",
  },
  {
    id: "f-2",
    title: "Alpha Brainwaves & Ambient Focus (432Hz)",
    artist: "Binaural Synthesis & Deep Space Piano",
    category: "focus",
    tag: "Deep Concentration",
    trackCount: 18,
    coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    ytUrl: "https://music.youtube.com/search?q=432hz+alpha+waves+deep+study+focus+piano",
    moodDescription: "Zero-vocal binaural soundscapes for reading comprehension passage mapping.",
    bpmOrVibe: "432Hz Ambient",
  },
  {
    id: "f-3",
    title: "Cyberpunk & High-Speed Synthesis",
    artist: "Synthwave / Dark Ambient Electronic",
    category: "focus",
    tag: "Analytical Drive",
    trackCount: 32,
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
    ytUrl: "https://music.youtube.com/search?q=synthwave+coding+focus+electronic+instrumental",
    moodDescription: "Driving electronic pulse for high-tempo problem solving and data analysis.",
    bpmOrVibe: "Electronic Drive",
  },

  // Gym & High Energy
  {
    id: "e-1",
    title: "Kingdom High-BPM Workout & Training",
    artist: "Lecrae, Andy Mineo, KB, Hulvey",
    category: "energy",
    tag: "Physical Training",
    trackCount: 35,
    coverUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    ytUrl: "https://music.youtube.com/search?q=christian+hip+hop+workout+lecrae+kb+mineo",
    moodDescription: "Heavy bass, high intensity, and spiritually grounded motivation for gym workouts.",
    bpmOrVibe: "140 BPM Hype",
  },
  {
    id: "e-2",
    title: "Joyful African & Caribbean Gospel Praise",
    artist: "Sinach, Moses Bliss, Limoblaze, Ada Ehi",
    category: "energy",
    tag: "Celebration",
    trackCount: 30,
    coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
    ytUrl: "https://music.youtube.com/search?q=afrobeats+gospel+praise+limoblaze+moses+bliss",
    moodDescription: "Infectious Afro-gospel groove for morning energy and celebratory walks.",
    bpmOrVibe: "Afrobeats Praise",
  },
];

export const DEFAULT_CURRENT_PLAYLIST = {
  title: "Acoustic Worship & Intimate Prayer",
  subtitle: "Maverick City Music, Elevation, Bethel",
  ytUrl: "https://music.youtube.com/search?q=acoustic+worship+intimate+prayer+elevation+maverick+city",
  coverUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80",
  tag: "Devotional Sanctuary",
  bpmOrVibe: "Acoustic & Piano",
};
