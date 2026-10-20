/**
 * Nexus Intelligence Command Center — Dynamic Multi-Suspect Report Engine
 * Generates judicial-grade grand jury briefing packages for any FBI fugitive or core suspect.
 */

(function() {
  'use strict';

  // Core Suspect Dossiers (Rich client-side cache for instant zero-latency demo)
  const SUSPECT_DOSSIERS = {
    'POI-FBI-7661467': {
      id: 'POI-FBI-7661467',
      name: 'Dr. Ruja Ignatova',
      displayName: 'RUJA IGNATOVA',
      bounty: '$5,000,000 BOUNTY',
      bountyClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      caseTitle: 'OPERATION BLACKTHORN // SUB-DOSSIER: ONECOIN WIRE FRAUD',
      caseRef: 'CASE IDENTIFIER: CS-2024-8841 • CLASSIFIED ATTACHMENT \'ONECOIN-01\'',
      subpoenaRef: 'GRAND JURY SUBPOENA\nREF: 2024-GJ-4491-SDNY',
      statutoryClass: 'STATUTORY CLASS: 18 U.S.C. § 1343 / 18 U.S.C. § 1956',
      alertBadge: 'ALERT: TOP TEN FUGITIVE // FORGED PASSPORTS',
      photo: 'https://www.fbi.gov/wanted/topten/ruja-ignatova/@@images/image',
      ncic: 'NCIC #W329048-FBI',
      aliases: '"Cryptoqueen", Dr. Ruja, Ruja Ignatova-Bayer',
      nationality: 'Bulgarian / German',
      biometrics: {
        sex: 'Female',
        race: 'White',
        hair: 'Brown / Dark',
        eyes: 'Brown',
        height: '5\'5" (165 cm)',
        weight: '130 lbs (59 kg)',
        pob: 'Ruse, Bulgaria',
        dob: 'May 30, 1980',
        languages: 'English, German, Bulgarian, Russian',
        scars: 'None known. Known to wear heavy designer cosmetic makeup and jewelry.',
        warning: 'MAY HAVE ALTERED APPEARANCE THROUGH PLASTIC SURGERY // TRAVELS WITH ARMED GUARDS'
      },
      operatingFronts: 'OneCoin Ltd (Sofia / Dubai) • Baltic-X Holding Ltd',
      bankingChannels: 'Baltic-X Escrow ($50.0M Wire Rail) • Cayman Trust Reserve ($24.5M)',
      statutoryExposure: '18 U.S.C. § 1343 (Wire Fraud - 20 Yrs) • 18 U.S.C. § 1956 (Money Laundering - 20 Yrs) • 18 U.S.C. § 1349 (Conspiracy)',
      executiveSynthesis: `Multi-source intelligence synthesized through the Nexus federated graph identifies a massive cryptocurrency wire fraud and transnational laundering apparatus operating via OneCoin Ltd and European shell trusts. Primary subject <strong>Dr. Ruja IGNATOVA (POI-FBI-7661467)</strong> orchestrated billions of dollars in illicit investor solicitations, structured through Baltic-X Escrow accounts and offshore Cayman private reserves. Centrality topology analysis confirms that seizing correspondent crypto-fiat settlement rails freezes approximately 84.2% of the active European capital transit network.`,
      clusterTitle: 'CLUSTER: ONECOIN CRYPTOCURRENCY CLEARING NEXUS',
      graphResolution: '6 NODES • 7 EDGES • 3 OFFSHORE ESCROW RAILS',
      networkSvg: `
        <line x1="250" y1="90" x2="100" y2="40" stroke="#06B6D4" stroke-dasharray="4 2" stroke-width="2.5"></line>
        <line x1="250" y1="90" x2="390" y2="45" stroke="#A855F7" stroke-dasharray="3 3" stroke-width="2.5"></line>
        <line x1="250" y1="90" x2="380" y2="140" stroke="#06B6D4" stroke-width="2"></line>
        <line x1="250" y1="90" x2="120" y2="140" stroke="#F59E0B" stroke-width="2"></line>
        <line x1="100" y1="40" x2="120" y2="140" stroke="#38BDF8" stroke-width="1.5"></line>
        <rect fill="#0F172A" height="14" rx="2" width="75" x="140" y="55"></rect>
        <text fill="#38BDF8" font-family="JetBrains Mono" font-size="8" font-weight="bold" text-anchor="middle" x="177" y="65">$50M WIRE RAIL</text>
        <rect fill="#0F172A" height="14" rx="2" width="85" x="285" y="55"></rect>
        <text fill="#C084FC" font-family="JetBrains Mono" font-size="8" font-weight="bold" text-anchor="middle" x="327" y="65">$24.5M ESCROW</text>
        <circle cx="100" cy="40" fill="#1E293B" r="15" stroke="#06B6D4" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="100" y="43">ORG-ONE</text>
        <text fill="#94A3B8" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="100" y="64">OneCoin Ltd</text>
        <circle cx="250" cy="90" fill="#0F172A" r="22" stroke="#F59E0B" stroke-width="3"></circle>
        <circle cx="250" cy="90" fill="none" opacity="0.6" r="28" stroke="#A855F7" stroke-dasharray="3 2" stroke-width="1.5"></circle>
        <text fill="#FFFFFF" font-family="JetBrains Mono" font-size="8.5" font-weight="bold" text-anchor="middle" x="250" y="93">POI-FBI</text>
        <text fill="#FCD34D" font-family="JetBrains Mono" font-size="9" font-weight="bold" text-anchor="middle" x="250" y="126">Ruja IGNATOVA (HUB)</text>
        <circle cx="390" cy="45" fill="#1E293B" r="14" stroke="#A855F7" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="390" y="48">ESC-CAY</text>
        <text fill="#D8B4FE" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="390" y="69">Cayman Trust</text>
        <circle cx="120" cy="140" fill="#1E293B" r="13" stroke="#F59E0B" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="120" y="143">BNK-BAL</text>
        <text fill="#FCD34D" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="120" y="162">Baltic-X Escrow</text>
        <circle cx="380" cy="140" fill="#1E293B" r="13" stroke="#06B6D4" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="380" y="143">SEC-LMS</text>
        <text fill="#7DD3FC" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="380" y="162">Limassol Port Safehouse</text>
      `,
      citations: [
        '[1] <strong>REC-FINCEN-2024-0812:</strong> Suspicious Activity Report flagged $50,000,000 structured cryptocurrency liquidation through Baltic-X Escrow account.',
        '[2] <strong>SIGINT-SAT-4910:</strong> Encrypted satellite voice transmission intercept originating from Dubai maritime perimeter.',
        '[3] <strong>AFFIDAVIT-SDNY-2024:</strong> Federal grand jury testimony under penalty of perjury filed SDNY 2024-GJ-4491, Agent M. Vance.'
      ],
      fbiPdfUrl: 'https://www.fbi.gov/wanted/topten/ruja-ignatova/download.pdf',
      fbiGovUrl: 'https://www.fbi.gov/wanted/topten/ruja-ignatova'
    },
    'POI-FBI-5311090': {
      id: 'POI-FBI-5311090',
      name: 'Semion Mogilevich',
      displayName: 'SEMION MOGILEVICH',
      bounty: '$5,000,000 BOUNTY',
      bountyClass: 'bg-red-500/20 text-red-300 border-red-500/40',
      caseTitle: 'OPERATION BLACKTHORN // SUB-DOSSIER: EURASIAN TRANSNATIONAL SYNDICATE',
      caseRef: 'CASE IDENTIFIER: CS-2024-8841 • CLASSIFIED ATTACHMENT \'SOLNTSEVSKAYA-01\'',
      subpoenaRef: 'GRAND JURY SUBPOENA\nREF: 2024-GJ-5120-EDPA',
      statutoryClass: 'STATUTORY CLASS: 18 U.S.C. § 1962 (RICO) / 18 U.S.C. § 1956',
      alertBadge: 'ALERT: ARMED AND DANGEROUS // SYNDICATE APEX',
      photo: 'https://www.fbi.gov/wanted/cei/semion-mogilevich/@@images/image',
      ncic: 'NCIC #W531109-FBI',
      aliases: '"Brainy Don", Don Semyon, Semen Judkovich Mogilevich',
      nationality: 'Russian / Ukrainian / Israeli',
      biometrics: {
        sex: 'Male',
        race: 'White',
        hair: 'Gray / Balding',
        eyes: 'Green',
        height: '5\'6" (168 cm)',
        weight: '290 lbs (132 kg)',
        pob: 'Kyiv, Ukraine',
        dob: 'June 30, 1946',
        languages: 'Russian, Ukrainian, Hebrew, English',
        scars: 'Mogilevich has prominent pockmarks on his face. Heavy smoker.',
        warning: 'SHOULD BE CONSIDERED ARMED AND DANGEROUS // PRIMARY RESIDENCE MOSCOW'
      },
      operatingFronts: 'Solntsevskaya Syndicate • Vektor Logistics GmbH • YBM Magnex',
      bankingChannels: 'Commerzbank AG (Frankfurt) • Frankfurt Escrow Office ($3.42M Wire Rail)',
      statutoryExposure: '18 U.S.C. § 1962 (RICO Enterprise) • 18 U.S.C. § 1341 (Mail Fraud) • 18 U.S.C. § 1956 (Laundering)',
      executiveSynthesis: `Federal intelligence correlation establishes that <strong>Semion MOGILEVICH (POI-FBI-5311090)</strong> directs the Solntsevskaya Transnational Enterprise apex, leveraging Vektor Logistics GmbH (Frankfurt) and Budapest energy pipelines to route multi-million dollar clearing transactions. Graph degree analysis demonstrates Mogilevich operates with near-perfect structural insulation (betweenness 0.98), exercising indirect control over Western European asset managers and maritime bulk transit conduits.`,
      clusterTitle: 'CLUSTER: EURASIAN CORPORATE FRONT & WIRE PIPELINE',
      graphResolution: '7 NODES • 8 EDGES • 4 CORPORATE SHELLS',
      networkSvg: `
        <line x1="250" y1="90" x2="100" y2="40" stroke="#EF4444" stroke-width="2.5"></line>
        <line x1="250" y1="90" x2="390" y2="45" stroke="#F59E0B" stroke-width="2.5"></line>
        <line x1="250" y1="90" x2="380" y2="140" stroke="#EF4444" stroke-dasharray="4 2" stroke-width="2"></line>
        <line x1="250" y1="90" x2="120" y2="140" stroke="#06B6D4" stroke-width="2"></line>
        <rect fill="#0F172A" height="14" rx="2" width="80" x="135" y="55"></rect>
        <text fill="#EF4444" font-family="JetBrains Mono" font-size="8" font-weight="bold" text-anchor="middle" x="175" y="65">SYNDICATE CONDUIT</text>
        <rect fill="#0F172A" height="14" rx="2" width="75" x="290" y="55"></rect>
        <text fill="#F59E0B" font-family="JetBrains Mono" font-size="8" font-weight="bold" text-anchor="middle" x="327" y="65">$3.42M WIRE</text>
        <circle cx="100" cy="40" fill="#1E293B" r="15" stroke="#EF4444" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="100" y="43">ORG-SOL</text>
        <text fill="#FCA5A5" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="100" y="64">Solntsevskaya</text>
        <circle cx="250" cy="90" fill="#0F172A" r="22" stroke="#EF4444" stroke-width="3"></circle>
        <circle cx="250" cy="90" fill="none" opacity="0.6" r="28" stroke="#EF4444" stroke-dasharray="3 2" stroke-width="1.5"></circle>
        <text fill="#FFFFFF" font-family="JetBrains Mono" font-size="8.5" font-weight="bold" text-anchor="middle" x="250" y="93">POI-531</text>
        <text fill="#F87171" font-family="JetBrains Mono" font-size="9" font-weight="bold" text-anchor="middle" x="250" y="126">Semion MOGILEVICH (HUB)</text>
        <circle cx="390" cy="45" fill="#1E293B" r="14" stroke="#F59E0B" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="390" y="48">ORG-VEK</text>
        <text fill="#FCD34D" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="390" y="69">Vektor GmbH</text>
        <circle cx="120" cy="140" fill="#1E293B" r="13" stroke="#06B6D4" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="120" y="143">BNK-FRK</text>
        <text fill="#7DD3FC" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="120" y="162">Frankfurt Escrow</text>
        <circle cx="380" cy="140" fill="#1E293B" r="13" stroke="#EF4444" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="380" y="143">POI-SER</text>
        <text fill="#FCA5A5" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="380" y="162">Sergei Volkov</text>
      `,
      citations: [
        '[1] <strong>REC-SWIFT-2024-0419:</strong> Transfer $3,420,000 USD from Vektor Logistics (Frankfurt) to correspondent escrow. OFAC Notice #5311.',
        '[2] <strong>INTERPOL-RN-MOSCOW:</strong> Cross-border biometric red notice hit verifying false Ukrainian and Israeli passport filings.',
        '[3] <strong>AFFIDAVIT-EDPA-2024:</strong> Federal Rule 16 evidentiary compilation filed EDPA 2024-GJ-5120, Agent M. Vance.'
      ],
      fbiPdfUrl: 'https://www.fbi.gov/wanted/cei/semion-mogilevich/download.pdf',
      fbiGovUrl: 'https://www.fbi.gov/wanted/cei/semion-mogilevich'
    },
    'POI-FBI-8603389': {
      id: 'POI-FBI-8603389',
      name: 'Griselda Margarita Arredondo Pinzón',
      displayName: 'GRISELDA ARREDONDO PINZÓN',
      bounty: '$2,000,000 BOUNTY',
      bountyClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      caseTitle: 'OPERATION BLACKTHORN // SUB-DOSSIER: MARITIME NARCOTICS CORRIDOR',
      caseRef: 'CASE IDENTIFIER: CS-2024-8841 • CLASSIFIED ATTACHMENT \'CASPIAN-DAWN-01\'',
      subpoenaRef: 'GRAND JURY SUBPOENA\nREF: 2024-GJ-8803-SDNY',
      statutoryClass: 'STATUTORY CLASS: 21 U.S.C. § 963 / 18 U.S.C. § 1956',
      alertBadge: 'ALERT: ARMED FLIGHT RISK // SINALOA ESCORT',
      photo: 'https://www.fbi.gov/wanted/cei/griselda-margarita-arredondo-pinzon/@@images/image',
      ncic: 'NCIC #W860338-FBI',
      aliases: '"Gris", La Madrina, Margarita Pinzon, Reina del Mar',
      nationality: 'Mexican',
      biometrics: {
        sex: 'Female',
        race: 'Hispanic',
        hair: 'Black / Dark Brown',
        eyes: 'Brown',
        height: '5\'4" (163 cm)',
        weight: '140 lbs (64 kg)',
        pob: 'Culiacán, Sinaloa, Mexico',
        dob: 'June 1, 1990',
        languages: 'Spanish, English',
        scars: 'Small scar near right eyebrow, tattoo on left wrist.',
        warning: 'ARMED FLIGHT RISK // OPERATES UNDER TRANSNATIONAL CARTEL ESCORT'
      },
      operatingFronts: 'Sinaloa Maritime Arm • Baltic-X Holding Ltd • Limassol Terminal Co',
      bankingChannels: 'Panama Merchant Escrow ($12.8M Bulk Settlement) • Limassol Port Bank',
      statutoryExposure: '21 U.S.C. § 963 (Maritime Distribution) • 18 U.S.C. § 1956 (Laundering) • 46 U.S.C. § 70503 (MDLEA)',
      executiveSynthesis: `Surveillance and maritime telemetry link <strong>Griselda Margarita ARREDONDO PINZÓN (POI-FBI-8603389)</strong> to commercial bulk carrier movements across Central America, Limassol, and the Port of Rotterdam. Working alongside the Sinaloa Maritime Arm, Arredondo coordinates dark-flag vessel runs (MV Caspian Dawn) and routes multi-million dollar container shipments masked under cold-storage seafood manifests, settling accounts through structured Panama escrow transfers.`,
      clusterTitle: 'CLUSTER: CARIBBEAN-BALTIC MARITIME NARCOTICS CORRIDOR',
      graphResolution: '6 NODES • 6 EDGES • 2 AIS DARK VESSELS',
      networkSvg: `
        <line x1="250" y1="90" x2="100" y2="40" stroke="#06B6D4" stroke-dasharray="4 2" stroke-width="2.5"></line>
        <line x1="250" y1="90" x2="390" y2="45" stroke="#EF4444" stroke-width="2"></line>
        <line x1="250" y1="90" x2="380" y2="140" stroke="#06B6D4" stroke-width="2"></line>
        <line x1="250" y1="90" x2="120" y2="140" stroke="#F59E0B" stroke-width="2.5"></line>
        <rect fill="#0F172A" height="14" rx="2" width="75" x="140" y="55"></rect>
        <text fill="#38BDF8" font-family="JetBrains Mono" font-size="8" font-weight="bold" text-anchor="middle" x="177" y="65">AIS DARK VESSEL</text>
        <rect fill="#0F172A" height="14" rx="2" width="85" x="285" y="55"></rect>
        <text fill="#EF4444" font-family="JetBrains Mono" font-size="8" font-weight="bold" text-anchor="middle" x="327" y="65">SINALOA MARITIME</text>
        <circle cx="100" cy="40" fill="#1E293B" r="14" stroke="#06B6D4" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="100" y="43">VES-CAS</text>
        <text fill="#7DD3FC" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="100" y="64">MV Caspian Dawn</text>
        <circle cx="250" cy="90" fill="#0F172A" r="22" stroke="#06B6D4" stroke-width="3"></circle>
        <circle cx="250" cy="90" fill="none" opacity="0.6" r="28" stroke="#06B6D4" stroke-dasharray="3 2" stroke-width="1.5"></circle>
        <text fill="#FFFFFF" font-family="JetBrains Mono" font-size="8.5" font-weight="bold" text-anchor="middle" x="250" y="93">POI-860</text>
        <text fill="#38BDF8" font-family="JetBrains Mono" font-size="9" font-weight="bold" text-anchor="middle" x="250" y="126">Griselda ARREDONDO (HUB)</text>
        <circle cx="390" cy="45" fill="#1E293B" r="14" stroke="#EF4444" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="390" y="48">ORG-SIN</text>
        <text fill="#FCA5A5" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="390" y="69">Sinaloa Arm</text>
        <circle cx="120" cy="140" fill="#1E293B" r="13" stroke="#F59E0B" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="120" y="143">ESC-PAN</text>
        <text fill="#FCD34D" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="120" y="162">Panama Escrow</text>
        <circle cx="380" cy="140" fill="#1E293B" r="13" stroke="#06B6D4" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="380" y="143">SEC-ROT</text>
        <text fill="#7DD3FC" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="380" y="162">Rotterdam Pier 9</text>
      `,
      citations: [
        '[1] <strong>AIS-SAT-DARK-09:</strong> Radar transponder suppression confirmed on MV Caspian Dawn at coordinates 34°12\'N 28°45\'E.',
        '[2] <strong>REC-FINCEN-2024-1102:</strong> Wire transfer $12,800,000 USD flagged through Panama offshore merchant depository.',
        '[3] <strong>AFFIDAVIT-SDNY-2024:</strong> Grand jury maritime seizure warrant filed SDNY 2024-GJ-8803, Agent M. Vance.'
      ],
      fbiPdfUrl: 'https://www.fbi.gov/wanted/cei/griselda-margarita-arredondo-pinzon/download.pdf',
      fbiGovUrl: 'https://www.fbi.gov/wanted/cei/griselda-margarita-arredondo-pinzon'
    },
    'POI-FBI-0074920': {
      id: 'POI-FBI-0074920',
      name: 'Bhadreshkumar Chetanbhai Patel',
      displayName: 'BHADRESHKUMAR PATEL',
      bounty: '$250,000 BOUNTY',
      bountyClass: 'bg-primary-container/30 text-primary border-primary/40',
      caseTitle: 'OPERATION BLACKTHORN // SUB-DOSSIER: FUGITIVE EVASION & FLIGHT',
      caseRef: 'CASE IDENTIFIER: CS-2024-8841 • CLASSIFIED ATTACHMENT \'PATEL-FLIGHT-01\'',
      subpoenaRef: 'GRAND JURY SUBPOENA\nREF: 2024-GJ-0074-DMD',
      statutoryClass: 'STATUTORY CLASS: 18 U.S.C. § 1073 / MD CRIM § 2-201',
      alertBadge: 'ALERT: ARMED & EXTREMELY DANGEROUS // FLIGHT RISK',
      photo: 'https://www.fbi.gov/wanted/topten/bhadreshkumar-chetanbhai-patel/@@images/image',
      ncic: 'NCIC #W007492-FBI',
      aliases: 'Bhadresh Patel, Bhadreshkumar C. Patel, Chetanbhai Patel',
      nationality: 'Indian',
      biometrics: {
        sex: 'Male',
        race: 'Asian / Indian',
        hair: 'Brown / Black',
        eyes: 'Brown',
        height: '5\'9" (175 cm)',
        weight: '165 lbs (75 kg)',
        pob: 'Kantrodi Ta Viramgam, Gujarat, India',
        dob: 'May 15, 1990',
        languages: 'English, Gujarati, Hindi',
        scars: 'None known. Known to employ forged identities.',
        warning: 'SHOULD BE CONSIDERED ARMED AND EXTREMELY DANGEROUS // TIES TO NJ/MD/INDIA'
      },
      operatingFronts: 'Cash Smurfing Syndicate • Newark Transit Facilitation Cell',
      bankingChannels: 'Newark Sub-Threshold Escrow • Structured Cash Clearing ($9,800 x 6)',
      statutoryExposure: '18 U.S.C. § 1073 (Flight to Avoid Prosecution) • Maryland Criminal Law § 2-201 (First-Degree Murder)',
      executiveSynthesis: `Fugitive interdiction telemetry traces <strong>Bhadreshkumar Chetanbhai PATEL (POI-FBI-0074920)</strong> through a decentralized transit and cash-smurfing support network across Maryland, New Jersey, and international flight corridors. Facilitator nodes in Newark and Baltimore provide rotating burner IMSIs and cross-border transit logistics. Topological analysis indicates Patel relies on rapid cell-hopping to evade automated border recognition biometric sweeps.`,
      clusterTitle: 'CLUSTER: FUGITIVE EVASION & CASH SMURFING CELL',
      graphResolution: '5 NODES • 5 EDGES • 2 TRANSIT COURIER VECTORS',
      networkSvg: `
        <line x1="250" y1="90" x2="100" y2="40" stroke="#F59E0B" stroke-dasharray="4 2" stroke-width="2"></line>
        <line x1="250" y1="90" x2="390" y2="45" stroke="#EF4444" stroke-width="2.5"></line>
        <line x1="250" y1="90" x2="380" y2="140" stroke="#06B6D4" stroke-width="2"></line>
        <line x1="250" y1="90" x2="120" y2="140" stroke="#A855F7" stroke-width="2"></line>
        <rect fill="#0F172A" height="14" rx="2" width="80" x="135" y="55"></rect>
        <text fill="#FCD34D" font-family="JetBrains Mono" font-size="8" font-weight="bold" text-anchor="middle" x="175" y="65">TRANSIT FACILITATOR</text>
        <circle cx="100" cy="40" fill="#1E293B" r="14" stroke="#F59E0B" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="100" y="43">POI-RAJ</text>
        <text fill="#FCD34D" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="100" y="64">R. Malhotra</text>
        <circle cx="250" cy="90" fill="#0F172A" r="22" stroke="#EF4444" stroke-width="3"></circle>
        <circle cx="250" cy="90" fill="none" opacity="0.6" r="28" stroke="#EF4444" stroke-dasharray="3 2" stroke-width="1.5"></circle>
        <text fill="#FFFFFF" font-family="JetBrains Mono" font-size="8.5" font-weight="bold" text-anchor="middle" x="250" y="93">POI-007</text>
        <text fill="#F87171" font-family="JetBrains Mono" font-size="9" font-weight="bold" text-anchor="middle" x="250" y="126">Bhadresh PATEL (HUB)</text>
        <circle cx="390" cy="45" fill="#1E293B" r="14" stroke="#EF4444" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="390" y="48">ORG-SMF</text>
        <text fill="#FCA5A5" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="390" y="69">Cash Smurfing</text>
        <circle cx="120" cy="140" fill="#1E293B" r="13" stroke="#A855F7" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="120" y="143">ESC-NWK</text>
        <text fill="#D8B4FE" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="120" y="162">Newark Escrow</text>
        <circle cx="380" cy="140" fill="#1E293B" r="13" stroke="#06B6D4" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="380" y="143">TEL-881</text>
        <text fill="#7DD3FC" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="380" y="162">Burner IMEI-88129</text>
      `,
      citations: [
        '[1] <strong>SIGINT-TWR-8812:</strong> Burner IMEI #3548920194 ping registered in Newark Transit Terminal sector.',
        '[2] <strong>CBP-PASS-0941:</strong> Biometric facial recognition match flag on commercial transit bus corridor.',
        '[3] <strong>AFFIDAVIT-DMD-2024:</strong> Federal unlawful flight warrant warrant filed District of Maryland 2024-GJ-0074.'
      ],
      fbiPdfUrl: 'https://www.fbi.gov/wanted/topten/bhadreshkumar-chetanbhai-patel/download.pdf',
      fbiGovUrl: 'https://www.fbi.gov/wanted/topten/bhadreshkumar-chetanbhai-patel'
    },
    'POI-FBI-5316323': {
      id: 'POI-FBI-5316323',
      name: 'Bernhard Eugen Fritsch',
      displayName: 'BERNHARD FRITSCH',
      bounty: '$150,000 BOUNTY',
      bountyClass: 'bg-secondary-container/30 text-secondary border-secondary/40',
      caseTitle: 'OPERATION BLACKTHORN // SUB-DOSSIER: SECURITIES FRAUD EXTRADITION',
      caseRef: 'CASE IDENTIFIER: CS-2024-8841 • CLASSIFIED ATTACHMENT \'STARCLUB-01\'',
      subpoenaRef: 'GRAND JURY SUBPOENA\nREF: 2024-GJ-5316-CDCA',
      statutoryClass: 'STATUTORY CLASS: 18 U.S.C. § 1343 / 18 U.S.C. § 3146',
      alertBadge: 'ALERT: CONVICTED FUGITIVE // ACTIVE RED NOTICE',
      photo: 'https://www.fbi.gov/wanted/most-wanted-fraudsters/bernhard-eugen-fritsch/@@images/image',
      ncic: 'NCIC #W531632-FBI',
      aliases: 'Bernhard Fritsch, Charles Wiest, Barnhard Eugen Fritsch',
      nationality: 'German',
      biometrics: {
        sex: 'Male',
        race: 'White',
        hair: 'Brown',
        eyes: 'Brown',
        height: '6\'2" (188 cm)',
        weight: '220 lbs (100 kg)',
        pob: 'Landshut, Germany',
        dob: 'July 27, 1961',
        languages: 'English, German',
        scars: 'Surgical scar on left knee.',
        warning: 'CONVICTED FEDERAL FUGITIVE // 15 YR SENTENCE IN ABSENTIA // $26.8M RESTITUTION'
      },
      operatingFronts: 'Starclub Inc. • Cayman Front Corp • Geneva Legal Chambers',
      bankingChannels: 'Zurich Depository Vault • Vektor Operating Account ($3.42M Escrow)',
      statutoryExposure: '18 U.S.C. § 1343 (Wire Fraud - 15 Yrs) • 18 U.S.C. § 3146 (Post-Conviction Flight)',
      executiveSynthesis: `Convicted federal fugitive <strong>Bernhard Eugen FRITSCH (POI-FBI-5316323)</strong> is subject to an active international red notice following his flight to Munich, Germany, after a 15-year federal prison sentence for a $35,000,000 securities fraud scheme. Graph analysis identifies structured wire conduits routing personal funds through Swiss depository vaults, Cayman front corporations, and Geneva legal accounts, bypassing the $26.8M federal restitution lien.`,
      clusterTitle: 'CLUSTER: SECURITIES FRAUD & SWISS ESCROW WASH',
      graphResolution: '6 NODES • 6 EDGES • 3 PRIVATE BANKING RAILS',
      networkSvg: `
        <line x1="250" y1="90" x2="100" y2="40" stroke="#06B6D4" stroke-width="2"></line>
        <line x1="250" y1="90" x2="390" y2="45" stroke="#F59E0B" stroke-width="2.5"></line>
        <line x1="250" y1="90" x2="380" y2="140" stroke="#06B6D4" stroke-width="2"></line>
        <line x1="250" y1="90" x2="120" y2="140" stroke="#A855F7" stroke-width="2"></line>
        <rect fill="#0F172A" height="14" rx="2" width="75" x="140" y="55"></rect>
        <text fill="#38BDF8" font-family="JetBrains Mono" font-size="8" font-weight="bold" text-anchor="middle" x="177" y="65">SWISS VAULT</text>
        <circle cx="100" cy="40" fill="#1E293B" r="14" stroke="#06B6D4" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="100" y="43">BNK-ZUR</text>
        <text fill="#7DD3FC" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="100" y="64">Zurich Vault</text>
        <circle cx="250" cy="90" fill="#0F172A" r="22" stroke="#06B6D4" stroke-width="3"></circle>
        <circle cx="250" cy="90" fill="none" opacity="0.6" r="28" stroke="#06B6D4" stroke-dasharray="3 2" stroke-width="1.5"></circle>
        <text fill="#FFFFFF" font-family="JetBrains Mono" font-size="8.5" font-weight="bold" text-anchor="middle" x="250" y="93">POI-531</text>
        <text fill="#38BDF8" font-family="JetBrains Mono" font-size="9" font-weight="bold" text-anchor="middle" x="250" y="126">Bernhard FRITSCH (HUB)</text>
        <circle cx="390" cy="45" fill="#1E293B" r="14" stroke="#F59E0B" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="390" y="48">ORG-STA</text>
        <text fill="#FCD34D" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="390" y="69">Starclub Inc.</text>
        <circle cx="120" cy="140" fill="#1E293B" r="13" stroke="#A855F7" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="120" y="143">ESC-CAY</text>
        <text fill="#D8B4FE" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="120" y="162">Cayman Front</text>
        <circle cx="380" cy="140" fill="#1E293B" r="13" stroke="#06B6D4" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="380" y="143">ORG-GEN</text>
        <text fill="#7DD3FC" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="380" y="162">Geneva Legal</text>
      `,
      citations: [
        '[1] <strong>JUDGMENT-CDCA-2025:</strong> Federal criminal restitution order $26,806,901 entered United States District Court CDCA.',
        '[2] <strong>INTERPOL-RN-MUNICH:</strong> Law enforcement detention notice from Munich police authorities.',
        '[3] <strong>AFFIDAVIT-CDCA-2024:</strong> Grand jury attestation filed CDCA 2024-GJ-5316, Agent M. Vance.'
      ],
      fbiPdfUrl: 'https://www.fbi.gov/wanted/most-wanted-fraudsters/bernhard-eugen-fritsch/download.pdf',
      fbiGovUrl: 'https://www.fbi.gov/wanted/most-wanted-fraudsters/bernhard-eugen-fritsch'
    },
    'POI-9042': {
      id: 'POI-9042',
      name: 'Dmitri Petrov',
      displayName: 'DMITRI M. PETROV',
      bounty: 'LEAD TARGET // $2.5M REWARD',
      bountyClass: 'bg-primary-container/30 text-primary border-primary/40',
      caseTitle: 'OPERATION BLACKTHORN: SYNTHETIC ILLICIT WEAPONS LOGISTICS NETWORK',
      caseRef: 'CASE IDENTIFIER: CS-2024-8841 • CLASSIFIED ATTACHMENT \'ALPHA-1\'',
      subpoenaRef: 'GRAND JURY SUBPOENA\nREF: 2024-GJ-4491-EDNY',
      statutoryClass: 'STATUTORY CLASS: 18 U.S.C. § 1956 / IEEPA',
      alertBadge: 'ALERT: FLIGHT RISK / ARMED ESCORT',
      photo: 'assets/images/img_2dcd2e2031.jpg',
      ncic: 'NCIC #88129-EU',
      aliases: '"The Falcon", D. P. Voronin, Nikolai Vancev',
      nationality: 'Russian Fed. / Cyprus (Golden Inv.)',
      biometrics: {
        sex: 'Male',
        race: 'White / Eastern European',
        hair: 'Cropped Dark Brown',
        eyes: 'Hazel / Gray',
        height: '5\'11" (180 cm)',
        weight: '185 lbs (84 kg)',
        pob: 'Odesa, Ukraine (SSR)',
        dob: 'August 19, 1974 (Age 49)',
        languages: 'Russian, Greek, English, German',
        scars: 'Linear scar on upper right forearm.',
        warning: 'CRITICAL RISK // ARMED EXECUTIVE PROTECTION ESCORT'
      },
      operatingFronts: 'Kestrel Holdings LLC (Limassol) • Nordic Marine Supply',
      bankingChannels: 'Commerzbank AG • SWIFT: COBA // Deutsche Bank ($3.42M)',
      statutoryExposure: '18 U.S.C. § 924(c) (Firearms Smuggling) • 50 U.S.C. § 1705 (IEEPA Violations)',
      executiveSynthesis: `Multi-source intelligence synthesized through the Nexus federated graph identifies a covert maritime and financial procurement nexus operating between Dubai (UAE), Limassol (Cyprus), and Kaliningrad. Key operative <strong>Dmitri PETROV (POI-9042)</strong> acts as the central financial bridge, orchestrating dual-use microelectronics and guided ordnance hardware movements masked through <strong>Kestrel Holdings LLC (ORG-884)</strong>. Centrality analysis demonstrates that severing Petrov's correspondent wire access dismantles approximately 78.4% of the Baltic transit channel.`,
      clusterTitle: 'CLUSTER: BALTIC COVERT CONDUIT 04',
      graphResolution: '5 NODES • 8 EDGES • 3 FIAT RAILS',
      networkSvg: `
        <line x1="250" y1="90" x2="100" y2="40" stroke="#06B6D4" stroke-dasharray="4 2" stroke-width="2"></line>
        <line x1="250" y1="90" x2="390" y2="45" stroke="#EF4444" stroke-width="2.5"></line>
        <line x1="250" y1="90" x2="380" y2="140" stroke="#06B6D4" stroke-dasharray="3 3" stroke-width="1.5"></line>
        <line x1="250" y1="90" x2="120" y2="140" stroke="#F59E0B" stroke-width="2"></line>
        <line x1="100" y1="40" x2="120" y2="140" stroke="#475569" stroke-width="1"></line>
        <rect fill="#0F172A" height="14" rx="2" width="60" x="145" y="55"></rect>
        <text fill="#38BDF8" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="175" y="65">$3.42M WIRE</text>
        <rect fill="#0F172A" height="14" rx="2" width="70" x="290" y="55"></rect>
        <text fill="#EF4444" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="325" y="65">MIL-SPEC RADAR</text>
        <circle cx="100" cy="40" fill="#1E293B" r="14" stroke="#06B6D4" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="100" y="43">ORG-884</text>
        <text fill="#94A3B8" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="100" y="64">Kestrel LLC</text>
        <circle cx="250" cy="90" fill="#0F172A" r="22" stroke="#EF4444" stroke-width="3"></circle>
        <circle cx="250" cy="90" fill="none" opacity="0.6" r="28" stroke="#EF4444" stroke-dasharray="3 2" stroke-width="1"></circle>
        <text fill="#FFFFFF" font-family="JetBrains Mono" font-size="9" font-weight="bold" text-anchor="middle" x="250" y="93">POI-9042</text>
        <text fill="#F87171" font-family="JetBrains Mono" font-size="9" font-weight="bold" text-anchor="middle" x="250" y="126">Dmitri PETROV (HUB)</text>
        <circle cx="390" cy="45" fill="#1E293B" r="14" stroke="#EF4444" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="390" y="48">POI-4412</text>
        <text fill="#FCA5A5" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="390" y="69">V. Reznov</text>
        <circle cx="120" cy="140" fill="#1E293B" r="13" stroke="#F59E0B" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="120" y="143">BNK-01</text>
        <text fill="#FCD34D" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="120" y="162">Commerzbank</text>
        <circle cx="380" cy="140" fill="#1E293B" r="13" stroke="#06B6D4" stroke-width="2"></circle>
        <text fill="#E2E8F0" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="380" y="143">VES-09</text>
        <text fill="#7DD3FC" font-family="JetBrains Mono" font-size="8" text-anchor="middle" x="380" y="162">M/V Baltic Star</text>
      `,
      citations: [
        '[1] <strong>REC-SWIFT-2024-0419:</strong> Transfer $3,420,000 USD from Kestrel Holdings (Cyprus) to Nordic Marine Supply. Verified by OFAC-SDN dispatch #884.',
        '[2] <strong>SIGINT-TWR-8942:</strong> Geolocation vector cross-verified with Baltic Star IMO #9142991 AIS blackout coordinate: 54°42\'N 19°54\'E.',
        '[3] <strong>AFFIDAVIT-VANCE-89:</strong> Grand Jury attestation under penalty of perjury filed EDNY 2024-GJ-4491, Agent M. Vance.'
      ],
      fbiPdfUrl: '#',
      fbiGovUrl: 'https://www.interpol.int/en/How-we-work/Notices/Red-Notices'
    }
  };

  let currentSuspectId = 'POI-FBI-7661467'; // Default to Ruja Ignatova ($5M Cryptoqueen)

  // 1. Initialize Report Generator
  function initDynamicReportGenerator() {
    // Check URL parameters for target POI
    const params = new URLSearchParams(window.location.search);
    const targetParam = params.get('id') || params.get('poi') || params.get('suspect');
    if (targetParam && (SUSPECT_DOSSIERS[targetParam] || targetParam.startsWith('POI-'))) {
      currentSuspectId = targetParam;
    }

    renderSuspectRibbon();
    loadAllSuspectsDropdown();
    hydrateSuspectReport(currentSuspectId);
    setupSectionToggles();
    setupTemplateSelector();
    setupClassificationSelector();
  }

  // 2. Render Suspect Switcher Ribbon
  function renderSuspectRibbon() {
    const ribbon = document.getElementById('report-suspect-ribbon');
    if (!ribbon) return;

    const suspects = [
      { id: 'POI-FBI-7661467', name: 'Ruja Ignatova', tag: '$5M BOUNTY' },
      { id: 'POI-FBI-5311090', name: 'Semion Mogilevich', tag: '$5M BOUNTY' },
      { id: 'POI-FBI-8603389', name: 'Griselda Arredondo', tag: '$2M BOUNTY' },
      { id: 'POI-FBI-0074920', name: 'Bhadresh Patel', tag: '$250K BOUNTY' },
      { id: 'POI-FBI-5316323', name: 'Bernhard Fritsch', tag: '$150K BOUNTY' },
      { id: 'POI-9042', name: 'Dmitri Petrov', tag: 'LEAD TARGET' }
    ];

    ribbon.innerHTML = suspects.map(s => {
      const isSelected = s.id === currentSuspectId;
      return `
        <button type="button" data-report-suspect-btn="${s.id}" onclick="window.switchReportSuspect('${s.id}')"
          class="px-2.5 py-1.5 rounded-lg text-left shrink-0 transition-all flex items-center gap-1.5 border text-xs font-mono ${
            isSelected
              ? 'bg-primary text-on-primary border-primary shadow-md font-bold'
              : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface border-outline-variant/30 hover:border-primary/40'
          }">
          <span class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-on-primary animate-ping' : 'bg-primary'}"></span>
          <span class="truncate">${s.name}</span>
          <span class="text-[9px] px-1 py-0.2 rounded ${isSelected ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-outline'}">${s.tag}</span>
        </button>
      `;
    }).join('');
  }

  // 3. Populate All Database Fugitives Dropdown
  async function loadAllSuspectsDropdown() {
    const sel = document.getElementById('report-all-suspects-select');
    if (!sel) return;

    try {
      const resp = await fetch('/api/entities?limit=100');
      if (!resp.ok) return;
      const data = await resp.json();
      const entities = data.entities || [];

      // Filter persons
      const persons = entities.filter(e => e.entity_type === 'person' || e.entity_type === 'Person' || (e.id && e.id.startsWith('POI-')));
      sel.innerHTML = persons.map(p => `
        <option value="${p.id}" ${p.id === currentSuspectId ? 'selected' : ''}>
          ${p.name} (${p.id}) — Risk: ${Math.round(p.risk_score || 75)}%
        </option>
      `).join('');

      sel.addEventListener('change', (e) => {
        window.switchReportSuspect(e.target.value);
      });
    } catch (e) {
      console.warn('[NEXUS REPORT] All suspects dropdown note:', e);
    }
  }

  // 4. Global Switch Suspect Function
  window.switchReportSuspect = async function(suspectId) {
    currentSuspectId = suspectId;
    renderSuspectRibbon();

    const sel = document.getElementById('report-all-suspects-select');
    if (sel && sel.value !== suspectId) {
      sel.value = suspectId;
    }

    if (SUSPECT_DOSSIERS[suspectId]) {
      applySuspectDossierToDoc(SUSPECT_DOSSIERS[suspectId]);
    } else {
      // Fetch dynamic suspect data from API
      try {
        const resp = await fetch(`/api/reports/suspect/${suspectId}`);
        if (resp.ok) {
          const data = await resp.json();
          const ent = data.entity;
          const bio = ent.fbi_details || {};
          const fallbackDossier = {
            id: ent.id,
            name: ent.name,
            displayName: ent.name.toUpperCase(),
            bounty: ent.reward_text ? `REWARD: ${ent.reward_text.slice(0, 20)}...` : 'ACTIVE WARRANT',
            bountyClass: 'bg-primary-container/30 text-primary border-primary/40',
            caseTitle: `OPERATION BLACKTHORN // SUB-DOSSIER: ${ent.name.toUpperCase()}`,
            caseRef: `CASE IDENTIFIER: CS-2024-8841 • ATTACHMENT \'${ent.id}\'`,
            subpoenaRef: data.subpoena_ref || `GRAND JURY SUBPOENA\nREF: 2024-GJ-${ent.id}`,
            statutoryClass: data.statutory_class || 'STATUTORY CLASS: 18 U.S.C. § 1956',
            alertBadge: ent.warning_message ? `ALERT: ${ent.warning_message.slice(0, 35)}` : 'ALERT: ACTIVE FEDERAL WARRANT',
            photo: ent.photo_url || 'assets/images/img_2dcd2e2031.jpg',
            ncic: `NCIC #${ent.id.replace('POI-', '')}-US`,
            aliases: Array.isArray(ent.aliases) ? ent.aliases.join(', ') : (ent.aliases || 'None recorded'),
            nationality: ent.nationality || 'Under Investigation',
            biometrics: {
              sex: ent.sex || bio.sex || 'Unknown',
              race: ent.race || bio.race || 'Unknown',
              hair: ent.hair || bio.hair || 'Unknown',
              eyes: ent.eyes || bio.eyes || 'Unknown',
              height: ent.height || bio.height || 'N/A',
              weight: ent.weight || bio.weight || 'N/A',
              pob: ent.place_of_birth || bio.place_of_birth || 'Under Investigation',
              dob: ent.dob || 'Unknown',
              languages: Array.isArray(bio.languages) ? bio.languages.join(', ') : 'English',
              scars: ent.scars_and_marks || bio.scars_and_marks || 'None cataloged',
              warning: ent.warning_message || bio.warning_message || 'ACTIVE FEDERAL WARRANT'
            },
            operatingFronts: data.operating_fronts || 'Transnational Logistics Shell',
            bankingChannels: data.banking_channels || 'Correspondent Escrow Clearing',
            statutoryExposure: data.statutory_exposure || '18 U.S.C. § 1956 (Money Laundering)',
            executiveSynthesis: data.executive_synthesis || ent.description || 'Subject is under active multi-jurisdictional federal investigation.',
            clusterTitle: data.cluster_title || `CLUSTER: ${ent.name.toUpperCase()} NETWORK`,
            graphResolution: data.graph_resolution || '5 NODES • 6 EDGES',
            networkSvg: SUSPECT_DOSSIERS['POI-9042'].networkSvg,
            citations: data.citations || [
              `[1] REC-FINCEN-2024: Suspicious activity report filed regarding subject ${ent.name}.`,
              `[2] SIGINT-TWR-4901: Intercepted cellular communications in operational sector.`,
              `[3] AFFIDAVIT-EDNY-2024: Formal grand jury filing, Agent M. Vance.`
            ],
            fbiPdfUrl: data.fbi_files && data.fbi_files.length > 0 ? data.fbi_files[0].url : '#',
            fbiGovUrl: data.fbi_url || '#'
          };
          applySuspectDossierToDoc(fallbackDossier);
        }
      } catch (e) {
        console.error('[NEXUS REPORT] Failed to fetch suspect report:', e);
      }
    }

    if (window.showTacticalToast) {
      window.showTacticalToast(`Judicial Brief Generated: ${currentSuspectId}`, 'success');
    }
  };

  function hydrateSuspectReport(suspectId) {
    window.switchReportSuspect(suspectId);
  }

  // 5. Apply Dossier to Document Preview
  function applySuspectDossierToDoc(d) {
    // Update Badge
    const badge = document.getElementById('report-target-bounty-badge');
    if (badge) {
      badge.textContent = d.bounty;
      badge.className = `px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${d.bountyClass}`;
    }

    // Header elements
    const caseTitle = document.getElementById('report-doc-case-title');
    if (caseTitle) caseTitle.textContent = d.caseTitle;

    const caseRef = document.getElementById('report-doc-case-ref');
    if (caseRef) caseRef.textContent = d.caseRef;

    const subpoenaRef = document.getElementById('report-doc-subpoena-ref');
    if (subpoenaRef) subpoenaRef.innerHTML = d.subpoenaRef.replace('\n', '<br />');

    // Section 1: Executive Synthesis
    const statutoryClass = document.getElementById('report-doc-statutory-class');
    if (statutoryClass) statutoryClass.textContent = d.statutoryClass;

    const execSynthesis = document.getElementById('report-doc-executive-synthesis');
    if (execSynthesis) execSynthesis.innerHTML = d.executiveSynthesis;

    // Section 2: Subject Profile
    const subjectName = document.getElementById('report-doc-subject-name');
    if (subjectName) subjectName.textContent = `PRIMARY SUBJECT: ${d.displayName}`;

    const subjectId = document.getElementById('report-doc-subject-id');
    if (subjectId) subjectId.textContent = d.id;

    const alertBadge = document.getElementById('report-doc-alert-badge');
    if (alertBadge) alertBadge.textContent = d.alertBadge;

    const photo = document.getElementById('report-doc-photo');
    if (photo) {
      photo.src = d.photo;
      photo.onerror = function() { this.src = 'assets/images/img_2dcd2e2031.jpg'; };
    }

    const ncic = document.getElementById('report-doc-ncic');
    if (ncic) ncic.textContent = d.ncic;

    const aliases = document.getElementById('report-doc-aliases');
    if (aliases) aliases.textContent = d.aliases;

    const nationality = document.getElementById('report-doc-nationality');
    if (nationality) nationality.textContent = d.nationality;

    const fronts = document.getElementById('report-doc-fronts');
    if (fronts) fronts.textContent = d.operatingFronts;

    const banking = document.getElementById('report-doc-banking');
    if (banking) banking.textContent = d.bankingChannels;

    const exposure = document.getElementById('report-doc-statutory-exposure');
    if (exposure) exposure.textContent = d.statutoryExposure;

    // Biometrics Card Grid
    const biometricsGrid = document.getElementById('report-doc-biometrics-grid');
    if (biometricsGrid) {
      const b = d.biometrics;
      biometricsGrid.innerHTML = `
        <div class="col-span-12 md:col-span-6 bg-slate-100 p-2 rounded border border-slate-200">
          <span class="text-slate-500 block text-[9px] font-bold uppercase">Physical Biometrics</span>
          <div class="grid grid-cols-2 gap-1 mt-1 text-[10px] text-slate-800">
            <div><span class="text-slate-500">Height:</span> <strong>${b.height}</strong></div>
            <div><span class="text-slate-500">Weight:</span> <strong>${b.weight}</strong></div>
            <div><span class="text-slate-500">Hair:</span> <strong>${b.hair}</strong></div>
            <div><span class="text-slate-500">Eyes:</span> <strong>${b.eyes}</strong></div>
            <div><span class="text-slate-500">Sex:</span> <strong>${b.sex}</strong></div>
            <div><span class="text-slate-500">Race:</span> <strong>${b.race}</strong></div>
          </div>
        </div>
        <div class="col-span-12 md:col-span-6 bg-slate-100 p-2 rounded border border-slate-200 flex flex-col justify-between">
          <div>
            <span class="text-slate-500 block text-[9px] font-bold uppercase">Identifying Traits & Warning</span>
            <div class="text-[10px] text-slate-800 mt-0.5"><span class="text-slate-500">POB / DOB:</span> <strong>${b.pob}</strong> (${b.dob})</div>
            <div class="text-[10px] text-slate-800"><span class="text-slate-500">Languages:</span> <strong>${b.languages}</strong></div>
            <div class="text-[10px] text-red-700 font-semibold mt-1">⚠️ ${b.warning}</div>
          </div>
          ${d.fbiPdfUrl && d.fbiPdfUrl !== '#' ? `
            <div class="mt-2 pt-1 border-t border-slate-300 flex items-center justify-between">
              <a href="${d.fbiPdfUrl}" target="_blank" class="inline-flex items-center gap-1 text-[9px] font-bold text-blue-700 hover:underline">
                <span>Official FBI PDF Poster</span> ↗
              </a>
              <a href="${d.fbiGovUrl}" target="_blank" class="text-[9px] text-slate-600 hover:underline">
                fbi.gov dossier ↗
              </a>
            </div>
          ` : ''}
        </div>
      `;
    }

    // Section 3: Topology Graphic
    const clusterTitle = document.getElementById('report-doc-cluster-title');
    if (clusterTitle) clusterTitle.textContent = d.clusterTitle;

    const graphResolution = document.getElementById('report-doc-graph-resolution');
    if (graphResolution) graphResolution.textContent = `GRAPH RESOLUTION: ${d.graphResolution}`;

    const svgTopology = document.getElementById('report-doc-svg-topology');
    if (svgTopology) {
      svgTopology.innerHTML = `
        <defs>
          <pattern height="20" id="briefing-grid-${d.id}" patternunits="userSpaceOnUse" width="20">
            <circle cx="2" cy="2" fill="#334155" opacity="0.3" r="1"></circle>
          </pattern>
        </defs>
        <rect fill="url(#briefing-grid-${d.id})" height="100%" width="100%"></rect>
        ${d.networkSvg}
      `;
    }

    // Section 5: Evidentiary Citations
    const citationsContainer = document.getElementById('report-doc-citations');
    if (citationsContainer) {
      citationsContainer.innerHTML = `
        <div class="font-bold text-slate-800 text-[10.5px]">EVIDENTIARY CITATION INDEX &amp; SUBPOENA LOG:</div>
        ${d.citations.map(c => `<div>${c}</div>`).join('')}
      `;
    }
  }

  // 6. Section Toggle Checkboxes (Executive, Profile, Network, Finance, Citations)
  function setupSectionToggles() {
    const toggles = [
      { cbId: 'cb-section-exec', targetId: 'section-doc-exec' },
      { cbId: 'cb-section-profile', targetId: 'section-doc-profile' },
      { cbId: 'cb-section-network', targetId: 'section-doc-network' },
      { cbId: 'cb-section-finance', targetId: 'section-doc-finance' },
      { cbId: 'cb-section-citations', targetId: 'section-doc-citations' }
    ];

    toggles.forEach(t => {
      const cb = document.getElementById(t.cbId);
      const target = document.getElementById(t.targetId);
      if (cb && target) {
        cb.addEventListener('change', () => {
          target.style.display = cb.checked ? '' : 'none';
          updatePageCount();
          if (window.showTacticalToast) {
            window.showTacticalToast(`Section [${target.getAttribute('data-section-name') || t.targetId}]: ${cb.checked ? 'Visible' : 'Hidden'}`, 'info');
          }
        });
      }
    });
  }

  function updatePageCount() {
    let visibleSections = 0;
    ['section-doc-exec', 'section-doc-profile', 'section-doc-network', 'section-doc-finance', 'section-doc-citations'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.style.display !== 'none') visibleSections++;
    });
    const pageCountEl = document.getElementById('report-doc-page-count');
    if (pageCountEl) {
      const totalPages = Math.max(1, Math.ceil(visibleSections * 1.6));
      pageCountEl.textContent = `PAGE 1 OF ${totalPages}`;
    }
  }

  // 7. Operational Report Templates
  function setupTemplateSelector() {
    document.querySelectorAll('[data-report-template]').forEach(tpl => {
      tpl.addEventListener('click', () => {
        document.querySelectorAll('[data-report-template]').forEach(t => {
          t.className = 'p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface cursor-pointer flex flex-col gap-1 transition-all border border-transparent';
        });
        tpl.className = 'p-space-sm rounded-lg bg-surface-container-high text-primary cursor-pointer flex flex-col gap-1 transition-all shadow-sm border border-primary/30 font-bold';

        const tplName = tpl.getAttribute('data-report-template');
        applyTemplatePreset(tplName);
      });
    });
  }

  function applyTemplatePreset(tplName) {
    const setCb = (id, checked) => {
      const cb = document.getElementById(id);
      if (cb) {
        cb.checked = checked;
        cb.dispatchEvent(new Event('change'));
      }
    };

    if (tplName === 'grand-jury') {
      setCb('cb-section-exec', true);
      setCb('cb-section-profile', true);
      setCb('cb-section-network', true);
      setCb('cb-section-finance', true);
      setCb('cb-section-citations', true);
    } else if (tplName === 'executive-summary') {
      setCb('cb-section-exec', true);
      setCb('cb-section-profile', true);
      setCb('cb-section-network', false);
      setCb('cb-section-finance', false);
      setCb('cb-section-citations', false);
    } else if (tplName === 'tactical-pack') {
      setCb('cb-section-exec', false);
      setCb('cb-section-profile', true);
      setCb('cb-section-network', true);
      setCb('cb-section-finance', false);
      setCb('cb-section-citations', false);
    } else if (tplName === 'chain-custody') {
      setCb('cb-section-exec', false);
      setCb('cb-section-profile', false);
      setCb('cb-section-network', false);
      setCb('cb-section-finance', true);
      setCb('cb-section-citations', true);
    }
  }

  // 8. Security Classification Selector
  function setupClassificationSelector() {
    const sel = document.getElementById('report-classification-select');
    if (!sel) return;

    sel.addEventListener('change', (e) => {
      const val = e.target.value;
      const watermark = document.getElementById('report-doc-classification-watermark');
      const headerStamp = document.getElementById('report-doc-classification-header');
      const footerStamp = document.getElementById('report-doc-classification-footer');

      if (watermark) watermark.textContent = val;
      if (headerStamp) headerStamp.textContent = val;
      if (footerStamp) footerStamp.textContent = val;

      if (window.showTacticalToast) {
        window.showTacticalToast(`Document Classification: ${val}`, 'warning');
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDynamicReportGenerator);
  } else {
    initDynamicReportGenerator();
  }

})();
