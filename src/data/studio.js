export const STUDIO = {
  name: "L'atelier",
  long: "L'atelier — Studio Créatif",
  tagline: "Studio créatif. Fidjrossè, Cotonou — Bénin.",
  city: "Fidjrossè · Cotonou · Bénin",
  founded: "Studio créatif — since 2025",
  email: "studio@latelier.bj",
  phone: "+229 01 00 00 00",
  social: [
    { label: "Instagram", handle: "@latelier.studio" },
    { label: "Facebook", handle: "/latelier" },
    { label: "LinkedIn", handle: "/latelier" }
  ]
}

export const CHAPTERS = [
  {
    id: "identite",
    num: "01",
    name: "Identité",
    blurb: "Construire la marque. Voix, image, plan.",
    services: [
      { id: "graphisme", title: "Graphisme & identité visuelle", excerpt: "Logos. Systèmes. Éditions. Packaging. Une marque, un langage.", keywords: ["logo", "système", "édition"] },
      { id: "da", title: "Direction artistique", excerpt: "Concept global. Casting visuel. Du brief au shoot.", keywords: ["DA", "concept", "production"] },
      { id: "strategie", title: "Stratégie de communication", excerpt: "Positionnement. Plateforme de marque. Plans 360°.", keywords: ["stratégie", "plan", "positionnement"] },
      { id: "comm", title: "Communication digitale", excerpt: "Social media. Contenus natifs. Campagnes ciblées.", keywords: ["social", "contenu", "ads"] }
    ]
  },
  {
    id: "espace",
    num: "02",
    name: "Espace",
    blurb: "Habiter les murs, les façades, les objets.",
    services: [
      { id: "peinture", title: "Peinture intérieur & extérieur", excerpt: "Mise en peinture. Finitions mates et satinées. Traitements climat.", keywords: ["bâtiment", "résidentiel", "tertiaire"] },
      { id: "murale", title: "Décoration murale — strict art", excerpt: "Fresques. Lettrages. Compositions abstraites. Bombe, rouleau, pinceau.", keywords: ["fresque", "lettrage", "street"] },
      { id: "laser", title: "Découpe & gravure laser", excerpt: "Signalétique. Objets-cadeaux. Mobilier sur-mesure.", keywords: ["bois", "acrylique", "cuir"] },
      { id: "tableaux", title: "Tableaux artistiques sur commande", excerpt: "Pièces uniques en dialogue avec le commanditaire. Formats sur-mesure.", keywords: ["peinture", "unique", "sur-mesure"] },
      { id: "batik", title: "Création tissu batik", excerpt: "Batik traditionnel et contemporain. Cire. Indigo. Palettes naturelles.", keywords: ["batik", "indigo", "cire"] }
    ]
  },
  {
    id: "digital",
    num: "03",
    name: "Digital",
    blurb: "Du fichier au produit. Sites, apps, SaaS, IA.",
    services: [
      { id: "web", title: "Développement web", excerpt: "Sites éditoriaux. E-commerce. Plateformes sur-mesure.", keywords: ["web", "react", "headless"] },
      { id: "mobile", title: "Applications mobiles", excerpt: "iOS. Android. Pensées pour des réseaux variables.", keywords: ["iOS", "Android", "PWA"] },
      { id: "saas", title: "SaaS & briques d'IA", excerpt: "Outils métier. Tableaux de bord. Intégrations IA utiles.", keywords: ["SaaS", "IA", "produit"] }
    ]
  },
  {
    id: "evenement",
    num: "04",
    name: "Événement",
    blurb: "Faire exister un moment. Booking, scénographie, image, son.",
    services: [
      { id: "organisation", title: "Organisation événementielle", excerpt: "De A à Z. Concept, logistique, équipe, production. On orchestre.", keywords: ["événement", "production", "orchestration"] },
      { id: "booking", title: "Booking artistes & DJ", excerpt: "Programmation, négociation, riders, plateau technique. Artistes locaux et internationaux.", keywords: ["booking", "prog", "line-up"] },
      { id: "dj", title: "Animation DJ & live", excerpt: "DJ set. Animation soirée. Sonorisation événement. Du club au mariage.", keywords: ["DJ", "live", "son"] },
      { id: "deco", title: "Décoration événementielle", excerpt: "Scénographie. Lancements. Mariages. Salons. De la maquette à la pose.", keywords: ["scéno", "stand", "décor"] },
      { id: "bache", title: "Impression bâche grand format", excerpt: "Bâches. Kakémonos. Supports événementiels. Œillets, ourlets, pose.", keywords: ["grand format", "outdoor"] },
      { id: "vinyle", title: "Flocage & stickers vinyle", excerpt: "Vinyle sur véhicules, vitrines, objets. Séries petites et grandes.", keywords: ["véhicule", "vitrine", "vinyle"] },
      { id: "serigraphie", title: "Sérigraphie textile", excerpt: "T-shirts. Totes. Sweat-shirts. Éditions limitées, commandes corporate.", keywords: ["merch", "textile"] },
      { id: "video", title: "Réalisation, cadrage & montage", excerpt: "Films de marque. Couverture live. Photo. Post-production.", keywords: ["film", "live", "montage"] },
      { id: "ateliers", title: "Ateliers découverte", excerpt: "Sérigraphie. Batik. Peinture murale. Individuels ou en groupe.", keywords: ["atelier", "groupe", "transmission"] }
    ]
  }
]

export const ALL_SERVICES = CHAPTERS.flatMap((c) =>
  c.services.map((s) => ({ ...s, chapter: c.id, chapterName: c.name, chapterNum: c.num }))
)

export const TEAM = [
  { name: "Koffi Adjovi", role: "Direction artistique · cofondateur", bio: "Pense les ponts entre disciplines.", skills: ["DA", "Édition", "Graphisme"], tone: "warm" },
  { name: "Nadège Houénou", role: "Plasticienne · batik", bio: "Atelier teinture, cire, indigo.", skills: ["Batik", "Peinture", "Pédagogie"], tone: "cool" },
  { name: "Sékou Bagayoko", role: "Développeur produit", bio: "Web, mobile, SaaS, intégrations IA.", skills: ["React", "Node", "iOS"], tone: "neutral" },
  { name: "Mireille Dossou", role: "Graphiste senior", bio: "Identités, systèmes, packaging.", skills: ["Identité", "Édition", "Type"], tone: "warm" },
  { name: "Yannick Tossou", role: "Réalisateur · monteur", bio: "Cadre. Lumière. Couverture live.", skills: ["Cadrage", "Montage", "Color"], tone: "cool" },
  { name: "Aïcha Olou", role: "Cheffe de projet · stratégie", bio: "Coordonne. Conseille. Tranche.", skills: ["Stratégie", "Production"], tone: "neutral" },
  { name: "Patrice Migan", role: "Atelier impression & laser", bio: "Sérigraphie, vinyle, gravure.", skills: ["Sérigraphie", "Laser", "Vinyle"], tone: "warm" },
  { name: "Inès Kpodar", role: "Designer mobile · IA", bio: "Apps. Prototypage. Modèles.", skills: ["UX", "Mobile", "IA"], tone: "cool" },
  { name: "Mathias Sossou", role: "Peintre · muraliste", bio: "Façades, intérieurs, fresques.", skills: ["Peinture", "Fresque"], tone: "warm" },
  { name: "Léa Agboton", role: "Photographe · DA shoot", bio: "Image fixe. Casting visuel.", skills: ["Photo", "DA"], tone: "neutral" }
]

export const PROJECTS = [
  { id: "p1", title: "Fresque Marché Dantokpa", year: "2025", type: "Murale", chapter: "espace", ratio: "4/5", tone: "warm" },
  { id: "p2", title: "Identité — Café Akpé", year: "2025", type: "Identité", chapter: "identite", ratio: "3/4", tone: "neutral" },
  { id: "p3", title: "App Sɔɔ — agriculteurs", year: "2024", type: "Mobile", chapter: "digital", ratio: "9/16", tone: "cool" },
  { id: "p4", title: "Collection batik Hivɛ", year: "2024", type: "Textile", chapter: "espace", ratio: "1/1", tone: "warm" },
  { id: "p5", title: "Campagne MTN Bénin", year: "2024", type: "Film", chapter: "identite", ratio: "16/9", tone: "cool" },
  { id: "p6", title: "Scénographie SOBEBRA", year: "2023", type: "Événement", chapter: "evenement", ratio: "3/4", tone: "neutral" },
  { id: "p7", title: "Signalétique Hôtel Azalaï", year: "2024", type: "Laser", chapter: "espace", ratio: "1/1", tone: "warm" },
  { id: "p8", title: "Plateforme SaaS — Logivɛ", year: "2025", type: "SaaS", chapter: "digital", ratio: "4/3", tone: "cool" },
  { id: "p9", title: "Édition — Festival des Masques", year: "2024", type: "Édition", chapter: "identite", ratio: "3/4", tone: "warm" }
]
