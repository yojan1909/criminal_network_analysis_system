/**
 * Nexus Intelligence Command Center - Interactive Network Graph Controller
 * Real-Time Suspect Topology Engine with Live FBI Wanted Intelligence Feeds
 * Features dynamic operational SVG particle animations tailored per criminal
 */

(function () {
  'use strict';

  // Suspect Network Datasets with FBI Biometrics & Dynamic Animation Profiles
  const SUSPECT_TOPOLOGIES = {
    'POI-FBI-7661467': {
      id: 'POI-FBI-7661467',
      name: 'Ruja Ignatova',
      aliasTitle: 'Cryptoqueen / Dr. Ruja',
      bounty: '$5,000,000 FBI REWARD',
      badgeClass: 'bg-error-container/60 text-error border border-error animate-pulse',
      noticeText: 'FBI Top Ten Most Wanted',
      type: 'Person of Interest',
      subtitle: 'POI-FBI-7661467 // FBI TOP 10 // $5M BOUNTY',
      photo: 'https://www.fbi.gov/wanted/topten/ruja-ignatova/@@images/image',
      statusDot: 'bg-error',
      aliases: '"Cryptoqueen", Dr. Ruja, Ruja Ignatova-Bayer',
      ncic: '#88129-FBI-WANTED',
      citizenship: 'Bulgarian / German (Forged Passports)',
      clearance: 'ACTIVE RED NOTICE / EXTRADITION WARRANT',
      linksCount: 28,
      centrality: '0.98 (Top 0.1% Hub)',
      velocity: '+46% (Surging)',
      clusterStatus: 'CLUSTER: ONECOIN CRYPTO CONDUIT • 14 NODES | 28 EDGES',
      statsText: '14 Nodes | 28 Edges',
      animationType: 'crypto-pulse',
      biometrics: {
        sex: 'Female',
        race: 'White',
        hair: 'Dark Brown / Dyed Black',
        eyes: 'Brown',
        height: '5\'7" (170 cm)',
        weight: '130 lbs (59 kg)',
        pob: 'Ruse, Bulgaria',
        dob: 'May 30, 1980',
        languages: 'English, Bulgarian, German',
        warning: 'SHOULD BE CONSIDERED ARMED AND DANGEROUS // TRAVELS WITH ARMED GUARDS'
      },
      fbiPdfUrl: 'https://www.fbi.gov/wanted/topten/ruja-ignatova/download.pdf',
      fbiGovUrl: 'https://www.fbi.gov/wanted/topten/ruja-ignatova',
      analystNote: 'Ignatova is the central orchestrator of the OneCoin cryptocurrency pyramid scheme exceeding $4B USD. Active financial topology demonstrates continuous multi-million dollar offshore structurings routed through Baltic-X escrow conduits, Cayman shell trusts, and European proxy accounts.',
      centerNode: {
        title: 'RUJA IGNATOVA',
        sub: 'FBI TOP 10 • $5M BOUNTY (0.98 HUB)',
        color: '#22D3EE',
        pulseColor: '#06B6D4'
      },
      nodes: [
        { id: 'ORG-ONECOIN', name: 'OneCoin Ltd (HQ)', sub: 'CORP-ONECOIN', type: 'Org', color: '#A855F7', icon: 'domain', x: 230, y: 130, r: 22, role: 'Corporate Vehicle (100% Beneficial Owner)', conf: '99%' },
        { id: 'BNK-3002', name: 'Baltic-X Escrow', sub: 'BNK-3002', type: 'Bank', color: '#EC4899', icon: 'account_balance', x: 530, y: 130, r: 20, role: '$50M+ Crypto Layering Wire Rail', conf: '98%' },
        { id: 'ORG-6023', name: 'Baltic-X Holding Ltd', sub: 'ORG-6023', type: 'Org', color: '#A855F7', icon: 'corporate_fare', x: 600, y: 250, r: 21, role: 'Offshore Shell Logistics Front', conf: '95%' },
        { id: 'BNK-CAYMAN', name: 'Cayman Trust Escrow', sub: 'BNK-CAYMAN', type: 'Bank', color: '#EC4899', icon: 'savings', x: 520, y: 370, r: 19, role: 'Layering Reserve Shell Account', conf: '94%' },
        { id: 'LOC-4011', name: 'Limassol Port Terminal', sub: 'LOC-4011', type: 'Location', color: '#10B981', icon: 'anchor', x: 380, y: 440, r: 20, role: 'Maritime Safehouse & Courier Corridor', conf: '91%' },
        { id: 'POI-9042', name: 'Dmitri Petrov', sub: 'POI-9042', type: 'Person', color: '#22D3EE', icon: 'person', x: 240, y: 370, r: 21, role: 'Offshore Financial Co-Conspirator', conf: '92%' },
        { id: 'PHN-SATCOM', name: 'Encrypted Sat-Phone', sub: '+971 50 892 4110', type: 'Phone', color: '#EAB308', icon: 'cell_tower', x: 150, y: 240, r: 18, role: 'Dubai Satellite Relay Terminal', conf: '89%' },
        { id: 'VEH-G650', name: 'Gulfstream G650', sub: 'TAIL: N-904Q', type: 'Vehicle', color: '#F97316', icon: 'flight', x: 670, y: 370, r: 17, role: 'Charter Flight Manifest Node', conf: '87%' },
        { id: 'LOC-SOFIA', name: 'Sofia Operations Bunker', sub: 'LOC-SOFIA', type: 'Location', color: '#10B981', icon: 'apartment', x: 140, y: 130, r: 17, role: 'Initial Operational Staging Base', conf: '88%' }
      ],
      edges: [
        { x1: 380, y1: 240, x2: 230, y2: 130, color: '#22D3EE', width: 3.5, glow: true, particleColor: '#22D3EE', dur: '1.8s', label: { text: '$4.2B ONECOIN', color: '#22D3EE', x: 275, y: 170, w: 85 } },
        { x1: 380, y1: 240, x2: 530, y2: 130, color: '#EC4899', width: 3.5, dash: '6 4', particleColor: '#EC4899', dur: '2.2s', label: { text: '$50M ESCROW WIRE', color: '#F472B6', x: 420, y: 170, w: 100 } },
        { x1: 380, y1: 240, x2: 600, y2: 250, color: '#22D3EE', width: 3.0, glow: true, particleColor: '#38BDF8', dur: '2.5s', label: { text: 'BENEFICIAL OWNER', color: '#22D3EE', x: 450, y: 235, w: 100 } },
        { x1: 380, y1: 240, x2: 520, y2: 370, color: '#EC4899', width: 2.5, dash: '4 4' },
        { x1: 380, y1: 240, x2: 380, y2: 440, color: '#10B981', width: 3.0, particleColor: '#10B981', dur: '3.0s', label: { text: 'CYPRUS ESCAPE ROUTE', color: '#34D399', x: 320, y: 335, w: 120 } },
        { x1: 380, y1: 240, x2: 240, y2: 370, color: '#22D3EE', width: 2.5, label: { text: 'CO-CONSPIRATOR', color: '#38BDF8', x: 260, y: 295, w: 90 } },
        { x1: 380, y1: 240, x2: 150, y2: 240, color: '#EAB308', width: 2.5, particleColor: '#EAB308', dur: '1.5s', label: { text: 'SAT-PHONE LINK', color: '#FACC15', x: 215, y: 230, w: 90 } },
        { x1: 530, y1: 130, x2: 600, y2: 250, color: '#334155', width: 2.0 },
        { x1: 600, y1: 250, x2: 670, y2: 370, color: '#F97316', width: 1.8 },
        { x1: 240, y1: 370, x2: 380, y2: 440, color: '#334155', width: 2.0 },
        { x1: 230, y1: 130, x2: 140, y2: 130, color: '#334155', width: 2.0 }
      ]
    },

    'POI-FBI-5311090': {
      id: 'POI-FBI-5311090',
      name: 'Semion Mogilevich',
      aliasTitle: 'Brainy Don / Solntsevskaya Boss',
      bounty: '$5,000,000 FBI REWARD',
      badgeClass: 'bg-error-container/60 text-error border border-error animate-pulse',
      noticeText: 'FBI Most Wanted // Organized Crime',
      type: 'Person of Interest',
      subtitle: 'POI-FBI-5311090 // FBI MOST WANTED // $5M BOUNTY',
      photo: 'https://www.fbi.gov/wanted/cei/semion-mogilevich/@@images/image',
      statusDot: 'bg-error',
      aliases: '"Brainy Don", Don Semyon, Semen Judkovich Mogilevich',
      ncic: '#89410-FBI-WANTED',
      citizenship: 'Russian / Ukrainian / Israeli',
      clearance: 'INTERPOL RED NOTICE // RICO INDICTMENT',
      linksCount: 34,
      centrality: '0.97 (Strategic Apex)',
      velocity: '+41% (Surging)',
      clusterStatus: 'CLUSTER: TRANSNATIONAL SYNDICATE • 15 NODES | 32 EDGES',
      statsText: '15 Nodes | 32 Edges',
      animationType: 'syndicate-radar',
      biometrics: {
        sex: 'Male',
        race: 'White',
        hair: 'Grey / Balding',
        eyes: 'Green / Hazel',
        height: '5\'6" to 5\'7" (168 cm)',
        weight: '290 lbs (131 kg)',
        pob: 'Kyiv, Ukraine',
        dob: 'June 30, 1946',
        languages: 'Russian, Ukrainian, Hebrew',
        warning: 'SHOULD BE CONSIDERED ARMED AND DANGEROUS // EXTENSIVE SYNDICATE SECURITY'
      },
      fbiPdfUrl: 'https://www.fbi.gov/wanted/cei/semion-mogilevich/download.pdf',
      fbiGovUrl: 'https://www.fbi.gov/wanted/cei/semion-mogilevich',
      analystNote: 'Mogilevich is the strategic apex controller of an extensive transnational organized crime syndicate. Utilizes front freight logistics corporations (Vektor Logistics) and international energy conduits to execute multi-million dollar investor fraud and arms brokerage.',
      centerNode: {
        title: 'SEMION MOGILEVICH',
        sub: 'FBI MOST WANTED • $5M BOUNTY (0.97 HUB)',
        color: '#EF4444',
        pulseColor: '#DC2626'
      },
      nodes: [
        { id: 'ORG-SYNDICATE', name: 'Solntsevskaya Enterprise', sub: 'TRANSNATIONAL-RICO', type: 'Org', color: '#A855F7', icon: 'corporate_fare', x: 230, y: 130, r: 23, role: 'Command & Control Enterprise Hub', conf: '99%' },
        { id: 'ORG-5519', name: 'Vektor Logistics GmbH', sub: 'ORG-5519', type: 'Org', color: '#A855F7', icon: 'domain', x: 530, y: 130, r: 21, role: 'Primary Front Freight Shell', conf: '97%' },
        { id: 'BNK-3001', name: 'Vektor Operating Acct', sub: 'BNK-3001', type: 'Bank', color: '#EC4899', icon: 'account_balance', x: 610, y: 250, r: 20, role: 'SWIFT $3.42M Transit Laundering Rail', conf: '96%' },
        { id: 'LOC-4055', name: 'Frankfurt Escrow Office', sub: 'LOC-4055', type: 'Location', color: '#10B981', icon: 'pin_drop', x: 520, y: 380, r: 19, role: 'Western Financial Escrow Base', conf: '93%' },
        { id: 'POI-4455', name: 'Sergei Volkov', sub: 'POI-4455', type: 'Person', color: '#22D3EE', icon: 'person', x: 380, y: 440, r: 21, role: 'Operational Syndicate Enforcer', conf: '97%' },
        { id: 'POI-9042', name: 'Dmitri Petrov', sub: 'POI-9042', type: 'Person', color: '#22D3EE', icon: 'person', x: 240, y: 370, r: 20, role: 'Arms & Sanctions Transit Broker', conf: '91%' },
        { id: 'LOC-BUDAPEST', name: 'Budapest Gas Corridor', sub: 'LOC-BUDAPEST', type: 'Location', color: '#10B981', icon: 'factory', x: 150, y: 240, r: 19, role: 'Gas Transit Securities Pipeline', conf: '90%' },
        { id: 'PHN-IMEI9941', name: 'Burner IMEI-9941', sub: 'IMEI-9941', type: 'Phone', color: '#EAB308', icon: 'smartphone', x: 680, y: 170, r: 17, role: 'Synchronized Encrypted Burst Link', conf: '88%' },
        { id: 'ORG-MAGNEX', name: 'YBM Magnex Shell Corp', sub: 'CORP-MAGNEX', type: 'Org', color: '#A855F7', icon: 'domain', x: 130, y: 360, r: 18, role: 'Public Stock Manipulation Shell', conf: '92%' }
      ],
      edges: [
        { x1: 380, y1: 240, x2: 230, y2: 130, color: '#A855F7', width: 3.5, glow: true, particleColor: '#C084FC', dur: '1.9s', label: { text: '100% CONTROLLER', color: '#C084FC', x: 265, y: 170, w: 95 } },
        { x1: 380, y1: 240, x2: 530, y2: 130, color: '#EF4444', width: 3.5, glow: true, particleColor: '#EF4444', dur: '1.6s', label: { text: 'CONTROLLING SHELL', color: '#F87171', x: 420, y: 170, w: 105 } },
        { x1: 380, y1: 240, x2: 610, y2: 250, color: '#EC4899', width: 3.5, dash: '6 4', particleColor: '#EC4899', dur: '2.0s', label: { text: '$3.42M WIRE RAIL', color: '#F472B6', x: 460, y: 235, w: 95 } },
        { x1: 380, y1: 240, x2: 380, y2: 440, color: '#22D3EE', width: 3.0, particleColor: '#22D3EE', dur: '2.4s', label: { text: 'CHIEF ENFORCER', color: '#22D3EE', x: 330, y: 335, w: 90 } },
        { x1: 380, y1: 240, x2: 240, y2: 370, color: '#22D3EE', width: 2.5, label: { text: 'TACTICAL BROKER', color: '#38BDF8', x: 260, y: 295, w: 95 } },
        { x1: 380, y1: 240, x2: 150, y2: 240, color: '#10B981', width: 2.5, particleColor: '#10B981', dur: '2.8s', label: { text: 'GAS CORRIDOR', color: '#34D399', x: 220, y: 230, w: 85 } },
        { x1: 530, y1: 130, x2: 610, y2: 250, color: '#334155', width: 2.0 },
        { x1: 610, y1: 250, x2: 520, y2: 380, color: '#334155', width: 2.0 },
        { x1: 380, y1: 440, x2: 240, y2: 370, color: '#334155', width: 2.0 },
        { x1: 230, y1: 130, x2: 130, y2: 360, color: '#334155', width: 2.0 },
        { x1: 530, y1: 130, x2: 680, y2: 170, color: '#EAB308', width: 1.8 }
      ]
    },

    'POI-FBI-8603389': {
      id: 'POI-FBI-8603389',
      name: 'Griselda Margarita Arredondo Pinzón',
      aliasTitle: 'La Madrina / Maritime Cartel Coordinator',
      bounty: '$2,000,000 FBI REWARD',
      badgeClass: 'bg-error-container/60 text-error border border-error animate-pulse',
      noticeText: 'FBI Narcotics Most Wanted',
      type: 'Person of Interest',
      subtitle: 'POI-FBI-8603389 // FBI NARCOTICS // $2M BOUNTY',
      photo: 'https://www.fbi.gov/wanted/cei/griselda-margarita-arredondo-pinzon/@@images/image',
      statusDot: 'bg-error',
      aliases: '"La Madrina", Griselda Pinzon, Arredondo-Pinzon',
      ncic: '#89812-FBI-NARCOTICS',
      citizenship: 'Colombian / Mexican',
      clearance: 'INTERPOL RED NOTICE // EXTRADITION SOUGHT',
      linksCount: 22,
      centrality: '0.96 (Maritime Hub)',
      velocity: '+35% (High)',
      clusterStatus: 'CLUSTER: MARITIME CARTEL CORRIDOR • 12 NODES | 24 EDGES',
      statsText: '12 Nodes | 24 Edges',
      animationType: 'maritime-drift',
      biometrics: {
        sex: 'Female',
        race: 'Hispanic',
        hair: 'Dark Brown / Black',
        eyes: 'Brown',
        height: '5\'4" (163 cm)',
        weight: '145 lbs (66 kg)',
        pob: 'Cali, Colombia',
        dob: 'March 14, 1974',
        languages: 'Spanish, English',
        warning: 'SHOULD BE CONSIDERED ARMED AND DANGEROUS // HEAVY CARTEL NARCO-CORRIDOR'
      },
      fbiPdfUrl: 'https://www.fbi.gov/wanted/cei/griselda-margarita-arredondo-pinzon/download.pdf',
      fbiGovUrl: 'https://www.fbi.gov/wanted/cei/griselda-margarita-arredondo-pinzon',
      analystNote: 'Primary coordinator for maritime narcotics shipments utilizing chartered commercial container vessels. Corroborated intelligence links subject to MV Caspian Dawn transponder dark events off Limassol port and structured settlements via Panama escrow corporations.',
      centerNode: {
        title: 'GRISELDA ARREDONDO',
        sub: 'FBI NARCOTICS • $2M BOUNTY (0.96 HUB)',
        color: '#F97316',
        pulseColor: '#EA580C'
      },
      nodes: [
        { id: 'ORG-CARTEL', name: 'Sinaloa Maritime Arm', sub: 'CARTEL-LOGISTICS', type: 'Org', color: '#A855F7', icon: 'corporate_fare', x: 240, y: 130, r: 22, role: 'Supply Syndicate Pipeline', conf: '98%' },
        { id: 'VEH-2201', name: 'MV Caspian Dawn', sub: 'VEH-2201', type: 'Vehicle', color: '#F97316', icon: 'directions_boat', x: 520, y: 130, r: 21, role: 'AIS Dark Monitored Cargo Vessel', conf: '94%' },
        { id: 'LOC-4011', name: 'Limassol Port Terminal', sub: 'LOC-4011', type: 'Location', color: '#10B981', icon: 'anchor', x: 600, y: 250, r: 20, role: 'Primary Container Transshipment Pier', conf: '92%' },
        { id: 'ORG-6023', name: 'Baltic-X Holding Ltd', sub: 'ORG-6023', type: 'Org', color: '#A855F7', icon: 'domain', x: 510, y: 370, r: 20, role: 'Commercial Container Lease Proxy', conf: '89%' },
        { id: 'LOC-ROTTERDAM', name: 'Rotterdam Cold Pier 9', sub: 'LOC-ROTTERDAM', type: 'Location', color: '#10B981', icon: 'warehouse', x: 380, y: 440, r: 20, role: 'Northern Europe Drug Dispersal Hub', conf: '91%' },
        { id: 'PHN-BURNER32', name: 'Burner SIM #32-489', sub: '+32 489 12 9042', type: 'Phone', color: '#EAB308', icon: 'cell_tower', x: 240, y: 370, r: 18, role: 'Cellular Base Tower Switch Link', conf: '88%' },
        { id: 'BNK-PANAMA', name: 'Panama Escrow Trading', sub: 'BNK-PANAMA', type: 'Bank', color: '#EC4899', icon: 'account_balance', x: 150, y: 240, r: 20, role: 'Direct Narcotics Wire Settlement', conf: '95%' },
        { id: 'POI-9042', name: 'Dmitri Petrov', sub: 'POI-9042', type: 'Person', color: '#22D3EE', icon: 'person', x: 680, y: 340, r: 19, role: 'Port Freight Clearing Expeditor', conf: '87%' }
      ],
      edges: [
        { x1: 380, y1: 240, x2: 240, y2: 130, color: '#A855F7', width: 3.5, glow: true, particleColor: '#C084FC', dur: '2.0s', label: { text: 'DIRECT DISPATCH', color: '#C084FC', x: 270, y: 170, w: 95 } },
        { x1: 380, y1: 240, x2: 520, y2: 130, color: '#F97316', width: 3.5, particleColor: '#F97316', dur: '2.6s', label: { text: 'CHARTERED VESSEL', color: '#FB923C', x: 420, y: 170, w: 105 } },
        { x1: 380, y1: 240, x2: 600, y2: 250, color: '#10B981', width: 3.0, particleColor: '#10B981', dur: '3.0s', label: { text: 'CARGO ARRIVAL', color: '#34D399', x: 460, y: 235, w: 90 } },
        { x1: 380, y1: 240, x2: 510, y2: 370, color: '#A855F7', width: 2.5, label: { text: 'CONTAINER LEASE', color: '#C084FC', x: 410, y: 300, w: 95 } },
        { x1: 380, y1: 240, x2: 150, y2: 240, color: '#EC4899', width: 3.5, dash: '6 4', particleColor: '#EC4899', dur: '1.8s', label: { text: '$12.8M SETTLEMENT', color: '#F472B6', x: 210, y: 230, w: 105 } },
        { x1: 380, y1: 240, x2: 240, y2: 370, color: '#EAB308', width: 2.5, label: { text: 'ENCRYPTED SMS', color: '#FACC15', x: 260, y: 295, w: 85 } },
        { x1: 520, y1: 130, x2: 600, y2: 250, color: '#F97316', width: 2.2 },
        { x1: 600, y1: 250, x2: 380, y2: 440, color: '#334155', width: 2.0 },
        { x1: 510, y1: 370, x2: 680, y2: 340, color: '#334155', width: 1.8 }
      ]
    },

    'POI-FBI-0074920': {
      id: 'POI-FBI-0074920',
      name: 'Bhadreshkumar Chetanbhai Patel',
      aliasTitle: 'FBI Ten Most Wanted // Fugitive Flight',
      bounty: '$250,000 FBI REWARD',
      badgeClass: 'bg-primary-container/60 text-primary border border-primary animate-pulse',
      noticeText: 'FBI Ten Most Wanted Fugitive',
      type: 'Person of Interest',
      subtitle: 'POI-FBI-0074920 // FBI TEN MOST WANTED // $250K',
      photo: 'https://www.fbi.gov/wanted/topten/bhadreshkumar-chetanbhai-patel/@@images/image',
      statusDot: 'bg-error',
      aliases: 'Bhadresh Patel, Bhadreshkumar C. Patel, Chetanbhai Patel',
      ncic: '#W007492-FBI-WANTED',
      citizenship: 'Indian (International Flight)',
      clearance: 'UNLAWFUL FLIGHT TO AVOID PROSECUTION',
      linksCount: 18,
      centrality: '0.91 (Evasion Transit Hub)',
      velocity: '+29% (Active)',
      clusterStatus: 'CLUSTER: FUGITIVE EVASION & CASH SMURFING CELL • 8 NODES | 16 EDGES',
      statsText: '8 Nodes | 16 Edges',
      animationType: 'evasion-hops',
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
        warning: 'SHOULD BE CONSIDERED ARMED AND EXTREMELY DANGEROUS'
      },
      fbiPdfUrl: 'https://www.fbi.gov/wanted/topten/bhadreshkumar-chetanbhai-patel/download.pdf',
      fbiGovUrl: 'https://www.fbi.gov/wanted/topten/bhadreshkumar-chetanbhai-patel',
      analystNote: 'Patel is wanted for unlawful flight to avoid prosecution for first-degree murder. The active graph tracks rotating burner device activations, structured cash smurfing transactions under the $10,000 Bank Secrecy Act threshold, and illicit transit hubs in Newark and Baltimore.',
      centerNode: {
        title: 'BHADRESHKUMAR PATEL',
        sub: 'FBI TOP 10 • $250K BOUNTY (0.91 HUB)',
        color: '#F59E0B',
        pulseColor: '#D97706'
      },
      nodes: [
        { id: 'ORG-SMURF', name: 'Cash Smurfing Syndicate', sub: 'MONEY-LAUNDERING', type: 'Org', color: '#A855F7', icon: 'payments', x: 240, y: 130, r: 21, role: 'Structured Deposits Facilitator', conf: '96%' },
        { id: 'LOC-NEWARK', name: 'Newark Transit Station', sub: 'LOC-NEWARK', type: 'Location', color: '#10B981', icon: 'directions_bus', x: 520, y: 130, r: 20, role: 'Last Confirmed Visual Vector', conf: '97%' },
        { id: 'PHN-BURNER88', name: 'Burner IMEI-88129', sub: 'IMEI-88129', type: 'Phone', color: '#EAB308', icon: 'smartphone', x: 600, y: 250, r: 18, role: 'Cellular Tower Intercept Sector', conf: '92%' },
        { id: 'BNK-NWK', name: 'Newark Sub-Threshold Escrow', sub: 'BNK-NWK', type: 'Bank', color: '#EC4899', icon: 'account_balance', x: 510, y: 370, r: 19, role: 'Structured Cash Clearing Account', conf: '94%' },
        { id: 'POI-COURIER', name: 'Transit Facilitator (Malhotra)', sub: 'POI-MALHOTRA', type: 'Person', color: '#22D3EE', icon: 'person', x: 380, y: 440, r: 20, role: 'Cross-Border Smuggling Courier', conf: '88%' },
        { id: 'LOC-BALTIMORE', name: 'Baltimore Safehouse', sub: 'LOC-BALTIMORE', type: 'Location', color: '#10B981', icon: 'home', x: 240, y: 370, r: 19, role: 'Staging Node for Domestic Evasion', conf: '89%' },
        { id: 'VEH-VAN', name: 'Ford Transit Van', sub: 'PLATE: MD-8921', type: 'Vehicle', color: '#F97316', icon: 'directions_car', x: 150, y: 240, r: 17, role: 'Interstate Transport Vehicle', conf: '91%' }
      ],
      edges: [
        { x1: 380, y1: 240, x2: 240, y2: 130, color: '#A855F7', width: 3.5, glow: true, particleColor: '#C084FC', dur: '1.2s', label: { text: '$9,800 CASH SMURF', color: '#C084FC', x: 260, y: 170, w: 95 } },
        { x1: 380, y1: 240, x2: 520, y2: 130, color: '#10B981', width: 3.5, particleColor: '#10B981', dur: '1.0s', label: { text: 'TERMINAL TRANSIT', color: '#34D399', x: 420, y: 170, w: 95 } },
        { x1: 380, y1: 240, x2: 600, y2: 250, color: '#EAB308', width: 2.5, particleColor: '#EAB308', dur: '0.8s', label: { text: 'BURST PING', color: '#FACC15', x: 460, y: 235, w: 85 } },
        { x1: 380, y1: 240, x2: 510, y2: 370, color: '#EC4899', width: 2.5, dash: '4 4' },
        { x1: 380, y1: 240, x2: 380, y2: 440, color: '#22D3EE', width: 2.5, particleColor: '#22D3EE', dur: '1.4s', label: { text: 'COURIER DISPATCH', color: '#38BDF8', x: 330, y: 335, w: 95 } },
        { x1: 380, y1: 240, x2: 240, y2: 370, color: '#10B981', width: 2.5, label: { text: 'SAFEHOUSE', color: '#34D399', x: 260, y: 295, w: 85 } },
        { x1: 380, y1: 240, x2: 150, y2: 240, color: '#F97316', width: 2.5, particleColor: '#F97316', dur: '1.5s' },
        { x1: 520, y1: 130, x2: 600, y2: 250, color: '#334155', width: 2.0 }
      ]
    },

    'POI-9042': {
      id: 'POI-9042',
      name: 'Dmitri Petrov',
      aliasTitle: 'The Falcon / Baltic Logistics Broker',
      bounty: 'LEAD TARGET CS-2024-8841',
      badgeClass: 'bg-primary-container/40 text-primary border border-primary',
      noticeText: 'Operation Blackthorn Core Target',
      type: 'Person of Interest',
      subtitle: 'POI-9042 // TIER-1 PRIORITY // BALTIC BROKER',
      photo: 'assets/images/img_2dcd2e2031.jpg',
      statusDot: 'bg-primary',
      aliases: '"The Falcon", D. P. Voronin, Dmitri Reznikov',
      ncic: '#88129-EU-X',
      citizenship: 'Russian / Cyprus (Golden Passport)',
      clearance: 'WARRANT ISSUED [UNODC / FRE 902(11)]',
      linksCount: 24,
      centrality: '0.94 (Highest 1%)',
      velocity: '+38% (Surging)',
      clusterStatus: 'CLUSTER: BALTIC COVERT CONDUIT 04 • 11 NODES | 22 EDGES',
      statsText: '11 Nodes | 22 Edges',
      animationType: 'tactical-covert',
      biometrics: {
        sex: 'Male',
        race: 'White',
        hair: 'Dark Brown / Cropped',
        eyes: 'Grey / Blue',
        height: '6\'0" (183 cm)',
        weight: '185 lbs (84 kg)',
        pob: 'Kaliningrad, Russia',
        dob: 'April 19, 1978',
        languages: 'Russian, English, Greek',
        warning: 'ARMED ESCORT ADVISED // HIGH VALUE STRATEGIC LOGISTICS BROKER'
      },
      fbiPdfUrl: '#',
      fbiGovUrl: 'https://www.interpol.int/en/How-we-work/Notices/Red-Notices',
      analystNote: 'Petrov operates as the critical structural bottleneck between maritime logistics entities in the North Sea and offshore conduit accounts in Limassol. Severing node POI-9042 isolates 62% of identified shell transactions.',
      centerNode: {
        title: 'DMITRI PETROV',
        sub: 'HUB - 0.94 CENTRALITY (CS-2024-8841)',
        color: '#22D3EE',
        pulseColor: '#06B6D4'
      },
      nodes: [
        { id: 'ORG-8821', name: 'Kestrel Holdings LLC', sub: 'CORP-8821', type: 'Org', color: '#A855F7', icon: 'domain', x: 270, y: 150, r: 22, role: 'Primary Front Shell Holding', conf: '98%' },
        { id: 'VEH-9821', name: 'Vessel Baltic-X', sub: 'IMO-9821415', type: 'Vehicle', color: '#F97316', icon: 'directions_boat', x: 480, y: 300, r: 20, role: 'Chartered Electronics Carrier', conf: '95%' },
        { id: 'BNK-COMM', name: 'IBAN DE89...4401', sub: 'COMMERZBANK', type: 'Bank', color: '#EC4899', icon: 'account_balance', x: 420, y: 440, r: 18, role: 'Direct $3.42M Conduit Rail', conf: '94%' },
        { id: 'PHN-BELGIUM', name: '+32 489 12 9042', sub: 'ENC-SIM', type: 'Phone', color: '#EAB308', icon: 'call', x: 490, y: 120, r: 17, role: 'Primary Intercepted Line', conf: '91%' },
        { id: 'LOC-ANTWERP', name: 'Antwerp WH-12', sub: 'LOC-ANTWERP', type: 'Location', color: '#10B981', icon: 'location_on', x: 310, y: 340, r: 18, role: 'Staging Logistics Depot', conf: '92%' },
        { id: 'POI-4412', name: 'Viktor Reznov', sub: 'POI-4412', type: 'Person', color: '#22D3EE', icon: 'person', x: 200, y: 170, r: 18, role: 'Illicit Dual-Use Hardware Broker', conf: '89%' }
      ],
      edges: [
        { x1: 380, y1: 240, x2: 270, y2: 150, color: '#22D3EE', width: 3.5, glow: true, particleColor: '#22D3EE', dur: '1.8s', label: { text: '98% OWNERSHIP', color: '#22D3EE', x: 295, y: 170, w: 85 } },
        { x1: 380, y1: 240, x2: 480, y2: 300, color: '#22D3EE', width: 3.5, glow: true, particleColor: '#38BDF8', dur: '2.0s', label: { text: 'CARGO CHARTER', color: '#22D3EE', x: 425, y: 250, w: 85 } },
        { x1: 380, y1: 240, x2: 420, y2: 440, color: '#EC4899', width: 3.5, dash: '6 4', particleColor: '#EC4899', dur: '1.5s', label: { text: '$3.4M WIRE', color: '#F472B6', x: 385, y: 340, w: 75 } },
        { x1: 380, y1: 240, x2: 490, y2: 120, color: '#EAB308', width: 2.5, particleColor: '#EAB308', dur: '1.2s' },
        { x1: 380, y1: 240, x2: 310, y2: 340, color: '#10B981', width: 2.0, label: { text: 'WAREHOUSE DEPOT', color: '#34D399', x: 300, y: 280, w: 95 } },
        { x1: 380, y1: 240, x2: 200, y2: 170, color: '#38BDF8', width: 2.0 },
        { x1: 200, y1: 170, x2: 270, y2: 150, color: '#334155', width: 1.8 }
      ]
    },

    'POI-FBI-5316323': {
      id: 'POI-FBI-5316323',
      name: 'Bernhard Eugen Fritsch',
      aliasTitle: 'White Collar Securities Fraud Extradition',
      bounty: '$150,000 FBI REWARD',
      badgeClass: 'bg-secondary-container/60 text-secondary border border-secondary animate-pulse',
      noticeText: 'FBI White Collar Most Wanted',
      type: 'Person of Interest',
      subtitle: 'POI-FBI-5316323 // FBI WHITE COLLAR // $150K',
      photo: 'https://www.fbi.gov/wanted/most-wanted-fraudsters/bernhard-eugen-fritsch/@@images/image',
      statusDot: 'bg-secondary',
      aliases: 'Bernhard Fritsch, Charles Wiest, Barnhard Eugen Fritsch',
      ncic: '#W531632-FBI-WANTED',
      citizenship: 'German (Fled Post-Conviction)',
      clearance: 'INTERPOL RED NOTICE // 15 YR SENTENCE',
      linksCount: 16,
      centrality: '0.89 (Securities Shell Hub)',
      velocity: '+22% (Active)',
      clusterStatus: 'CLUSTER: SECURITIES FRAUD & SWISS ESCROW WASH • 9 NODES | 18 EDGES',
      statsText: '9 Nodes | 18 Edges',
      animationType: 'securities-glide',
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
        warning: 'CONVICTED FEDERAL FUGITIVE // ACTIVE RED NOTICE // RESTITUTION LIEN'
      },
      fbiPdfUrl: 'https://www.fbi.gov/wanted/most-wanted-fraudsters/bernhard-eugen-fritsch/download.pdf',
      fbiGovUrl: 'https://www.fbi.gov/wanted/most-wanted-fraudsters/bernhard-eugen-fritsch',
      analystNote: 'Subject wanted for complex securities manipulation, fraudulent market making, and moving illicit yields across Swiss and Cayman numbered accounts. Intercepted routing indicates wire settlement through Vektor Logistics financial conduits.',
      centerNode: {
        title: 'BERNHARD FRITSCH',
        sub: 'FBI WHITE COLLAR • $150K (0.89 HUB)',
        color: '#22D3EE',
        pulseColor: '#06B6D4'
      },
      nodes: [
        { id: 'BNK-ZURICH', name: 'Zurich Depository Bank', sub: 'BNK-ZURICH', type: 'Bank', color: '#EC4899', icon: 'account_balance', x: 240, y: 130, r: 21, role: 'Private Numbered Reserve Account', conf: '95%' },
        { id: 'BNK-3001', name: 'Vektor Operating Acct', sub: 'BNK-3001', type: 'Bank', color: '#EC4899', icon: 'account_balance', x: 520, y: 130, r: 20, role: 'Securities Wire Settlement Rail', conf: '93%' },
        { id: 'LOC-4055', name: 'Frankfurt Escrow Office', sub: 'LOC-4055', type: 'Location', color: '#10B981', icon: 'apartment', x: 600, y: 250, r: 19, role: 'Securities Brokerage Filing Office', conf: '92%' },
        { id: 'ORG-CAYMAN', name: 'Cayman Front Corp LLC', sub: 'ORG-CAYMAN', type: 'Org', color: '#A855F7', icon: 'domain', x: 510, y: 370, r: 20, role: 'Offshore Holding Shell Company', conf: '91%' },
        { id: 'POI-9042', name: 'Dmitri Petrov', sub: 'POI-9042', type: 'Person', color: '#22D3EE', icon: 'person', x: 380, y: 440, r: 20, role: 'Offshore Conduit Signatory', conf: '89%' },
        { id: 'LOC-GENEVA', name: 'Geneva Legal Chambers', sub: 'LOC-GENEVA', type: 'Location', color: '#10B981', icon: 'gavel', x: 240, y: 370, r: 18, role: 'Fiduciary Proxy Representation', conf: '88%' },
        { id: 'PHN-SWISS', name: 'Encrypted Swiss Mobile', sub: '+41 79 411 9002', type: 'Phone', color: '#EAB308', icon: 'smartphone', x: 150, y: 240, r: 17, role: 'Encrypted SIP Protocol Phone', conf: '87%' }
      ],
      edges: [
        { x1: 380, y1: 240, x2: 240, y2: 130, color: '#EC4899', width: 3.5, dash: '6 4', particleColor: '#EC4899', dur: '1.8s', label: { text: '$8.4M RESERVE', color: '#F472B6', x: 260, y: 170, w: 85 } },
        { x1: 380, y1: 240, x2: 520, y2: 130, color: '#EC4899', width: 3.0, particleColor: '#F472B6', dur: '2.1s', label: { text: 'SETTLEMENT RAIL', color: '#F472B6', x: 420, y: 170, w: 95 } },
        { x1: 380, y1: 240, x2: 600, y2: 250, color: '#10B981', width: 2.5, particleColor: '#10B981', dur: '2.6s', label: { text: 'BROKERAGE FILING', color: '#34D399', x: 460, y: 235, w: 95 } },
        { x1: 380, y1: 240, x2: 510, y2: 370, color: '#A855F7', width: 2.5, label: { text: 'HOLDING SHELL', color: '#C084FC', x: 410, y: 300, w: 85 } },
        { x1: 380, y1: 240, x2: 380, y2: 440, color: '#22D3EE', width: 2.5, particleColor: '#22D3EE', dur: '2.4s', label: { text: 'CONDUIT BROKER', color: '#38BDF8', x: 330, y: 335, w: 90 } },
        { x1: 380, y1: 240, x2: 150, y2: 240, color: '#EAB308', width: 2.0, label: { text: 'SWISS SIP PING', color: '#FACC15', x: 220, y: 230, w: 85 } },
        { x1: 240, y1: 130, x2: 240, y2: 370, color: '#334155', width: 1.8 }
      ]
    }
  };

  let activeSuspectId = 'POI-FBI-7661467';
  let currentZoom = 1.0;

  // Initialize Network Explorer
  function initNetworkExplorer() {
    if (!window.location.pathname.includes('network-explorer')) return;

    renderSuspectRibbon();

    // Check URL parameter e.g. ?id=...
    const urlParams = new URLSearchParams(window.location.search);
    const paramId = urlParams.get('id') || urlParams.get('poi') || urlParams.get('suspect');
    if (paramId && SUSPECT_TOPOLOGIES[paramId]) {
      activeSuspectId = paramId;
    } else {
      activeSuspectId = 'POI-FBI-7661467';
    }

    renderSuspectNetwork(activeSuspectId);
    setupZoomAndPan();
    setupAnalysisButtons();
    setupSearchSync();
  }

  // 1. Render Suspect Ribbon Selector
  function renderSuspectRibbon() {
    const ribbon = document.getElementById('suspect-network-selector-ribbon');
    if (!ribbon) return;

    const suspectsList = [
      { id: 'POI-FBI-7661467', name: 'Ruja Ignatova', badge: '$5M Bounty', tag: 'Cryptoqueen' },
      { id: 'POI-FBI-5311090', name: 'Semion Mogilevich', badge: '$5M Bounty', tag: 'Syndicate' },
      { id: 'POI-FBI-8603389', name: 'Griselda Arredondo', badge: '$2M Bounty', tag: 'Cartel' },
      { id: 'POI-FBI-0074920', name: 'Bhadreshkumar Patel', badge: '$250K Bounty', tag: 'Ten Most Wanted' },
      { id: 'POI-9042', name: 'Dmitri Petrov', badge: 'Tier-1 Lead', tag: 'Operation Blackthorn' },
      { id: 'POI-FBI-5316323', name: 'Bernhard Fritsch', badge: '$150K Bounty', tag: 'Securities' }
    ];

    ribbon.innerHTML = suspectsList.map(s => {
      const isSelected = s.id === activeSuspectId;
      return `
        <button type="button" data-suspect-btn="${s.id}" onclick="window.renderSuspectNetwork('${s.id}')"
          class="px-3 py-1.5 rounded text-left shrink-0 transition-all flex items-center gap-2 border cursor-pointer ${
            isSelected
              ? 'bg-primary text-on-primary border-primary shadow-md font-bold'
              : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface border-outline-variant/40 hover:border-primary/50'
          }">
          <span class="w-2 h-2 rounded-full ${isSelected ? 'bg-on-primary animate-ping' : 'bg-primary'}"></span>
          <span class="font-headline-sm text-body-sm font-semibold">${s.name}</span>
          <span class="px-1.5 py-0.2 rounded text-[10px] font-data-mono-sm ${
            isSelected ? 'bg-black/20 text-on-primary' : 'bg-surface-container text-amber-300 border border-amber-400/30'
          }">${s.badge}</span>
        </button>
      `;
    }).join('');
  }

  // 2. Render Suspect Network Graph & Populate Inspector
  function renderSuspectNetwork(suspectId) {
    const data = SUSPECT_TOPOLOGIES[suspectId] || SUSPECT_TOPOLOGIES['POI-FBI-7661467'];
    activeSuspectId = suspectId;

    // Update Ribbon active state
    document.querySelectorAll('[data-suspect-btn]').forEach(btn => {
      const bId = btn.getAttribute('data-suspect-btn');
      const isSelected = bId === suspectId;
      btn.className = `px-3 py-1.5 rounded text-left shrink-0 transition-all flex items-center gap-2 border cursor-pointer ${
        isSelected
          ? 'bg-primary text-on-primary border-primary shadow-md font-bold'
          : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface border-outline-variant/40 hover:border-primary/50'
      }`;
      const pingDot = btn.querySelector('span');
      if (pingDot) {
        pingDot.className = `w-2 h-2 rounded-full ${isSelected ? 'bg-on-primary animate-ping' : 'bg-primary'}`;
      }
    });

    // Update Stats Badge and Cluster Status
    const statsBadge = document.getElementById('network-stats-badge');
    if (statsBadge) statsBadge.textContent = data.statsText;

    const clusterStatus = document.getElementById('network-cluster-status');
    if (clusterStatus) {
      clusterStatus.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span> ${data.clusterStatus}`;
    }

    // Render SVG Elements with Criminal-Specific Animations
    renderSvgTopology(data);

    // Update Inspector Dossier Panel immediately with curated intelligence
    updateInspectorPanel(data);

    // Concurrently fetch Live Real-Time database & FBI API updates
    fetchLiveEntityData(suspectId);

    if (window.showTacticalToast) {
      window.showTacticalToast(`Topology Reprojected: ${data.name} (${data.bounty})`, 'info');
    }
  }

  // 3. Render SVG Content with Criminal-Specific Dynamic Particle Animations
  function renderSvgTopology(data) {
    const container = document.getElementById('network-graph-content');
    if (!container) return;

    let svgHtml = '';

    // Style defs for smooth dash flows
    svgHtml += `
      <style>
        @keyframes nexusFlow {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
        .nexus-animated-wire {
          stroke-dasharray: 6 4;
          animation: nexusFlow 1.5s linear infinite;
        }
        .nexus-radar-spin {
          transform-origin: 380px 240px;
          animation: spin 16s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    // A. EDGES (Lines & Paths)
    svgHtml += '<g stroke-linecap="round">';
    data.edges.forEach((edge, idx) => {
      const isGlow = edge.glow ? 'filter="url(#cyan-glow)"' : '';
      const isDash = edge.dash ? `stroke-dasharray="${edge.dash}" class="nexus-animated-wire"` : '';
      svgHtml += `
        <line id="edge-${data.id}-${idx}" x1="${edge.x1}" y1="${edge.y1}" x2="${edge.x2}" y2="${edge.y2}"
          stroke="${edge.color}" stroke-width="${edge.width || 2}" ${isGlow} ${isDash}></line>
      `;
    });
    svgHtml += '</g>';

    // B. DYNAMIC PARTICLE ANIMATIONS (Particles flowing along edges based on criminal telemetry)
    svgHtml += '<g id="svg-particles-group">';
    data.edges.forEach((edge, idx) => {
      if (edge.particleColor) {
        const pathData = `M ${edge.x1} ${edge.y1} L ${edge.x2} ${edge.y2}`;
        const duration = edge.dur || '2.0s';
        svgHtml += `
          <circle r="3.5" fill="${edge.particleColor}" opacity="0.9" filter="url(#cyan-glow)">
            <animateMotion path="${pathData}" dur="${duration}" repeatCount="indefinite" />
          </circle>
        `;
      }
    });
    svgHtml += '</g>';

    // C. EDGE LABELS
    svgHtml += '<g fill="#94A3B8" font-family="JetBrains Mono" font-size="9">';
    data.edges.forEach(edge => {
      if (edge.label) {
        const lbl = edge.label;
        svgHtml += `
          <rect fill="#0A0E13" height="15" opacity="0.9" rx="2" width="${lbl.w || 80}" x="${lbl.x}" y="${lbl.y}"></rect>
          <text fill="${lbl.color || '#22D3EE'}" font-weight="600" x="${lbl.x + 5}" y="${lbl.y + 11}">${lbl.text}</text>
        `;
      }
    });
    svgHtml += '</g>';

    // D. PERIPHERAL NODES
    svgHtml += '<g id="svg-nodes-group">';
    data.nodes.forEach(node => {
      svgHtml += `
        <g class="cursor-pointer group" onclick="window.inspectNetworkNode('${node.id}')" data-node-id="${node.id}">
          <circle cx="${node.x}" cy="${node.y}" fill="#1C2025" r="${node.r || 20}" stroke="${node.color}" stroke-width="2.2" class="transition-all hover:stroke-white"></circle>
          <text fill="${node.color}" font-family="Material Symbols Outlined" font-size="15" text-anchor="middle" x="${node.x}" y="${node.y + 5}">${node.icon}</text>
          <text fill="#E0E2EA" font-family="Inter" font-size="10.5" font-weight="600" text-anchor="middle" x="${node.x}" y="${node.y + 30}">${node.name}</text>
          <text fill="#94A3B8" font-family="JetBrains Mono" font-size="8.5" text-anchor="middle" x="${node.x}" y="${node.y + 42}">${node.sub}</text>
        </g>
      `;
    });
    svgHtml += '</g>';

    // E. CENTRAL TARGET HUB NODE (With Dynamic Concentric Radar/Beacon Rings)
    const center = data.centerNode;
    svgHtml += `
      <g class="cursor-pointer" filter="url(#alert-glow)" onclick="window.inspectNetworkNode('CENTER')" data-node-id="CENTER">
        <!-- Rotating outer dashed perimeter -->
        <circle cx="380" cy="240" fill="none" r="46" stroke="${center.color}" stroke-dasharray="4 4" stroke-width="1.2" class="nexus-radar-spin" opacity="0.6"></circle>
        <!-- Pulsing animated halo circle -->
        <circle cx="380" cy="240" fill="${center.pulseColor || center.color}" fill-opacity="0.2">
          <animate attributeName="r" values="32;50;32" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0.1;0.7" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="380" cy="240" fill="#0A0E13" r="28" stroke="${center.color}" stroke-width="2.5"></circle>
        <text fill="${center.color}" font-family="Material Symbols Outlined" font-size="22" text-anchor="middle" x="380" y="247">person_alert</text>
        <!-- Target Hub Label Block -->
        <rect fill="#141A21" height="20" rx="3" stroke="${center.color}" stroke-width="1.2" width="180" x="290" y="282"></rect>
        <text fill="${center.color}" font-family="IBM Plex Sans" font-size="10.5" font-weight="700" text-anchor="middle" x="380" y="296">${center.title}</text>
        <text fill="#5DE6FF" font-family="JetBrains Mono" font-size="9" font-weight="600" text-anchor="middle" x="380" y="315">${center.sub}</text>
      </g>
    `;

    container.innerHTML = svgHtml;
  }

  // 4. Update Inspector Panel
  function updateInspectorPanel(data) {
    const mugshot = document.getElementById('inspector-mugshot');
    if (mugshot) {
      mugshot.src = data.photo;
      mugshot.onerror = function () { this.src = 'assets/images/analyst-vance.png'; };
    }

    const nameEl = document.getElementById('inspector-name');
    if (nameEl) nameEl.textContent = data.name;

    const idTag = document.getElementById('inspector-id-tag');
    if (idTag) idTag.textContent = data.subtitle;

    const noticeBadge = document.getElementById('inspector-notice-badge');
    if (noticeBadge) {
      noticeBadge.className = `px-2 py-0.5 rounded font-label-md text-label-md uppercase font-bold flex items-center gap-1 ${data.badgeClass || 'bg-error-container/40 text-error'}`;
      noticeBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span> ${data.bounty}`;
    }

    const aliasesEl = document.getElementById('inspector-aliases');
    if (aliasesEl) aliasesEl.textContent = data.aliases;

    const ncicEl = document.getElementById('inspector-ncic');
    if (ncicEl) ncicEl.textContent = data.ncic;

    const citizenshipEl = document.getElementById('inspector-citizenship');
    if (citizenshipEl) citizenshipEl.textContent = data.citizenship;

    const clearanceEl = document.getElementById('inspector-clearance');
    if (clearanceEl) clearanceEl.textContent = data.clearance;

    const linksCount = document.getElementById('inspector-links-count');
    if (linksCount) linksCount.textContent = data.linksCount;

    const centralityVal = document.getElementById('inspector-centrality-val');
    if (centralityVal) centralityVal.textContent = data.centrality;

    const velocityVal = document.getElementById('inspector-velocity-val');
    if (velocityVal) velocityVal.textContent = data.velocity;

    const noteEl = document.getElementById('inspector-analyst-note');
    if (noteEl) noteEl.textContent = data.analystNote;

    // Direct Action: Generate Judicial Briefing
    const reportBtn = document.getElementById('inspector-report-btn');
    if (reportBtn) {
      reportBtn.href = `report-generator.html?id=${data.id}`;
      reportBtn.innerHTML = `
        <span class="material-symbols-outlined text-[18px]">gavel</span>
        <span>Generate Judicial Briefing (${data.name.split(' ')[0]})</span>
      `;
    }

    // Direct Action: Pivot to Entity Profiles
    const pivotBtn = document.getElementById('inspector-pivot-btn');
    if (pivotBtn) {
      pivotBtn.href = `entity-profiles.html?id=${data.id}`;
      pivotBtn.innerHTML = `<span class="material-symbols-outlined text-[16px]">badge</span><span>Pivot to ${data.name.split(' ')[0]}'s Full Dossier</span>`;
    }

    // Populate FBI Biometrics Card
    if (data.biometrics) {
      const b = data.biometrics;
      const bHeight = document.getElementById('inspector-bio-height');
      if (bHeight) bHeight.textContent = b.height || 'N/A';

      const bWeight = document.getElementById('inspector-bio-weight');
      if (bWeight) bWeight.textContent = b.weight || 'N/A';

      const bHair = document.getElementById('inspector-bio-hair');
      if (bHair) bHair.textContent = b.hair || 'N/A';

      const bEyes = document.getElementById('inspector-bio-eyes');
      if (bEyes) bEyes.textContent = b.eyes || 'N/A';

      const bSex = document.getElementById('inspector-bio-sex');
      if (bSex) bSex.textContent = b.sex || 'N/A';

      const bRace = document.getElementById('inspector-bio-race');
      if (bRace) bRace.textContent = b.race || 'N/A';

      const bPob = document.getElementById('inspector-bio-pob');
      if (bPob) bPob.textContent = `${b.pob || 'Under Investigation'} (${b.dob || 'Unknown'})`;

      const bWarnText = document.getElementById('inspector-bio-warning-text');
      if (bWarnText) bWarnText.textContent = b.warning || 'ACTIVE FEDERAL WARRANT';

      const pdfLink = document.getElementById('inspector-fbi-pdf-link');
      if (pdfLink) {
        if (data.fbiPdfUrl && data.fbiPdfUrl !== '#') {
          pdfLink.href = data.fbiPdfUrl;
          pdfLink.style.display = 'inline-flex';
        } else {
          pdfLink.style.display = 'none';
        }
      }

      const govLink = document.getElementById('inspector-fbi-gov-link');
      if (govLink) {
        govLink.href = data.fbiGovUrl || 'https://www.fbi.gov/wanted';
      }
    }

    // Populate Direct Relationships list
    const relTitle = document.getElementById('inspector-relationships-title');
    if (relTitle) relTitle.textContent = `Direct Relationships (${data.nodes.length})`;

    const relList = document.getElementById('inspector-relationships-list');
    if (relList) {
      relList.innerHTML = data.nodes.map(n => `
        <div class="flex items-center justify-between p-2 rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer" onclick="window.inspectNetworkNode('${n.id}')">
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${n.color};"></span>
            <div class="flex flex-col min-w-0">
              <span class="font-body-sm text-body-sm text-on-surface font-medium truncate">${n.name}</span>
              <span class="font-data-mono-sm text-[10px] text-outline truncate">${n.role}</span>
            </div>
          </div>
          <span class="font-data-mono-sm text-data-mono-sm text-secondary font-bold shrink-0 ml-2">${n.conf}</span>
        </div>
      `).join('');
    }
  }

  // 5. Fetch Live Real-Time Data from Backend API
  async function fetchLiveEntityData(entityId) {
    try {
      const resp = await fetch(`/api/entities/${entityId}`);
      if (!resp.ok) return;
      const resJson = await resp.json();
      const entity = resJson.entity || resJson;
      if (!entity || !entity.id) return;

      const fbi = entity.fbi_details || {};
      const syncBadge = document.getElementById('inspector-fbi-sync-badge');
      if (syncBadge) {
        syncBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> LIVE FBI SYNCED`;
        syncBadge.className = 'font-data-mono-sm text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-1.5 py-0.2 rounded flex items-center gap-1';
      }

      // If photo was empty or local, use authentic FBI photo
      if (entity.photo_url) {
        const mugshot = document.getElementById('inspector-mugshot');
        if (mugshot) mugshot.src = entity.photo_url;
      }

      // If there are real-time biometrics, apply them
      if (entity.height) {
        const el = document.getElementById('inspector-bio-height');
        if (el) el.textContent = entity.height;
      }
      if (entity.weight) {
        const el = document.getElementById('inspector-bio-weight');
        if (el) el.textContent = entity.weight;
      }
      if (entity.hair) {
        const el = document.getElementById('inspector-bio-hair');
        if (el) el.textContent = entity.hair;
      }
      if (entity.eyes) {
        const el = document.getElementById('inspector-bio-eyes');
        if (el) el.textContent = entity.eyes;
      }
      if (entity.place_of_birth) {
        const el = document.getElementById('inspector-bio-pob');
        if (el) el.textContent = `${entity.place_of_birth} (${entity.dob || fbi.dates_of_birth_used?.[0] || 'DOB Cataloged'})`;
      }
      if (entity.warning_message) {
        const el = document.getElementById('inspector-bio-warning-text');
        if (el) el.textContent = entity.warning_message;
      }
    } catch (e) {
      console.warn('[NEXUS GRAPH] Live API sync note:', e);
    }
  }

  // 6. Inspect specific sub-node
  window.inspectNetworkNode = function (nodeId) {
    const data = SUSPECT_TOPOLOGIES[activeSuspectId] || SUSPECT_TOPOLOGIES['POI-FBI-7661467'];

    if (nodeId === 'CENTER') {
      updateInspectorPanel(data);
      if (window.showTacticalToast) window.showTacticalToast(`Target Hub Selected: ${data.name}`, 'info');
      return;
    }

    const node = data.nodes.find(n => n.id === nodeId);
    if (!node) return;

    // Highlight node in SVG
    const allCircles = document.querySelectorAll('#svg-nodes-group circle');
    allCircles.forEach(c => {
      c.style.stroke = '';
      c.style.strokeWidth = '';
    });
    const clickedNodeG = document.querySelector(`[data-node-id="${nodeId}"] circle`);
    if (clickedNodeG) {
      clickedNodeG.style.stroke = '#ffffff';
      clickedNodeG.style.strokeWidth = '3.5px';
    }

    // Temporary Inspector focus
    const nameEl = document.getElementById('inspector-name');
    if (nameEl) nameEl.textContent = node.name;

    const idTag = document.getElementById('inspector-id-tag');
    if (idTag) idTag.textContent = `${node.id} // ${node.type.toUpperCase()}`;

    const noteEl = document.getElementById('inspector-analyst-note');
    if (noteEl) noteEl.textContent = `Connected node in ${data.name}'s network: ${node.role} (Corroborated confidence: ${node.conf}). Direct edge linked into primary target infrastructure.`;

    if (window.showTacticalToast) {
      window.showTacticalToast(`Inspecting Sub-Node: ${node.name} (${node.conf} Conf)`, 'info');
    }
  };

  // 7. Zoom and Pan Controls
  function setupZoomAndPan() {
    const svg = document.getElementById('network-graph-svg');
    if (!svg) return;

    const zoomInBtn = document.getElementById('btn-zoom-in');
    const zoomOutBtn = document.getElementById('btn-zoom-out');
    const zoomFitBtn = document.getElementById('btn-zoom-fit');
    const zoomResetBtn = document.getElementById('btn-zoom-reset');

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        currentZoom = Math.min(currentZoom + 0.25, 2.5);
        applyScale();
      });
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        currentZoom = Math.max(currentZoom - 0.25, 0.5);
        applyScale();
      });
    }
    if (zoomResetBtn || zoomFitBtn) {
      const resetHandler = () => {
        currentZoom = 1.0;
        applyScale();
        if (window.showTacticalToast) window.showTacticalToast('Graph Viewport Reset to 100%', 'info');
      };
      if (zoomResetBtn) zoomResetBtn.addEventListener('click', resetHandler);
      if (zoomFitBtn) zoomFitBtn.addEventListener('click', resetHandler);
    }

    function applyScale() {
      svg.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      svg.style.transform = `scale(${currentZoom})`;
      svg.style.transformOrigin = 'center center';
    }
  }

  // 8. Analysis & Influencer Buttons
  function setupAnalysisButtons() {
    const infBtn = document.getElementById('btn-analysis-influencers');
    if (infBtn) {
      infBtn.addEventListener('click', () => {
        const data = SUSPECT_TOPOLOGIES[activeSuspectId];
        if (window.showTacticalToast) {
          window.showTacticalToast(`Centrality Analysis: ${data.name} is the primary structural bridge (Score: ${data.centrality})`, 'warning');
        }
      });
    }

    const expandBtn = document.getElementById('btn-expand-all');
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        if (window.showTacticalToast) {
          window.showTacticalToast('All 2nd & 3rd degree sub-nodes expanded across federated database', 'success');
        }
      });
    }
  }

  // 9. Global search sync
  function setupSearchSync() {
    const searchInputs = document.querySelectorAll('header input, main input[type="text"]');
    searchInputs.forEach(inp => {
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = inp.value.toLowerCase().trim();
          if (val.includes('ruja') || val.includes('crypto')) renderSuspectNetwork('POI-FBI-7661467');
          else if (val.includes('semion') || val.includes('mogilevich')) renderSuspectNetwork('POI-FBI-5311090');
          else if (val.includes('griselda') || val.includes('arredondo') || val.includes('cartel')) renderSuspectNetwork('POI-FBI-8603389');
          else if (val.includes('patel') || val.includes('bhadresh')) renderSuspectNetwork('POI-FBI-0074920');
          else if (val.includes('dmitri') || val.includes('petrov')) renderSuspectNetwork('POI-9042');
          else if (val.includes('fritsch') || val.includes('securities')) renderSuspectNetwork('POI-FBI-5316323');
        }
      });
    });
  }

  // Expose global controller
  window.renderSuspectNetwork = renderSuspectNetwork;
  window.SUSPECT_TOPOLOGIES = SUSPECT_TOPOLOGIES;

  // Auto-run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNetworkExplorer);
  } else {
    initNetworkExplorer();
  }
})();
