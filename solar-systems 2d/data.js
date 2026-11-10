/**
 * ==========================================================================
 * Interactive Solar System Explorer - Data Model (Step 1 Update)
 * Concept: Spatial Canvas Navigation & Planetary Odyssey
 * ==========================================================================
 * Aturan Konten:
 * 1. Urutan: Matahari -> 8 Planet Utama -> 5 Planet Kerdil (Pluto, Ceres, Haumea, Makemake, Eris).
 * 2. Bulan (Satelit Alami): HANYA sebutkan nama-nama bulan utama/terkenal.
 *    Untuk bulan-bulan lainnya, HANYA cantumkan jumlah angkanya saja.
 * 3. Properti travelTimeFromEarth: Waktu tempuh dari Bumi menggunakan wahana antariksa saat ini.
 * ==========================================================================
 */

const solarSystemData = [
  // ==========================================
  // BINTANG PUSAT
  // ==========================================
  {
    id: "sun",
    name: "Matahari",
    englishName: "Sun",
    type: "star",
    category: "Bintang Induk",
    tagline: "Jantung bercahaya penopang kehidupan di tata surya.",
    description: "Matahari adalah bintang katai kuning di pusat tata surya kita. Gravitasinya yang luar biasa mengikat semua planet, asteroid, komet, dan puing kosmik dalam orbit yang harmonis.",
    travelTimeFromEarth: "~100 hari (Wahana Parker Solar Probe)",
    stats: {
      distanceFromSun: "0 km (Pusat Tata Surya)",
      diameter: "1.392.700 km",
      mass: "1,989 × 10^30 kg (99,86% massa tata surya)",
      orbitalPeriod: "-",
      rotationPeriod: "25 - 35 hari Bumi (rotasi diferensial)",
      temperature: "5.500 °C (Permukaan) / 15.000.000 °C (Inti)",
      travelTimeFromEarth: "~100 hari (Wahana Parker Solar Probe)"
    },
    moons: {
      total: 0,
      majorMoons: [],
      minorMoonsCount: 0,
      summary: "Tidak memiliki bulan alami."
    },
    visual: {
      primaryColor: "#FFB703",
      accentColor: "#FB8500",
      glowColor: "#FFD166",
      relativeSizeScale: 2.2,
      orbitRadius: 0 // Pusat canvas
    },
    funFact: "Jika Matahari diibaratkan sebesar bola basket, maka Bumi hanya sebesar biji wijen kecil di sampingnya!"
  },

  // ==========================================
  // 8 PLANET UTAMA
  // ==========================================
  {
    id: "mercury",
    name: "Merkurius",
    englishName: "Mercury",
    type: "planet",
    category: "Planet Terestrial (Kebumian)",
    tagline: "Planet terkecil dan terdekat dari sang surya.",
    description: "Merkurius adalah dunia berbatu tanpa atmosfer tebal yang dipenuhi kawah tubrukan. Suhunya sangat ekstrem: membara saat siang hari dan membeku saat malam hari.",
    travelTimeFromEarth: "~6,5 tahun (BepiColombo dengan bantuan gravitasi)",
    stats: {
      distanceFromSun: "57,9 juta km (0,39 AU)",
      diameter: "4.879 km",
      orbitalPeriod: "88 hari Bumi",
      rotationPeriod: "58,6 hari Bumi",
      temperature: "-180 °C hingga 430 °C",
      travelTimeFromEarth: "~6,5 tahun (BepiColombo dengan bantuan gravitasi)"
    },
    moons: {
      total: 0,
      majorMoons: [],
      minorMoonsCount: 0,
      summary: "Tidak memiliki bulan alami."
    },
    visual: {
      primaryColor: "#A0AAB2",
      accentColor: "#6C7A89",
      glowColor: "#D1D8E0",
      relativeSizeScale: 0.6,
      orbitRadius: 280
    },
    funFact: "Satu tahun di Merkurius hanya berlangsung selama 88 hari, tetapi satu hari penuh di sana memakan waktu hampir 176 hari Bumi!"
  },
  {
    id: "venus",
    name: "Venus",
    englishName: "Venus",
    type: "planet",
    category: "Planet Terestrial (Kebumian)",
    tagline: "Kembaran neraka Bumi dengan efek rumah kaca dahsyat.",
    description: "Meskipun bukan yang terdekat dari Matahari, Venus adalah planet terpanas di tata surya akibat selimut atmosfer karbon dioksida tebal yang memerangkap panas secara abadi.",
    travelTimeFromEarth: "~3,5 - 4 bulan (Wahana Mariner / Akatsuki)",
    stats: {
      distanceFromSun: "108,2 juta km (0,72 AU)",
      diameter: "12.104 km",
      orbitalPeriod: "224,7 hari Bumi",
      rotationPeriod: "243 hari Bumi (berputar terbalik/retrograd)",
      temperature: "465 °C (cukup panas untuk melelehkan timbal)",
      travelTimeFromEarth: "~3,5 - 4 bulan (Wahana Mariner / Akatsuki)"
    },
    moons: {
      total: 0,
      majorMoons: [],
      minorMoonsCount: 0,
      summary: "Tidak memiliki bulan alami."
    },
    visual: {
      primaryColor: "#E09F3E",
      accentColor: "#9E2A2B",
      glowColor: "#FFF3B0",
      relativeSizeScale: 0.95,
      orbitRadius: 420
    },
    funFact: "Venus berputar berlawanan arah dengan sebagian besar planet lain, sehingga Matahari terbit dari barat dan terbenam di timur."
  },
  {
    id: "earth",
    name: "Bumi",
    englishName: "Earth",
    type: "planet",
    category: "Planet Terestrial (Kebumian)",
    tagline: "Oase biru permata tempat berkembangnya kehidupan.",
    description: "Satu-satunya planet yang diketahui memiliki kehidupan, lautan air cair, atmosfer kaya oksigen, dan medan magnet protektif yang melindungi kita dari radiasi kosmik.",
    travelTimeFromEarth: "0 hari (Titik Awal Keberangkatan)",
    stats: {
      distanceFromSun: "149,6 juta km (1,00 AU)",
      diameter: "12.742 km",
      orbitalPeriod: "365,25 hari",
      rotationPeriod: "23,9 jam",
      temperature: "-88 °C hingga 58 °C (rata-rata 15 °C)",
      travelTimeFromEarth: "0 hari (Titik Awal Keberangkatan)"
    },
    moons: {
      total: 1,
      majorMoons: ["Bulan (Luna)"],
      minorMoonsCount: 0,
      summary: "Memiliki 1 bulan utama yaitu Bulan (Luna)."
    },
    visual: {
      primaryColor: "#2A9D8F",
      accentColor: "#264653",
      glowColor: "#48CAE4",
      relativeSizeScale: 1.0,
      orbitRadius: 580
    },
    funFact: "Sekitar 71% permukaan Bumi tertutup air, menjadikannya dunia maritim unik di zona layak huni tata surya kita."
  },
  {
    id: "mars",
    name: "Mars",
    englishName: "Mars",
    type: "planet",
    category: "Planet Terestrial (Kebumian)",
    tagline: "Planet Merah berdebu yang menyimpan rahasia masa lalu.",
    description: "Dunia gurun berkarat dengan ngarai raksasa dan gunung berapi tertinggi di tata surya (Olympus Mons). Bukti geologis menunjukkan Mars dulunya pernah lebih hangat dan basah.",
    travelTimeFromEarth: "~7 - 9 bulan (Wahana Perseverance / Curiosity)",
    stats: {
      distanceFromSun: "227,9 juta km (1,52 AU)",
      diameter: "6.779 km",
      orbitalPeriod: "687 hari Bumi",
      rotationPeriod: "24,6 jam",
      temperature: "-140 °C hingga 20 °C (rata-rata -60 °C)",
      travelTimeFromEarth: "~7 - 9 bulan (Wahana Perseverance / Curiosity)"
    },
    moons: {
      total: 2,
      majorMoons: ["Phobos", "Deimos"],
      minorMoonsCount: 0,
      summary: "Memiliki 2 bulan utama yaitu Phobos dan Deimos."
    },
    visual: {
      primaryColor: "#E76F51",
      accentColor: "#B23A22",
      glowColor: "#F4A261",
      relativeSizeScale: 0.7,
      orbitRadius: 760
    },
    funFact: "Gunung Olympus Mons di Mars tingginya hampir tiga kali lipat tinggi Gunung Everest di Bumi!"
  },
  {
    id: "jupiter",
    name: "Jupiter",
    englishName: "Jupiter",
    type: "planet",
    category: "Raksasa Gas",
    tagline: "Raja planet pemegang perisai gravitasi tata surya.",
    description: "Planet terbesar di tata surya dengan massa lebih dari dua kali lipat gabungan seluruh planet lainnya. Memiliki badai ikonik Bintik Merah Raksasa yang telah mengamuk selama ratusan tahun.",
    travelTimeFromEarth: "~5 - 6 tahun (Wahana Juno / Voyager)",
    stats: {
      distanceFromSun: "778,5 juta km (5,20 AU)",
      diameter: "139.820 km",
      orbitalPeriod: "11,86 tahun Bumi",
      rotationPeriod: "9,9 jam (rotasi tercepat)",
      temperature: "-110 °C (lapisan awan atas)",
      travelTimeFromEarth: "~5 - 6 tahun (Wahana Juno / Voyager)"
    },
    moons: {
      total: 95,
      majorMoons: ["Io", "Europa", "Ganymede", "Callisto"],
      minorMoonsCount: 91,
      summary: "Memiliki 4 bulan utama (Io, Europa, Ganymede, Callisto) dan 91 bulan lainnya yang berukuran lebih kecil."
    },
    visual: {
      primaryColor: "#DDA15E",
      accentColor: "#BC6C25",
      glowColor: "#FFE8D6",
      relativeSizeScale: 1.8,
      orbitRadius: 1040
    },
    funFact: "Bulan Ganymede milik Jupiter berukuran lebih besar daripada planet Merkurius dan memiliki medan magnetnya sendiri."
  },
  {
    id: "saturn",
    name: "Saturnus",
    englishName: "Saturn",
    type: "planet",
    category: "Raksasa Gas",
    tagline: "Permata tata surya dengan mahkota cincin memukau.",
    description: "Raksasa gas kedua terbesar yang terkenal dengan sistem cincin es dan batu paling spektakuler. Kerapatannya sangat rendah sehingga secara teori Saturnus bisa mengapung di atas air.",
    travelTimeFromEarth: "~7 tahun (Wahana Cassini-Huygens)",
    stats: {
      distanceFromSun: "1,43 miliar km (9,58 AU)",
      diameter: "116.460 km (tanpa cincin)",
      orbitalPeriod: "29,45 tahun Bumi",
      rotationPeriod: "10,7 jam",
      temperature: "-140 °C (rata-rata)",
      travelTimeFromEarth: "~7 tahun (Wahana Cassini-Huygens)"
    },
    moons: {
      total: 146,
      majorMoons: ["Titan", "Enceladus", "Mimas", "Rhea", "Iapetus"],
      minorMoonsCount: 141,
      summary: "Memiliki 5 bulan utama (Titan, Enceladus, Mimas, Rhea, Iapetus) dan 141 bulan lainnya yang berukuran lebih kecil."
    },
    visual: {
      primaryColor: "#E9C46A",
      accentColor: "#C59B27",
      ringColor: "rgba(244, 213, 140, 0.8)",
      glowColor: "#FFF1C5",
      relativeSizeScale: 1.6,
      orbitRadius: 1340
    },
    funFact: "Cincin spektakuler Saturnus membentang hingga 282.000 km, namun ketebalannya rata-rata hanya sekitar 10 meter saja!"
  },
  {
    id: "uranus",
    name: "Uranus",
    englishName: "Uranus",
    type: "planet",
    category: "Raksasa Es",
    tagline: "Raksasa es unik yang berputar menggelinding menyamping.",
    description: "Planet berwarna biru kehijauan pucat akibat kandungan gas metana. Sumbu rotasinya miring hingga 98 derajat, membuatnya tampak menggelinding di sepanjang orbitnya mengitari Matahari.",
    travelTimeFromEarth: "~9,5 tahun (Wahana Voyager 2)",
    stats: {
      distanceFromSun: "2,87 miliar km (19,2 AU)",
      diameter: "50.724 km",
      orbitalPeriod: "84 tahun Bumi",
      rotationPeriod: "17,2 jam (retrograd)",
      temperature: "-224 °C (atmosfer terdingin)",
      travelTimeFromEarth: "~9,5 tahun (Wahana Voyager 2)"
    },
    moons: {
      total: 28,
      majorMoons: ["Titania", "Oberon", "Umbriel", "Ariel", "Miranda"],
      minorMoonsCount: 23,
      summary: "Memiliki 5 bulan utama (Titania, Oberon, Umbriel, Ariel, Miranda) dan 23 bulan lainnya yang berukuran lebih kecil."
    },
    visual: {
      primaryColor: "#83C5BE",
      accentColor: "#006D77",
      glowColor: "#B5E2FA",
      relativeSizeScale: 1.25,
      orbitRadius: 1640
    },
    funFact: "Karena kemiringan sumbunya yang ekstrem, setiap kutub di Uranus mengalami 42 tahun siang hari terus-menerus disusul 42 tahun malam abadi."
  },
  {
    id: "neptune",
    name: "Neptunus",
    englishName: "Neptune",
    type: "planet",
    category: "Raksasa Es",
    tagline: "Penjaga batas luar dengan badai angin supersonik.",
    description: "Planet terjauh di tata surya dengan warna biru pekat mencolok. Neptunus memiliki angin terkencang di tata surya yang mampu melaju melebihi kecepatan suara.",
    travelTimeFromEarth: "~12 tahun (Wahana Voyager 2)",
    stats: {
      distanceFromSun: "4,50 miliar km (30,1 AU)",
      diameter: "49.244 km",
      orbitalPeriod: "164,8 tahun Bumi",
      rotationPeriod: "16,1 jam",
      temperature: "-218 °C (rata-rata)",
      travelTimeFromEarth: "~12 tahun (Wahana Voyager 2)"
    },
    moons: {
      total: 16,
      majorMoons: ["Triton", "Proteus", "Nereid"],
      minorMoonsCount: 13,
      summary: "Memiliki 3 bulan utama (Triton, Proteus, Nereid) dan 13 bulan lainnya yang berukuran lebih kecil."
    },
    visual: {
      primaryColor: "#0077B6",
      accentColor: "#023E8A",
      glowColor: "#90E0EF",
      relativeSizeScale: 1.2,
      orbitRadius: 1940
    },
    funFact: "Kecepatan angin di Neptunus dapat menembus 2.100 km/jam—tiga kali lipat lebih cepat daripada badai terkuat yang pernah tercatat di Bumi!"
  },

  // ==========================================
  // 5 PLANET KERDIL (DWARF PLANETS)
  // ==========================================
  {
    id: "ceres",
    name: "Ceres",
    englishName: "Ceres",
    type: "dwarf-planet",
    category: "Planet Kerdil (Sabuk Asteroid)",
    tagline: "Ratu sabuk asteroid pemegang air misterius.",
    description: "Objek terbesar di sabuk asteroid antara Mars dan Jupiter, sekaligus satu-satunya planet kerdil yang berada di dalam tata surya bagian dalam. Menyimpan cadangan es air yang melimpah.",
    travelTimeFromEarth: "~2,5 - 3 tahun (Wahana Dawn)",
    stats: {
      distanceFromSun: "414 juta km (2,77 AU)",
      diameter: "940 km",
      orbitalPeriod: "4,6 tahun Bumi",
      rotationPeriod: "9,1 jam",
      temperature: "-105 °C (rata-rata)",
      travelTimeFromEarth: "~2,5 - 3 tahun (Wahana Dawn)"
    },
    moons: {
      total: 0,
      majorMoons: [],
      minorMoonsCount: 0,
      summary: "Tidak memiliki bulan alami."
    },
    visual: {
      primaryColor: "#9381FF",
      accentColor: "#5E50A6",
      glowColor: "#B8B8FF",
      relativeSizeScale: 0.4,
      orbitRadius: 900
    },
    funFact: "Meskipun kecil, massa Ceres menyumbang sepertiga dari total seluruh massa benda padat di sabuk asteroid!"
  },
  {
    id: "pluto",
    name: "Pluto",
    englishName: "Pluto",
    type: "dwarf-planet",
    category: "Planet Kerdil (Sabuk Kuiper)",
    tagline: "Dunia beku legendaris berhati es di tepian tata surya.",
    description: "Dikelompokkan kembali sebagai planet kerdil pada tahun 2006. Pluto memiliki dataran nitrogen beku berbentuk hati yang terkenal (Tombaugh Regio) dan sistem orbit unik bersama Charon.",
    travelTimeFromEarth: "~9,5 tahun (Wahana New Horizons)",
    stats: {
      distanceFromSun: "5,91 miliar km (39,5 AU)",
      diameter: "2.376 km",
      orbitalPeriod: "248 tahun Bumi",
      rotationPeriod: "153,3 jam (6,4 hari Bumi)",
      temperature: "-232 °C",
      travelTimeFromEarth: "~9,5 tahun (Wahana New Horizons)"
    },
    moons: {
      total: 5,
      majorMoons: ["Charon"],
      minorMoonsCount: 4,
      summary: "Memiliki 1 bulan utama yaitu Charon dan 4 bulan lainnya yang berukuran lebih kecil."
    },
    visual: {
      primaryColor: "#CDB4DB",
      accentColor: "#8E7D99",
      glowColor: "#F1E3F6",
      relativeSizeScale: 0.5,
      orbitRadius: 2180
    },
    funFact: "Ukuran bulan Charon hampir separuh dari ukuran Pluto sendiri, membuat keduanya sering dijuluki sebagai sistem planet kerdil ganda."
  },
  {
    id: "haumea",
    name: "Haumea",
    englishName: "Haumea",
    type: "dwarf-planet",
    category: "Planet Kerdil (Sabuk Kuiper)",
    tagline: "Planet lonjong berputar super cepat dengan cincin es tipis.",
    description: "Planet kerdil berbentuk elipsoid mirip bola rugbi akibat rotasinya yang amat kencang (satu putaran hanya 3,9 jam). Haumea juga merupakan salah satu objek luar yang terkonfirmasi memiliki cincin.",
    travelTimeFromEarth: "~14 - 16 tahun (Estimasi wahana antariksa flyby)",
    stats: {
      distanceFromSun: "6,45 miliar km (43,1 AU)",
      diameter: "Sekitar 1.632 km (sumbu terpanjang)",
      orbitalPeriod: "284 tahun Bumi",
      rotationPeriod: "3,9 jam",
      temperature: "-241 °C",
      travelTimeFromEarth: "~14 - 16 tahun (Estimasi wahana antariksa flyby)"
    },
    moons: {
      total: 2,
      majorMoons: ["Hi'iaka", "Namaka"],
      minorMoonsCount: 0,
      summary: "Memiliki 2 bulan utama yaitu Hi'iaka dan Namaka."
    },
    visual: {
      primaryColor: "#BEE1E6",
      accentColor: "#7BA8AD",
      glowColor: "#E0FAFF",
      relativeSizeScale: 0.48,
      orbitRadius: 2380
    },
    funFact: "Saking cepatnya berputar, gaya sentrifugal meregangkan tubuh Haumea menjadi bentuk lonjong elips dan bukan bola bulat!"
  },
  {
    id: "makemake",
    name: "Makemake",
    englishName: "Makemake",
    type: "dwarf-planet",
    category: "Planet Kerdil (Sabuk Kuiper)",
    tagline: "Dunia merah beku tanpa atmosfer permanen.",
    description: "Planet kerdil terbesar kedua di Sabuk Kuiper luar setelah Pluto. Permukaannya dilapisi es metana dan etana beku yang memantulkan cahaya putih kecokelatan.",
    travelTimeFromEarth: "~16 - 18 tahun (Estimasi wahana antariksa flyby)",
    stats: {
      distanceFromSun: "6,85 miliar km (45,8 AU)",
      diameter: "1.430 km",
      orbitalPeriod: "305 tahun Bumi",
      rotationPeriod: "22,8 jam",
      temperature: "-243 °C",
      travelTimeFromEarth: "~16 - 18 tahun (Estimasi wahana antariksa flyby)"
    },
    moons: {
      total: 1,
      majorMoons: ["MK 2"],
      minorMoonsCount: 0,
      summary: "Memiliki 1 bulan utama yaitu MK 2 (S/2015 (136472) 1)."
    },
    visual: {
      primaryColor: "#F4A261",
      accentColor: "#CC6832",
      glowColor: "#FFE3C2",
      relativeSizeScale: 0.45,
      orbitRadius: 2580
    },
    funFact: "Nama Makemake diambil dari dewa pencipta manusia dan kesuburan dalam mitologi suku Rapa Nui di Pulau Paskah."
  },
  {
    id: "eris",
    name: "Eris",
    englishName: "Eris",
    type: "dwarf-planet",
    category: "Planet Kerdil (Piringan Tersebar)",
    tagline: "Penjelajah dingin yang memicu definisi ulang planet.",
    description: "Planet kerdil paling masif di tata surya kita. Penemuannya pada tahun 2005 memicu perdebatan sengit astronomis internasional yang berujung pada lahirnya definisi resmi planet dan planet kerdil oleh IAU.",
    travelTimeFromEarth: "~24 - 28 tahun (Estimasi wahana berkecepatan tinggi)",
    stats: {
      distanceFromSun: "10,12 miliar km (67,7 AU)",
      diameter: "2.326 km",
      orbitalPeriod: "558 tahun Bumi",
      rotationPeriod: "25,9 jam",
      temperature: "-243 °C",
      travelTimeFromEarth: "~24 - 28 tahun (Estimasi wahana berkecepatan tinggi)"
    },
    moons: {
      total: 1,
      majorMoons: ["Dysnomia"],
      minorMoonsCount: 0,
      summary: "Memiliki 1 bulan utama yaitu Dysnomia."
    },
    visual: {
      primaryColor: "#E2E8F0",
      accentColor: "#94A3B8",
      glowColor: "#FFFFFF",
      relativeSizeScale: 0.49,
      orbitRadius: 2800
    },
    funFact: "Eris berjarak hampir tiga kali lebih jauh dari Matahari dibandingkan Pluto, membutuhkan lebih dari 5 abad untuk sekali mengelilingi Matahari!"
  }
];

// Helper subsets untuk mempermudah manipulasi data di UI
const sunData = solarSystemData.find(item => item.id === "sun");
const majorPlanetsData = solarSystemData.filter(item => item.type === "planet");
const dwarfPlanetsData = solarSystemData.filter(item => item.type === "dwarf-planet");

// Pastikan variabel dapat diakses secara global di browser
if (typeof window !== "undefined") {
  window.solarSystemData = solarSystemData;
  window.sunData = sunData;
  window.majorPlanetsData = majorPlanetsData;
  window.dwarfPlanetsData = dwarfPlanetsData;
}
