const { useState, useEffect, useCallback } = React;

// ═══════════════════════════════════════════════════════════════
// DATA LAYER
// ═══════════════════════════════════════════════════════════════

const PREDATORS = [
  {
    id: "great-white", name: "Great White Shark", sci: "Carcharodon carcharias",
    glyph: "◈", category: "ocean", tags: ["ocean", "stealth", "ambush", "speed"],
    identity: "Electroreceptive apex ambush predator — 400 million years of evolutionary refinement",
    color: "#4cc9f0", apex: 87,
    stats: { speed: 88, strength: 92, stealth: 76, intelligence: 68, endurance: 84, sensory: 96 },
    t1: { traits: [{ icon: "⚡", label: "BURST SPEED", val: "35 mph" }, { icon: "⚙", label: "BITE FORCE", val: "4,000 PSI" }, { icon: "◎", label: "SENSORY RADIUS", val: "~1 mile" }] },
    t2: { style: "Breach ambush from depth. Approaches prey at 45° to eliminate silhouette detection. Single devastating strike, tactical withdrawal. Waits for hemorrhagic incapacitation.", habitat: "Open pelagic ocean, coastal zones, kelp forests", range: "All major oceans — 60°N to 60°S latitude", diet: "Pinnipeds, cetaceans, large bony fish, sea turtles", role: "Apex oceanic regulator — controls seal and sea lion population dynamics", adaptations: ["Ampullae of Lorenzini detect bioelectric fields from prey heartbeats", "Counter-shading: dark dorsal / white ventral renders invisible from all angles", "3,000+ teeth across 5 rows — continuously replaced throughout lifetime", "Ram ventilation: must remain in motion for gill oxygenation — stopping = death"] },
    t3: { hunt: ["DETECTION — Blood detected at 1 part per million, up to 1 mile. Cross-correlated with lateral line mechanoreception and electroreception.", "APPROACH — Ascends from depth at 45° angle using thermoclines as visual cover. Targets prey's dorsal blind zone exclusively.", "STRIKE — Terminal acceleration to 25 mph in <3 seconds. Eyes rotate posterior for protection. Jaws protrude forward +10cm at impact.", "WITHDRAWAL — Massive wound delivered. Predator retreats 20–40m. Waits for hemorrhagic shock to incapacitate before returning."], evo: ["Unchanged body plan for 400 million years — older than the first trees on Earth", "Olfactory lobes comprise 67% of total brain volume — smell IS the brain", "Electrosensory resolution detects 0.5 nanovolts per centimeter — detects heartbeat"], efficiency: "Extreme efficiency. Single-strike protocol minimizes energy expenditure. Documented 45-day fasting tolerance between kills.", weaknesses: ["Orca pod tactics can neutralize solitary ambush strategy", "Ram ventilation dependency — injury to swimming apparatus = fatal", "26-year maturity cycle makes population recovery impossibly slow"] },
    sys: { detection: 94, approach: 78, strike: 70, kill: 65 },
    prey: ["Harbor Seal", "California Sea Lion", "Bottlenose Dolphin", "Bluefin Tuna", "Sea Turtle"],
    envs: ["Open Ocean", "Coastal Shallows", "Kelp Forest", "Deep Channel"]
  },
  {
    id: "tiger", name: "Bengal Tiger", sci: "Panthera tigris tigris",
    glyph: "◬", category: "land", tags: ["land", "stealth", "ambush", "power"],
    identity: "Solitary ambush hunter optimized for dense terrain — the planet's most powerful cat",
    color: "#faa307", apex: 89,
    stats: { speed: 82, strength: 94, stealth: 91, intelligence: 78, endurance: 72, sensory: 80 },
    t1: { traits: [{ icon: "🕶", label: "STEALTH CLASS", val: "CRITICAL" }, { icon: "⚡", label: "SPRINT SPEED", val: "40 mph" }, { icon: "⚙", label: "JAW STRENGTH", val: "1,050 PSI" }] },
    t2: { style: "Cover-based stalk, explosive ambush burst. Uses dense vegetation and low-light to close within 20–30m before charging. Targets cervical spine or throat. Kill in under 60 seconds.", habitat: "Dense jungle, mangrove forest, grassland margins, snow forests", range: "South and Southeast Asia, Russian Far East (isolated populations)", diet: "Deer, wild boar, gaur, water buffalo, smaller mammals", role: "Keystone terrestrial predator — shapes ungulate behavior across entire ecosystems", adaptations: ["Vertical stripe pattern breaks silhouette in filtered light — active optical camouflage", "Padded paws with shock-absorbing tissue eliminate approach sound signature", "Retractable claws stay fully sharp — only deployed at the moment of strike", "Nape-bite or throat-clamp terminates kill in seconds with minimal energy spent"] },
    t3: { hunt: ["DETECTION — Scent trails read hours after passage. Builds spatial memory map of prey movement corridors.", "STALK — Approaches in phases: observe → close to 100m → freeze → close to 30m through vegetation corridors. Sub-decibel noise discipline.", "BURST — Explosive acceleration to 40 mph achieved in 3 strides. Rear leg musculature drives primary thrust force.", "KILL — Forelimbs anchor prey. Throat grip or skull-base bite maintained 3–5 minutes. Zero release protocol."], evo: ["Evolved in solitary isolation — no pack pressure drove single-specialist traits to extremes", "Night vision 6x human capability via tapetum lucidum light amplification", "Whisker array detects air displacement from prey breath at close range"], efficiency: "Moderate efficiency. High energy stalk-and-burst cycle. 1-in-20 hunt success rate requires large territory with high prey density.", weaknesses: ["Low hunt success rate demands large territory to sustain caloric needs", "Solitary — no tactical redundancy or backup in failed approaches", "Speed advantage collapses entirely in open terrain with no cover"] },
    sys: { detection: 85, approach: 88, strike: 72, kill: 78 },
    prey: ["Sambar Deer", "Wild Boar", "Gaur", "Chital", "Water Buffalo"],
    envs: ["Dense Jungle", "Mangrove Swamp", "Grassland Edge", "Snow Forest"]
  },
  {
    id: "orca", name: "Orca", sci: "Orcinus orca",
    glyph: "◉", category: "ocean", tags: ["ocean", "intelligence", "pack", "apex"],
    identity: "Superpredatory eusocial cetacean — the only predator that hunts apex predators as prey",
    color: "#e63946", apex: 96,
    stats: { speed: 85, strength: 95, stealth: 60, intelligence: 99, endurance: 90, sensory: 92 },
    t1: { traits: [{ icon: "🧠", label: "INTELLIGENCE", val: "NEAR-HUMAN" }, { icon: "⚡", label: "TOP SPEED", val: "34 mph" }, { icon: "◎", label: "ECHOLOCATION", val: "800m range" }] },
    t2: { style: "Coordinated pod tactics. Units execute flanking maneuvers, wave-wash attacks, carousel herding. Every prey type has a documented countermeasure. No prey is tactically immune.", habitat: "All ocean zones — Arctic to tropical, coastal to abyssal depth", range: "Global — most widespread marine mammal on Earth", diet: "Everything: fish, sharks, rays, great whales, sea lions, seabirds", role: "Hyperapex ocean predator — no natural predators at any life stage", adaptations: ["Culture-based hunting: tactics transmitted across generations verbally", "Echolocation precise enough to identify individual prey fish mid-school", "Pod operates as distributed intelligence — each member executes a coordinated role", "Sonic production at 20,000 Hz can stun or disorient prey at close range"] },
    t3: { hunt: ["INTELLIGENCE PHASE — Pod analyzes prey behavior, assesses defensive capability, assigns specialized roles. Up to 20 minutes of observation before first move.", "COORDINATION — Pod splits into flanker units, chase units, and barrier units. Prey escape vectors are blocked geometrically — not chased randomly.", "EXECUTION — Target separated from group. Exhaustion is engineered through relay harassment. Strategic bite or drowning delivers terminal outcome.", "ADAPTATION — Failed tactics are documented in pod memory. Group modifies approach for next encounter — multi-generational learning."], evo: ["Returned from land to ocean ~50M years ago — retained full mammalian cognitive architecture", "Each pod has a unique dialect — cultural speciation is actively occurring across populations", "Documented real-time invention of entirely new hunt tactics within a single generation"], efficiency: "Maximum collective efficiency. Energy spent on tactics rather than brute pursuit. Coordinated pod success rates approach 95%.", weaknesses: ["Pod-dependent — solitary orca loses most of its tactical advantage immediately", "Cultural knowledge is destroyed if pod elders die (holds centuries of accumulated hunting intelligence)", "Reproductive rate: 1 calf every 5+ years — populations cannot rapidly recover"] },
    sys: { detection: 92, approach: 89, strike: 85, kill: 92 },
    prey: ["Great White Shark", "Humpback Whale Calf", "Sea Lion", "Stingray", "Bluefin Tuna"],
    envs: ["Open Ocean", "Arctic Ice Edge", "Coastal Shallows", "Deep Trench"]
  },
  {
    id: "saltwater-croc", name: "Saltwater Crocodile", sci: "Crocodylus porosus",
    glyph: "◫", category: "land", tags: ["land", "water", "ambush", "power", "stealth"],
    identity: "Living armored siege weapon — 200M-year ambush predator with perfect patience",
    color: "#52b788", apex: 88,
    stats: { speed: 78, strength: 97, stealth: 88, intelligence: 62, endurance: 95, sensory: 82 },
    t1: { traits: [{ icon: "⚙", label: "BITE FORCE", val: "16,460 PSI" }, { icon: "⏱", label: "SUBMERGE TIME", val: "2+ hours" }, { icon: "🕶", label: "AMBUSH CLASS", val: "PERFECT" }] },
    t2: { style: "Motionless ambush at waterline for hours or days. Submerges at prey approach — zero surface disturbance. Explosive surface breach strike. Death roll dislocates joints, drowns and tears simultaneously.", habitat: "Tidal estuaries, mangroves, freshwater rivers, open sea coast", range: "Northern Australia, Southeast Asia, South Asia — coastal and riverine", diet: "Fish, large mammals, water buffalo, sharks, anything near water", role: "Apex semi-aquatic predator — regulates riverine and coastal prey populations on island and coastal systems", adaptations: ["Dermal pressure receptors detect ripples from prey footsteps at extreme sensitivity", "Nictitating membrane allows clear vision underwater during surface strike", "Metabolic rate drops 70% at rest — near-zero energy cost for ambush holding", "Osteoderms (bone-embedded armor) provide near-total external physical protection"] },
    t3: { hunt: ["OBSERVATION — Holds position at waterline for hours or days. Maps prey water-access patterns, timing, and routes with precision.", "SUBMERSION — Slips below surface as prey approaches. Zero surface disturbance protocol. Only nostrils above waterline until final moment.", "STRIKE — Full-body explosive launch from water in under 0.2 seconds. Largest recorded: 7m, 1,000kg of mass at full acceleration.", "DEATH ROLL — Rotational force dislocates joints, ruptures organs, drowns. No physical escape recorded at full jaw lock."], evo: ["Survived the K-Pg extinction event that destroyed all non-avian dinosaurs", "Nearly identical anatomy to Triassic ancestors — evolution declared this design optimal and stopped", "Brain capable of complex behavioral learning despite classification as 'reptilian' — documented play behavior observed"], efficiency: "Hyper-efficient. Metabolic idling means almost zero energy burn during wait states. One large kill sustains for months.", weaknesses: ["Terrestrially limited to 10 mph for brief bursts — extremely slow on land", "Cold-blooded: inactive in low temperatures — geography-bound", "Poor maneuverability in open deep water — ambush range-dependent"] },
    sys: { detection: 86, approach: 94, strike: 88, kill: 85 },
    prey: ["Wild Boar", "Water Buffalo", "Deer", "Shark", "Sea Turtle"],
    envs: ["River Bank", "Mangrove Estuary", "Tidal Flat", "Freshwater Lake"]
  },
  {
    id: "snow-leopard", name: "Snow Leopard", sci: "Panthera uncia",
    glyph: "◇", category: "land", tags: ["land", "mountain", "stealth", "precision"],
    identity: "Ghost of the mountain — precision ambush specialist in Earth's most extreme terrain",
    color: "#c8d8e8", apex: 82,
    stats: { speed: 79, strength: 75, stealth: 96, intelligence: 80, endurance: 88, sensory: 84 },
    t1: { traits: [{ icon: "🕶", label: "STEALTH CLASS", val: "GHOST" }, { icon: "⚡", label: "ALTITUDE RANGE", val: "18,000 ft" }, { icon: "◎", label: "VISION", val: "6x human" }] },
    t2: { style: "Ridge-top observation, vertical descent ambush. Uses terrain for concealment and gravity-multiplied strike momentum. Tail as dynamic counterbalance on vertical rock surfaces.", habitat: "Central Asian mountain ranges — alpine and subalpine zones only", range: "Himalayas, Tian Shan, Altai ranges across 12 nations", diet: "Blue sheep, Himalayan ibex, marmot, snow cock", role: "High-altitude apex predator — regulates ungulate populations in terrain no other predator can access", adaptations: ["3m tail provides active counterbalance on vertical cliff approaches", "Nasal passage geometry pre-warms air at -40°C temperatures before lung contact", "Massive paws distribute weight across snow — natural snowshoe engineering", "Rosette pattern matches rock texture and snow shadow — visual profile near-zero at range"] },
    t3: { hunt: ["SURVEY — Observes from ridgeline above prey territory for extended periods. Maps routes, timing, and vulnerability windows before committing.", "DESCENT — Uses gravity and terrain cover for completely silent downhill approach. Zero acoustic signature at any range.", "AMBUSH — Pounces from above — targets neck or skull base. Gravitational acceleration multiplies effective strike force well beyond body mass.", "HOLD — Throat grip maintained 3–5 minutes until suffocation complete. Tail used as active stabilizer on angled slopes throughout."], evo: ["Specialized blood oxygenation system evolved for high-altitude hypoxic conditions", "Cannot roar — unique among big cats — communicates through chuffing and hissing only", "Skull structure allows wider jaw opening relative to body size than any other big cat species"], efficiency: "High efficiency relative to territory size. Terrain mastery compensates for smaller body mass ceiling.", weaknesses: ["Small body mass limits prey size ceiling — cannot take very large ungulates", "Extreme habitat dependency — physiologically cannot adapt to lowland environments", "Critically endangered: 4,000–6,500 individuals remaining globally"] },
    sys: { detection: 82, approach: 90, strike: 74, kill: 70 },
    prey: ["Blue Sheep", "Himalayan Tahr", "Marmot", "Ibex", "Snowcock"],
    envs: ["Alpine Ridge", "Rocky Cliff Face", "Snow Valley", "High Plateau"]
  },
  {
    id: "harpy-eagle", name: "Harpy Eagle", sci: "Harpia harpyja",
    glyph: "◁", category: "air", tags: ["air", "speed", "precision", "power"],
    identity: "Apex aerial predator — talons exceed grizzly bear claws, navigates canopy at 50 mph",
    color: "#9d4edd", apex: 85,
    stats: { speed: 90, strength: 86, stealth: 78, intelligence: 82, endurance: 75, sensory: 91 },
    t1: { traits: [{ icon: "⚡", label: "DIVE SPEED", val: "50 mph" }, { icon: "⚙", label: "TALON PRESSURE", val: "110 lbs/sq in" }, { icon: "◎", label: "VISUAL ACUITY", val: "8x human" }] },
    t2: { style: "Perch-and-scan ambush at canopy height. Drops vertically through gap geometry at terminal velocity. Targets primate skull or cervical spine for instantaneous kill.", habitat: "Lowland tropical rainforest — requires primary-growth canopy for hunting", range: "Southern Mexico to Bolivia and Brazil — primary Amazon basin", diet: "Sloths, howler monkeys, capuchins, opossums, large snakes", role: "Apex aerial forest predator — controls arboreal mammal populations in primary jungle systems", adaptations: ["Facial disk channels ambient sound to ear openings — parabolic acoustic dish", "Talons reach 13cm — comparable in dimension to grizzly bear claws", "Head rotation to 270° while wings fully folded for strike positioning", "Navigates between trees at 50 mph despite 200cm wingspan — spatial processing exceeds all known raptors"] },
    t3: { hunt: ["SCAN — Surveys 1km² from elevated canopy perch. Cross-references visual field and acoustic input simultaneously for 20–45 minutes.", "LOCK — Target identified. Intercept vector calculated to account for canopy gap geometry and prey movement trajectory.", "DIVE — Vertical plunge at 50 mph. Wings partially folded to thread canopy gaps. 0.3-second strike window from entry to contact.", "IMPACT — Talons penetrate skull or spine at point of contact. Successful direct strikes produce instantaneous kills."], evo: ["Largest eagle in the Americas — apex of New World avian evolutionary optimization", "Facial disk evolved independently from owls — documented convergent evolution of acoustic hunting", "Bond pairs share territory 30+ years — cumulative hunt intelligence compounds over decades"], efficiency: "Precision efficiency model. Single strike = single kill philosophy. Minimal metabolic cost per successful hunt.", weaknesses: ["Primary forest dependency — deforestation is existential threat to the species", "Extremely low reproductive rate: 1 egg every 2–3 years only", "Talon geometry optimized for above — relatively vulnerable to ambush from ground level"] },
    sys: { detection: 91, approach: 82, strike: 78, kill: 82 },
    prey: ["Two-toed Sloth", "Howler Monkey", "Capuchin Monkey", "Iguana", "Boa Constrictor"],
    envs: ["Primary Rainforest", "Forest Canopy", "River Clearing", "Forest Edge"]
  },
  {
    id: "komodo-dragon", name: "Komodo Dragon", sci: "Varanus komodoensis",
    glyph: "◪", category: "land", tags: ["land", "ambush", "stealth", "endurance"],
    identity: "Venomous persistence hunter — uses biochemical warfare and infinite patience as primary weapons",
    color: "#b5838d", apex: 78,
    stats: { speed: 68, strength: 84, stealth: 80, intelligence: 65, endurance: 92, sensory: 88 },
    t1: { traits: [{ icon: "☠", label: "VENOM CLASS", val: "ANTICOAGULANT" }, { icon: "◎", label: "TONGUE RANGE", val: "5 miles" }, { icon: "⏱", label: "HUNT DURATION", val: "Days–Weeks" }] },
    t2: { style: "Ambush strike delivering venom payload. Withdraws and tracks wounded prey during slow biochemical attrition phase. Returns when prey collapse is confirmed.", habitat: "Hot dry savanna, tropical forests, beaches — Lesser Sunda Islands only", range: "Komodo, Rinca, Flores, Gili Motang — Indonesia", diet: "Timor deer, wild pigs, goats, water buffalo, opportunistic carrion", role: "Island apex predator — regulates deer and pig populations across isolated island ecosystems", adaptations: ["Bifurcated tongue samples airborne molecules 30x per minute — blood detected at 5 miles", "8 documented anticoagulant venom compounds delivered through tooth-base glands", "Osteoderms: bone-embedded scales provide external armor against counterattacks", "Ectothermic metabolism — can remain functional during extended fasting regardless of duration"] },
    t3: { hunt: ["CHEMICAL DETECTION — Tongue samples environment 30 times per minute. Triangulates blood concentration gradient across 5-mile radius.", "AMBUSH — Motionless concealment near established game trails. Strikes at ankle or abdomen to prioritize venom delivery over immediate incapacitation.", "WITHDRAWAL — After strike, dragon disengages and allows prey to escape. No pursuit. Venom begins systemic anticoagulation.", "PERSISTENCE — Tracks blood trail for days if necessary. Prey dies from hemorrhagic shock. Dragon feeds at complete leisure."], evo: ["Descended from Megalania: 7m ancestor that hunted giant marsupials in Pleistocene Australia", "Island gigantism: isolated from competition, evolved to maximum viable body size for the ecosystem", "Parthenogenesis capability — females can produce viable offspring without male fertilization"], efficiency: "Maximum metabolic efficiency. Near-zero energy expenditure after initial bite delivery. Prey performs all the dying work.", weaknesses: ["Sprint speed of 12 mph limits initial prey options severely", "Island-bound ecosystem dependency — global range is 4 small Indonesian islands only", "Low cognitive flexibility limits in-hunt tactical adaptation to changing conditions"] },
    sys: { detection: 87, approach: 80, strike: 75, kill: 60 },
    prey: ["Timor Deer", "Water Buffalo", "Wild Pig", "Goat", "Carrion"],
    envs: ["Dry Savanna", "Scrub Forest", "Rocky Beach", "River Valley"]
  },
  {
    id: "wolf", name: "Gray Wolf", sci: "Canis lupus",
    glyph: "◈", category: "land", tags: ["land", "pack", "endurance", "intelligence"],
    identity: "Pack-coordinated persistence hunter — reshapes entire ecosystems through trophic cascade",
    color: "#8ecae6", apex: 84,
    stats: { speed: 80, strength: 72, stealth: 70, intelligence: 90, endurance: 96, sensory: 88 },
    t1: { traits: [{ icon: "🧠", label: "PACK INTEL", val: "COLLECTIVE" }, { icon: "⚡", label: "SUSTAINED RUN", val: "35mph / 2hr" }, { icon: "◎", label: "SCENT RANGE", val: "1.75 miles" }] },
    t2: { style: "Persistence relay hunting. Pack maintains chase pressure through coordinated rotation. No individual wolf carries full pursuit load. Targets weakest prey in herd through systematic probing runs.", habitat: "Boreal forest, open tundra, mountain ranges, northern grasslands", range: "North America, Europe, Asia — largest natural range of any terrestrial predator", diet: "Elk, moose, bison, deer, smaller mammals when prey scarce", role: "Keystone species — trophic cascade regenerates rivers, forests, and songbird populations across entire ecosystems", adaptations: ["Pack role specialization: scouts, flankers, pursuit specialists, kill units — not random running", "Endurance physiology sustains 35 mph for 2+ continuous hours without metabolic failure", "Vocal system encodes prey location, pack position, and tactical commands in real time", "Social learning compresses: young wolves achieve functional hunting competency within 6 months"] },
    t3: { hunt: ["ASSESSMENT — Pack approaches herd. Controlled probing runs test for weakness, injury, or age. Target selection is analytical, not opportunistic.", "SELECTION — Weakest target identified. Alpha designates. Pack repositions into geometric pursuit formation with assigned roles.", "RELAY — Wolves rotate lead pursuit position every few minutes. Prey never faces fresh legs — asymmetric attrition.", "COLLAPSE — Prey exhaustion achieved. Pack closes simultaneously from multiple vectors. Hamstring or throat — simultaneous multi-point attack."], evo: ["Social hunting drove encephalization — cognitive complexity grew in direct proportion to pack coordination demands", "Yellowstone reintroduction 1995: wolf presence restored rivers, regenerated forests, recovered songbird populations — documented trophic cascade", "Co-evolved alongside early humans over 100,000+ years — genetic ancestor of all domesticated dog breeds"], efficiency: "Collective efficiency model. Individual energy cost distributed across pack. Failed hunts carry low per-member metabolic cost.", weaknesses: ["Pack cohesion dependency — lone wolf hunt success rate falls below viable threshold", "Prey population scarcity triggers territorial conflict with adjacent packs", "Most heavily persecuted large predator in human history across all range nations"] },
    sys: { detection: 88, approach: 78, strike: 72, kill: 80 },
    prey: ["Elk", "Moose Calf", "Bison", "Whitetail Deer", "Muskox"],
    envs: ["Boreal Forest", "Open Tundra", "Mountain Valley", "Grassland Plains"]
  }
];

const CATEGORIES = [
  { id: "all", label: "ALL APEX" }, { id: "ocean", label: "OCEAN" },
  { id: "land", label: "LAND" }, { id: "air", label: "AIR" },
  { id: "stealth", label: "STEALTH" }, { id: "intelligence", label: "INTEL" },
  { id: "pack", label: "PACK" }, { id: "ambush", label: "AMBUSH" }
];

const STAT_LABELS = ["speed", "strength", "stealth", "intelligence", "endurance", "sensory"];

// ═══════════════════════════════════════════════════════════════
// CSS
// ═══════════════════════════════════════════════════════════════

const CSS = `
 url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;500&family=Rajdhani:wght@400;500;600;700&display=swap');

*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --bg:#040608;--s1:#08090d;--s2:#0c0f14;--s3:#111620;
  --b1:#151d28;--b2:#1e2d3d;--b3:#243344;
  --red:#e63946;--amber:#faa307;--cyan:#4cc9f0;--green:#52b788;--purple:#9d4edd;
  --t1:#c8d3dc;--t2:#7a8fa0;--t3:#3a4a5a;
}
body{background:var(--bg);overflow-x:hidden;}
.apex{font-family:'Rajdhani',sans-serif;background:var(--bg);color:var(--t1);min-height:100vh;max-width:860px;margin:0 auto;position:relative;padding-bottom:70px;}
.apex::after{content:'';position:fixed;top:0;left:0;right:0;bottom:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px);pointer-events:none;z-index:9998;}
.mono{font-family:'Ibm Plex Mono','IBM Plex Mono',monospace;}
.bebas{font-family:'Bebas Neue',sans-serif;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes scanline{0%{transform:translateY(-100%);}100%{transform:translateY(100vh);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.5;}}
@keyframes glitch{0%,100%{transform:none;filter:none;}92%{transform:skewX(-0.5deg);filter:hue-rotate(90deg);}}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
@keyframes statfill{from{width:0;}to{width:var(--target);}}
.fade-up{animation:fadeUp .4s ease both;}
.pulse{animation:pulse 2.5s ease-in-out infinite;}
.blink{animation:blink 1.2s step-end infinite;}
.glitch{animation:glitch 8s infinite;}

/* header */
.hdr{position:sticky;top:0;z-index:100;background:rgba(4,6,8,.95);border-bottom:1px solid var(--b1);backdrop-filter:blur(12px);padding:0 16px;display:flex;align-items:center;justify-content:space-between;height:52px;}
.hdr-logo{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:3px;color:var(--red);}
.hdr-sub{font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--t3);letter-spacing:2px;margin-top:-2px;}
.hdr-right{display:flex;gap:8px;align-items:center;}
.hdr-badge{font-family:'IBM Plex Mono',monospace;font-size:9px;padding:3px 8px;border:1px solid var(--b2);color:var(--t3);letter-spacing:1px;}
.hdr-badge.live{border-color:var(--red);color:var(--red);}

/* nav */
.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:860px;z-index:100;background:rgba(4,6,8,.98);border-top:1px solid var(--b1);display:flex;backdrop-filter:blur(12px);}
.nav-btn{flex:1;padding:10px 4px 8px;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;border:none;background:none;color:var(--t3);transition:color .2s;font-family:'IBM Plex Mono',monospace;font-size:8px;letter-spacing:1px;border-top:2px solid transparent;}
.nav-btn.active{color:var(--red);border-top-color:var(--red);}
.nav-btn:hover{color:var(--t2);}
.nav-icon{font-size:14px;}

/* cards */
.card{background:var(--s1);border:1px solid var(--b1);transition:border-color .2s,transform .2s;}
.card:hover{border-color:var(--b2);}
.card-press{cursor:pointer;}
.card-press:hover{transform:translateY(-2px);}

/* stat bar */
.sbar-wrap{margin-bottom:8px;}
.sbar-head{display:flex;justify-content:space-between;margin-bottom:4px;font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--t3);}
.sbar-track{height:2px;background:var(--b1);border-radius:2px;overflow:hidden;}
.sbar-fill{height:100%;border-radius:2px;transition:width 1s cubic-bezier(.4,0,.2,1);}

/* tier tabs */
.tier-tabs{display:flex;gap:4px;padding:12px 16px;}
.tier-tab{flex:1;padding:8px;text-align:center;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:1px;cursor:pointer;border:1px solid var(--b1);color:var(--t3);background:var(--s1);transition:all .2s;}
.tier-tab.t1.active{border-color:#52b788;color:#52b788;background:rgba(82,183,136,.08);}
.tier-tab.t2.active{border-color:var(--amber);color:var(--amber);background:rgba(250,163,7,.08);}
.tier-tab.t3.active{border-color:var(--red);color:var(--red);background:rgba(230,57,70,.08);}

/* section */
.sec{padding:0 16px 16px;}
.sec-title{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--t3);letter-spacing:2px;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--b1);}
.sec-label{font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--t3);letter-spacing:1px;text-transform:uppercase;}

/* pred card */
.pcard{padding:14px;cursor:pointer;border:1px solid var(--b1);background:var(--s1);transition:all .2s;position:relative;overflow:hidden;}
.pcard::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--c);}
.pcard:hover{border-color:var(--b2);transform:translateY(-1px);}
.pcard-name{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:1px;line-height:1;}
.pcard-sci{font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--t3);font-style:italic;}
.pcard-identity{font-size:11px;color:var(--t2);margin:6px 0;line-height:1.5;}
.pcard-traits{display:flex;gap:6px;flex-wrap:wrap;}
.pcard-trait{font-family:'IBM Plex Mono',monospace;font-size:9px;padding:3px 7px;border:1px solid var(--b2);color:var(--t3);white-space:nowrap;}
.pcard-score{position:absolute;top:12px;right:12px;font-family:'Bebas Neue',sans-serif;font-size:28px;line-height:1;color:var(--c);opacity:.5;}

/* hunt steps */
.hunt-step{padding:12px;border-left:2px solid var(--b2);margin-bottom:8px;background:var(--s1);}
.hunt-step-label{font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--red);letter-spacing:2px;margin-bottom:4px;}
.hunt-step-text{font-size:13px;color:var(--t2);line-height:1.6;}

/* ai output */
.ai-box{padding:16px;border:1px solid var(--b2);background:var(--s1);font-size:13px;color:var(--t1);line-height:1.8;white-space:pre-wrap;}
.ai-thinking{display:flex;align-items:center;gap:8px;font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--red);letter-spacing:2px;}
.ai-dot{width:4px;height:4px;border-radius:50%;background:var(--red);animation:pulse 1s ease-in-out infinite;}
.ai-dot:nth-child(2){animation-delay:.2s;}
.ai-dot:nth-child(3){animation-delay:.4s;}

/* apex score */
.apex-score{display:flex;flex-direction:column;align-items:center;justify-content:center;width:72px;height:72px;border:1px solid var(--c);position:relative;}
.apex-score::before{content:'APEX';position:absolute;top:-8px;background:var(--s1);padding:0 4px;font-family:'IBM Plex Mono',monospace;font-size:7px;color:var(--t3);letter-spacing:1px;}
.apex-score-num{font-family:'Bebas Neue',sans-serif;font-size:32px;line-height:1;color:var(--c);}
.apex-score-unit{font-family:'IBM Plex Mono',monospace;font-size:7px;color:var(--t3);letter-spacing:1px;}

/* compare */
.cmp-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;}
.cmp-val{font-family:'Bebas Neue',sans-serif;font-size:20px;}
.cmp-vs{font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--t3);text-align:center;padding:0 8px;}

/* scrollbar */
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-track{background:var(--s1);}
::-webkit-scrollbar-thumb{background:var(--b2);}

/* select */
select{background:var(--s2);border:1px solid var(--b2);color:var(--t1);padding:8px 12px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:1px;width:100%;cursor:pointer;appearance:none;-webkit-appearance:none;}
select:focus{outline:none;border-color:var(--red);}

/* btn */
.btn{padding:10px 20px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:2px;cursor:pointer;border:1px solid;transition:all .2s;background:none;}
.btn-red{border-color:var(--red);color:var(--red);}
.btn-red:hover{background:var(--red);color:#000;}
.btn-amber{border-color:var(--amber);color:var(--amber);}
.btn-amber:hover{background:var(--amber);color:#000;}
.btn-dim{border-color:var(--b2);color:var(--t3);}
.btn-dim:hover{border-color:var(--t3);color:var(--t2);}
.btn-full{width:100%;}

/* grid */
.pred-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 16px;}
@media(max-width:500px){.pred-grid{grid-template-columns:1fr;}}

/* rank */
.rank-row{display:grid;grid-template-columns:32px 1fr 80px;align-items:center;gap:12px;padding:10px 14px;border-bottom:1px solid var(--b1);cursor:pointer;transition:background .2s;}
.rank-row:hover{background:var(--s1);}
.rank-num{font-family:'Bebas Neue',sans-serif;font-size:22px;color:var(--t3);}
.rank-num.top3{color:var(--amber);}

/* hero */
.intel-hero{padding:16px;background:linear-gradient(135deg,var(--s1) 0%,var(--s2) 100%);border-bottom:1px solid var(--b1);position:relative;overflow:hidden;}
.intel-hero::after{content:attr(data-glyph);position:absolute;right:16px;top:50%;transform:translateY(-50%);font-family:'Bebas Neue',sans-serif;font-size:80px;color:var(--c);opacity:.07;line-height:1;}

/* tags */
.tag{display:inline-block;font-family:'IBM Plex Mono',monospace;font-size:9px;padding:2px 6px;border:1px solid var(--b2);color:var(--t3);margin:2px;letter-spacing:1px;}
`;

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

const StatBar = ({ label, value, color, delay = 0 }) => {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 100 + delay); return () => clearTimeout(t); }, [value, delay]);
  return (
    <div className="sbar-wrap">
      <div className="sbar-head">
        <span>{label.toUpperCase()}</span>
        <span style={{ color }}>{value}</span>
      </div>
      <div className="sbar-track">
        <div className="sbar-fill" style={{ width: `${w}%`, background: color, boxShadow: `0 0 6px ${color}60` }} />
      </div>
    </div>
  );
};

const RadarHex = ({ stats, color }) => {
  const keys = STAT_LABELS;
  const cx = 80, cy = 80, r = 60;
  const pts = keys.map((k, i) => {
    const angle = (i / keys.length) * 2 * Math.PI - Math.PI / 2;
    const v = stats[k] / 100;
    return [cx + r * v * Math.cos(angle), cy + r * v * Math.sin(angle)];
  });
  const gridPts = keys.map((_, i) => {
    const angle = (i / keys.length) * 2 * Math.PI - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  const poly = pts.map(p => p.join(",")).join(" ");
  const grid = gridPts.map(p => p.join(",")).join(" ");

  return (
    <svg width={160} height={160} style={{ display: "block" }}>
      {[0.25, 0.5, 0.75, 1].map(s => (
        <polygon key={s} points={gridPts.map((_, i) => {
          const angle = (i / keys.length) * 2 * Math.PI - Math.PI / 2;
          return `${cx + r * s * Math.cos(angle)},${cy + r * s * Math.sin(angle)}`;
        }).join(" ")} fill="none" stroke="#1e2d3d" strokeWidth={1} />
      ))}
      {gridPts.map((gp, i) => (
        <line key={i} x1={cx} y1={cy} x2={gp[0]} y2={gp[1]} stroke="#151d28" strokeWidth={1} />
      ))}
      <polygon points={poly} fill={`${color}20`} stroke={color} strokeWidth={1.5} />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={3} fill={color} />)}
      {gridPts.map((gp, i) => (
        <text key={i} x={gp[0] + (gp[0] - cx) * 0.22} y={gp[1] + (gp[1] - cy) * 0.22}
          textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 7, fontFamily: "IBM Plex Mono, monospace", fill: "#3a4a5a", textTransform: "uppercase" }}>
          {keys[i].slice(0, 3).toUpperCase()}
        </text>
      ))}
    </svg>
  );
};

const ApexScore = ({ score, color }) => (
  <div className="apex-score" style={{ "--c": color }}>
    <div className="apex-score-num" style={{ color }}>{score}</div>
    <div className="apex-score-unit">/ 100</div>
  </div>
);

const SysFlow = ({ sys, color }) => {
  const steps = [
    { label: "DETECT", val: sys.detection },
    { label: "APPROACH", val: sys.approach },
    { label: "STRIKE", val: sys.strike },
    { label: "KILL", val: sys.kill }
  ];
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, fontFamily: "IBM Plex Mono, monospace", color, marginBottom: 2 }}>{s.val}%</div>
            <div style={{ fontSize: 8, fontFamily: "IBM Plex Mono, monospace", color: "#3a4a5a", letterSpacing: 1 }}>{s.label}</div>
          </div>
          {i < steps.length - 1 && <div style={{ color: "#1e2d3d", fontSize: 14, paddingBottom: 10 }}>→</div>}
        </div>
      ))}
    </div>
  );
};

const Loading = () => (
  <div className="ai-thinking" style={{ padding: "20px 0" }}>
    <div className="ai-dot" />
    <div className="ai-dot" />
    <div className="ai-dot" />
    <span>PROCESSING INTELLIGENCE</span>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════

  function App() {
  const [screen, setScreen] = useState("nexus");
  const [predator, setPredator] = useState(null);
  const [tier, setTier] = useState(1);
  const [filter, setFilter] = useState("all");
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);
  const [simP, setSimP] = useState(null);
  const [simPrey, setSimPrey] = useState("");
  const [simEnv, setSimEnv] = useState("");
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);

  const todayP = PREDATORS[new Date().getDate() % PREDATORS.length];
  const filtered = filter === "all" ? PREDATORS : PREDATORS.filter(p => p.tags.includes(filter));
  const sorted = [...PREDATORS].sort((a, b) => b.apex - a.apex);

  const callAI = async (prompt) => {
    setLoading(true); setAiText("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      setAiText(data.content.map(c => c.text || "").join(""));
    } catch (e) { setAiText("SIGNAL LOST — Neural link interrupted. Check connection."); }
    setLoading(false);
  };

  const goIntel = (p) => { setPredator(p); setTier(1); setAiText(""); setScreen("intel"); };

  // ─── NEXUS ─────────────────────────────────────────────────

  const NexusScreen = () => (
    <div className="fade-up">
      {/* POTD */}
      <div style={{ margin: "12px 16px", padding: "14px", background: "var(--s1)", border: "1px solid var(--b1)", position: "relative", cursor: "pointer" }} onClick={() => goIntel(todayP)}>
        <div style={{ position: "absolute", top: 10, right: 12, fontFamily: "IBM Plex Mono, monospace", fontSize: 8, color: "var(--red)", letterSpacing: 2 }} className="pulse">◉ PREDATOR OF THE DAY</div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 26, color: todayP.color, lineHeight: 1, letterSpacing: 1 }}>{todayP.name}</div>
          <div style={{ fontFamily: "IBM Plex Mono, monospace", fontStyle: "italic", fontSize: 9, color: "var(--t3)", marginBottom: 8 }}>{todayP.sci}</div>
          <div style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.5, marginBottom: 10 }}>{todayP.identity}</div>
          <SysFlow sys={todayP.sys} color={todayP.color} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: "0 16px 10px", display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10 }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setFilter(c.id)}
            style={{ padding: "5px 10px", fontFamily: "IBM Plex Mono, monospace", fontSize: 9, letterSpacing: 1, whiteSpace: "nowrap", cursor: "pointer", border: "1px solid", transition: "all .2s", background: "none", borderColor: filter === c.id ? "var(--red)" : "var(--b1)", color: filter === c.id ? "var(--red)" : "var(--t3)" }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="pred-grid">
        {filtered.map((p, i) => (
          <div key={p.id} className="pcard" style={{ "--c": p.color, animationDelay: `${i * 0.05}s` }} onClick={() => goIntel(p)}>
            <div className="pcard-score">{p.apex}</div>
            <div className="pcard-name" style={{ color: p.color }}>{p.name}</div>
            <div className="pcard-sci">{p.sci}</div>
            <div className="pcard-identity">{p.identity}</div>
            <div className="pcard-traits">
              {p.t1.traits.map((t, j) => (
                <div key={j} className="pcard-trait">{t.icon} {t.val}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Discovery collections */}
      <div style={{ margin: "16px 16px 0" }} className="sec-title">DISCOVERY ENGINE</div>
      <div style={{ padding: "0 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[
          { label: "MOST EFFICIENT KILLERS", tag: "ambush", color: "var(--red)" },
          { label: "OCEAN DOMINATORS", tag: "ocean", color: "var(--cyan)" },
          { label: "MASTERS OF STEALTH", tag: "stealth", color: "var(--green)" },
          { label: "INTELLIGENCE CLASS", tag: "intelligence", color: "var(--amber)" },
        ].map(col => (
          <div key={col.tag} onClick={() => setFilter(col.tag)}
            style={{ padding: "10px 12px", border: "1px solid var(--b1)", background: "var(--s1)", cursor: "pointer", borderLeft: `3px solid ${col.color}` }}>
            <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, color: col.color, letterSpacing: 1 }}>{col.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── INTEL ─────────────────────────────────────────────────

  const IntelScreen = () => {
    if (!predator) return <div style={{ padding: 20, color: "var(--t3)" }}>No predator selected.</div>;
    const p = predator;
    const tierColors = { 1: "#52b788", 2: "var(--amber)", 3: "var(--red)" };
    const tc = tierColors[tier];

    return (
      <div className="fade-up">
        {/* Back */}
        <div style={{ padding: "10px 16px" }}>
          <button className="btn btn-dim" onClick={() => setScreen("nexus")} style={{ fontSize: 9, padding: "6px 14px" }}>← NEXUS</button>
        </div>

        {/* Hero */}
        <div className="intel-hero" data-glyph={p.glyph} style={{ "--c": p.color }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <ApexScore score={p.apex} color={p.color} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 28, color: p.color, lineHeight: 1, letterSpacing: 1 }}>{p.name}</div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, fontStyle: "italic", color: "var(--t3)", marginBottom: 8 }}>{p.sci}</div>
              <div style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.6 }}>{p.identity}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
            {p.tags.map(t => <span key={t} className="tag">{t.toUpperCase()}</span>)}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="btn btn-red" style={{ fontSize: 9, padding: "6px 14px" }} onClick={() => { setSimP(p); setSimPrey(""); setSimEnv(""); setAiText(""); setScreen("hunt"); }}>SIMULATE HUNT</button>
            <button className="btn btn-amber" style={{ fontSize: 9, padding: "6px 14px" }} onClick={() => { setCompareA(p); setCompareB(null); setAiText(""); setScreen("versus"); }}>COMPARE</button>
          </div>
        </div>

        {/* Tier Tabs */}
        <div className="tier-tabs">
          {[1, 2, 3].map(t => (
            <button key={t} className={`tier-tab t${t} ${tier === t ? "active" : ""}`} onClick={() => setTier(t)}>
              {t === 1 ? "🟢 TIER 1" : t === 2 ? "🟡 TIER 2" : "🔴 TIER 3"}
            </button>
          ))}
        </div>

        {/* Tier 1 */}
        {tier === 1 && (
          <div className="fade-up">
            <div className="sec">
              <div className="sec-title">INSTANT PROFILE</div>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                {p.t1.traits.map((t, i) => (
                  <div key={i} style={{ flex: 1, padding: "10px", border: "1px solid var(--b2)", background: "var(--s2)", textAlign: "center" }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</div>
                    <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 16, color: p.color }}>{t.val}</div>
                    <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 8, color: "var(--t3)", letterSpacing: 1 }}>{t.label}</div>
                  </div>
                ))}
              </div>

              <div className="sec-title">COMBAT STATISTICS</div>
              {STAT_LABELS.map((k, i) => (
                <StatBar key={k} label={k} value={p.stats[k]} color={p.color} delay={i * 80} />
              ))}

              <div style={{ marginTop: 16 }} className="sec-title">HUNT SYSTEM MODEL</div>
              <div style={{ padding: "12px", background: "var(--s2)", border: "1px solid var(--b1)" }}>
                <SysFlow sys={p.sys} color={p.color} />
              </div>
            </div>
          </div>
        )}

        {/* Tier 2 */}
        {tier === 2 && (
          <div className="fade-up">
            <div className="sec">
              <div className="sec-title">HUNTING STRATEGY</div>
              <div style={{ padding: "12px", background: "var(--s1)", border: "1px solid var(--b1)", fontSize: 13, color: "var(--t1)", lineHeight: 1.7, marginBottom: 14 }}>{p.t2.style}</div>

              <div className="sec-title">OPERATIONAL PROFILE</div>
              {[["HABITAT", p.t2.habitat], ["RANGE", p.t2.range], ["PRIMARY DIET", p.t2.diet], ["ECOSYSTEM ROLE", p.t2.role]].map(([label, val]) => (
                <div key={label} style={{ padding: "8px 0", borderBottom: "1px solid var(--b1)", display: "grid", gridTemplateColumns: "100px 1fr", gap: 12, marginBottom: 4 }}>
                  <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, color: "var(--t3)", letterSpacing: 1 }}>{label}</div>
                  <div style={{ fontSize: 12, color: "var(--t2)" }}>{val}</div>
                </div>
              ))}

              <div style={{ marginTop: 14 }} className="sec-title">KEY ADAPTATIONS</div>
              {p.t2.adaptations.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--b1)" }}>
                  <div style={{ color: p.color, fontFamily: "IBM Plex Mono, monospace", fontSize: 10, minWidth: 16 }}>{String(i + 1).padStart(2, "0")}</div>
                  <div style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.6 }}>{a}</div>
                </div>
              ))}

              <div style={{ marginTop: 14, padding: "12px", background: "var(--s2)", border: "1px solid var(--b1)" }}>
                <RadarHex stats={p.stats} color={p.color} />
              </div>
            </div>
          </div>
        )}

        {/* Tier 3 */}
        {tier === 3 && (
          <div className="fade-up">
            <div className="sec">
              <div className="sec-title">HUNT SEQUENCE ANALYSIS</div>
              {p.t3.hunt.map((step, i) => {
                const [label, ...rest] = step.split(" — ");
                return (
                  <div key={i} className="hunt-step">
                    <div className="hunt-step-label">{label}</div>
                    <div className="hunt-step-text">{rest.join(" — ")}</div>
                  </div>
                );
              })}

              <div style={{ marginTop: 14 }} className="sec-title">EVOLUTIONARY ADVANTAGES</div>
              {p.t3.evo.map((e, i) => (
                <div key={i} style={{ padding: "8px 10px", borderLeft: `2px solid ${p.color}`, marginBottom: 6, background: "var(--s1)" }}>
                  <div style={{ fontSize: 12, color: "var(--t1)", lineHeight: 1.6 }}>{e}</div>
                </div>
              ))}

              <div style={{ marginTop: 14 }} className="sec-title">ENERGY EFFICIENCY ANALYSIS</div>
              <div style={{ padding: "12px", background: "var(--s1)", border: "1px solid var(--b1)", fontSize: 13, color: "var(--t2)", lineHeight: 1.7 }}>{p.t3.efficiency}</div>

              <div style={{ marginTop: 14 }} className="sec-title">TACTICAL WEAKNESSES</div>
              {p.t3.weaknesses.map((w, i) => (
                <div key={i} style={{ padding: "8px 10px", borderLeft: "2px solid var(--red)", marginBottom: 6, background: "var(--s1)" }}>
                  <div style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.6 }}>{w}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── VERSUS ─────────────────────────────────────────────────

  const VersusScreen = () => {
    const runAnalysis = () => {
      if (!compareA || !compareB) return;
      const prompt = `You are a wildlife systems analyst. Compare these two apex predators for a 1v1 encounter and strategic analysis.

PREDATOR A: ${compareA.name}
Stats: Speed ${compareA.stats.speed}, Strength ${compareA.stats.strength}, Stealth ${compareA.stats.stealth}, Intelligence ${compareA.stats.intelligence}, Endurance ${compareA.stats.endurance}, Sensory ${compareA.stats.sensory}
Identity: ${compareA.identity}
Hunting style: ${compareA.t2.style}
Key adaptations: ${compareA.t2.adaptations.join("; ")}
Weaknesses: ${compareA.t3.weaknesses.join("; ")}

PREDATOR B: ${compareB.name}
Stats: Speed ${compareB.stats.speed}, Strength ${compareB.stats.strength}, Stealth ${compareB.stats.stealth}, Intelligence ${compareB.stats.intelligence}, Endurance ${compareB.stats.endurance}, Sensory ${compareB.stats.sensory}
Identity: ${compareB.identity}
Hunting style: ${compareB.t2.style}
Key adaptations: ${compareB.t2.adaptations.join("; ")}
Weaknesses: ${compareB.t3.weaknesses.join("; ")}

Provide:
1. STRATEGIC ADVANTAGE BREAKDOWN (3-4 sentences analyzing how each predator's traits compare)
2. 1v1 ENCOUNTER ANALYSIS (consider environment, detection, first strike, endurance, tactics)
3. LIKELY OUTCOME with % probability and reasoning
4. KEY DECIDING FACTOR (the single most decisive element)

Be analytical, specific, and educational. No filler. Format clearly with the section headers above.`;
      callAI(prompt);
    };

    return (
      <div className="fade-up">
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--b1)" }}>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 22, letterSpacing: 2 }}>VERSUS ENGINE</div>
          <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, color: "var(--t3)", letterSpacing: 1 }}>INTELLIGENCE-BASED COMPARISON SYSTEM</div>
        </div>

        <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center" }}>
          <div>
            <div className="sec-label" style={{ marginBottom: 6 }}>PREDATOR A</div>
            <select value={compareA?.id || ""} onChange={e => setCompareA(PREDATORS.find(p => p.id === e.target.value) || null)}>
              <option value="">— SELECT —</option>
              {PREDATORS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {compareA && <div style={{ marginTop: 6, padding: "8px", background: "var(--s1)", border: `1px solid ${compareA.color}30` }}>
              <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 16, color: compareA.color }}>{compareA.name}</div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, color: "var(--t3)" }}>APEX {compareA.apex}/100</div>
            </div>}
          </div>

          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 22, color: "var(--red)", textAlign: "center" }}>VS</div>

          <div>
            <div className="sec-label" style={{ marginBottom: 6 }}>PREDATOR B</div>
            <select value={compareB?.id || ""} onChange={e => setCompareB(PREDATORS.find(p => p.id === e.target.value) || null)}>
              <option value="">— SELECT —</option>
              {PREDATORS.filter(p => !compareA || p.id !== compareA.id).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {compareB && <div style={{ marginTop: 6, padding: "8px", background: "var(--s1)", border: `1px solid ${compareB.color}30` }}>
              <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 16, color: compareB.color }}>{compareB.name}</div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, color: "var(--t3)" }}>APEX {compareB.apex}/100</div>
            </div>}
          </div>
        </div>

        {compareA && compareB && (
          <div style={{ padding: "0 16px 16px" }}>
            <div className="sec-title">STAT COMPARISON</div>
            {STAT_LABELS.map(k => {
              const a = compareA.stats[k], b = compareB.stats[k];
              const winner = a > b ? "a" : b > a ? "b" : "tie";
              return (
                <div key={k} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 18, color: winner === "a" ? compareA.color : "var(--t3)" }}>{a}</div>
                    <div style={{ height: 2, background: winner === "a" ? compareA.color : "var(--b1)", marginTop: 2 }} />
                  </div>
                  <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 8, color: "var(--t3)", textAlign: "center", letterSpacing: 1, minWidth: 56 }}>{k.toUpperCase()}</div>
                  <div>
                    <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 18, color: winner === "b" ? compareB.color : "var(--t3)" }}>{b}</div>
                    <div style={{ height: 2, background: winner === "b" ? compareB.color : "var(--b1)", marginTop: 2 }} />
                  </div>
                </div>
              );
            })}

            <button className="btn btn-red btn-full" style={{ marginTop: 12 }} onClick={runAnalysis} disabled={loading}>
              {loading ? "ANALYZING..." : "RUN INTELLIGENCE ANALYSIS"}
            </button>
          </div>
        )}

        {loading && <div style={{ padding: "0 16px" }}><Loading /></div>}
        {aiText && (
          <div style={{ padding: "0 16px 16px" }}>
            <div className="sec-title">INTELLIGENCE REPORT</div>
            <div className="ai-box">{aiText}</div>
          </div>
        )}
      </div>
    );
  };

  // ─── HUNT ────────────────────────────────────────────────────

  const HuntScreen = () => {
    const runSim = () => {
      if (!simP || !simPrey || !simEnv) return;
      const prompt = `You are a wildlife systems analyst running a hunt simulation. Generate a cinematic, scientifically accurate step-by-step hunt narrative.

PREDATOR: ${simP.name}
Hunt system: Detection ${simP.sys.detection}%, Approach ${simP.sys.approach}%, Strike ${simP.sys.strike}%, Kill ${simP.sys.kill}%
Hunting style: ${simP.t2.style}
Key adaptations: ${simP.t2.adaptations.join("; ")}

PREY: ${simPrey}
ENVIRONMENT: ${simEnv}

Simulate this hunt in exactly 5 phases:
1. DETECTION — How the predator locates the prey in this environment (include % success)
2. APPROACH — Stalking and closing distance, using terrain and adaptations (include % success)  
3. ATTACK — The strike execution with full physical detail (include % success)
4. OUTCOME — Definitive result with biological accuracy
5. POST-HUNT ASSESSMENT — Energy expended, tactical notes, lessons from this hunt

Write each phase as a dense, specific 2-3 sentence analysis. Use exact biological terminology. No filler. Make it feel classified and real.`;
      callAI(prompt);
    };

    return (
      <div className="fade-up">
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--b1)" }}>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 22, letterSpacing: 2 }}>HUNT SIMULATION ENGINE</div>
          <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, color: "var(--t3)", letterSpacing: 1 }}>AI-POWERED HUNT ANALYSIS SYSTEM</div>
        </div>

        <div style={{ padding: "12px 16px" }}>
          <div className="sec-label" style={{ marginBottom: 6 }}>SELECT PREDATOR</div>
          <select value={simP?.id || ""} onChange={e => { setSimP(PREDATORS.find(p => p.id === e.target.value) || null); setSimPrey(""); setSimEnv(""); setAiText(""); }}>
            <option value="">— SELECT PREDATOR —</option>
            {PREDATORS.map(p => <option key={p.id} value={p.id}>{p.name} (APEX {p.apex})</option>)}
          </select>

          {simP && (
            <div style={{ marginTop: 8, padding: "10px", background: "var(--s1)", border: `1px solid ${simP.color}30` }}>
              <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 18, color: simP.color }}>{simP.name}</div>
              <div style={{ fontSize: 11, color: "var(--t2)", marginTop: 4 }}>{simP.identity}</div>
              <div style={{ marginTop: 8 }}>
                <SysFlow sys={simP.sys} color={simP.color} />
              </div>
            </div>
          )}

          {simP && (
            <>
              <div className="sec-label" style={{ margin: "12px 0 6px" }}>SELECT PREY</div>
              <select value={simPrey} onChange={e => setSimPrey(e.target.value)}>
                <option value="">— SELECT PREY —</option>
                {simP.prey.map(pr => <option key={pr} value={pr}>{pr}</option>)}
              </select>

              <div className="sec-label" style={{ margin: "12px 0 6px" }}>SELECT ENVIRONMENT</div>
              <select value={simEnv} onChange={e => setSimEnv(e.target.value)}>
                <option value="">— SELECT ENVIRONMENT —</option>
                {simP.envs.map(en => <option key={en} value={en}>{en}</option>)}
              </select>

              <button className="btn btn-red btn-full" style={{ marginTop: 14 }}
                onClick={runSim} disabled={loading || !simPrey || !simEnv}>
                {loading ? "SIMULATING..." : "EXECUTE HUNT SIMULATION"}
              </button>
            </>
          )}
        </div>

        {loading && <div style={{ padding: "0 16px" }}><Loading /></div>}
        {aiText && (
          <div style={{ padding: "0 16px 16px" }}>
            <div className="sec-title">HUNT SIMULATION REPORT</div>
            <div className="ai-box">{aiText}</div>
          </div>
        )}
      </div>
    );
  };

  // ─── INDEX ──────────────────────────────────────────────────

  const IndexScreen = () => (
    <div className="fade-up">
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--b1)" }}>
        <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 22, letterSpacing: 2 }}>APEX INDEX</div>
        <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, color: "var(--t3)", letterSpacing: 1 }}>INTELLIGENCE SCORE RANKINGS — COMPOSITE SYSTEM</div>
      </div>

      <div style={{ padding: "10px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4, padding: "10px", background: "var(--s1)", border: "1px solid var(--b1)", marginBottom: 12 }}>
          {["EFFICIENCY", "ADAPTABILITY", "SUCCESS RATE", "SENSORY ADV", "PHYS DOM", "COMPOSITE"].map(l => (
            <div key={l} style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 7, color: "var(--t3)", textAlign: "center", letterSpacing: 0.5 }}>{l}</div>
          ))}
        </div>

        {sorted.map((p, i) => (
          <div key={p.id} className="rank-row" onClick={() => goIntel(p)}>
            <div className={`rank-num ${i < 3 ? "top3" : ""}`} style={{ color: i < 3 ? p.color : "var(--t3)" }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 16, color: p.color, lineHeight: 1.2 }}>{p.name}</div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 8, color: "var(--t3)", marginBottom: 4 }}>{p.sci}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {STAT_LABELS.slice(0, 3).map(k => (
                  <div key={k} style={{ display: "flex", gap: 3, alignItems: "center" }}>
                    <div style={{ width: 30, height: 2, background: "var(--b1)", borderRadius: 1, overflow: "hidden" }}>
                      <div style={{ width: `${p.stats[k]}%`, height: "100%", background: p.color }} />
                    </div>
                    <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 7, color: "var(--t3)" }}>{p.stats[k]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 28, color: p.color, lineHeight: 1 }}>{p.apex}</div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 7, color: "var(--t3)" }}>APEX SCORE</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ margin: "0 16px 16px", padding: "12px", background: "var(--s1)", border: "1px solid var(--b1)" }}>
        <div className="sec-title">SCORING METHODOLOGY</div>
        <div style={{ fontSize: 11, color: "var(--t2)", lineHeight: 1.7 }}>
          APEX Score is a composite of: hunt success rate (25%), sensory advantage (20%), physical dominance (20%), adaptability index (20%), energy efficiency (15%). Scores weight ecological context — a 96 in ocean conditions is equivalent to a 96 on land. No cross-domain comparison is absolute.
        </div>
      </div>
    </div>
  );

  // ─── RENDER ─────────────────────────────────────────────────

  const navItems = [
    { id: "nexus", label: "NEXUS", icon: "◈" },
    { id: "intel", label: "INTEL", icon: "◎" },
    { id: "versus", label: "VERSUS", icon: "⚔" },
    { id: "hunt", label: "HUNT", icon: "⚡" },
    { id: "index", label: "INDEX", icon: "▲" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="apex glitch">
        {/* Header */}
        <div className="hdr">
          <div>
            <div className="hdr-logo">APEX v2</div>
            <div className="hdr-sub">PREDATOR INTELLIGENCE SYSTEM</div>
          </div>
          <div className="hdr-right">
            <div className="hdr-badge live pulse">◉ LIVE</div>
            <div className="hdr-badge">{PREDATORS.length} PREDATORS</div>
          </div>
        </div>

        {/* Active Screen */}
        {screen === "nexus" && <NexusScreen />}
        {screen === "intel" && <IntelScreen />}
        {screen === "versus" && <VersusScreen />}
        {screen === "hunt" && <HuntScreen />}
        {screen === "index" && <IndexScreen />}

        {/* Nav */}
        <nav className="nav">
          {navItems.map(n => (
            <button key={n.id} className={`nav-btn ${screen === n.id ? "active" : ""}`}
              onClick={() => { setScreen(n.id); if (n.id !== "hunt" && n.id !== "versus") setAiText(""); }}>
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
