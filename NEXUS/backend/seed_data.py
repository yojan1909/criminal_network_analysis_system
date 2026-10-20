"""
Nexus Intelligence Command Center — Synthetic Dataset Generator
Creates a realistic intelligence dataset with intentionally hidden patterns
for demo purposes: hidden broker, financial structuring, burst communication.
"""

import json
import random
from datetime import datetime, timedelta
from backend.database import get_db, init_database


def seed_all():
    """Seed the entire database with synthetic data."""
    init_database()

    with get_db() as conn:
        # Check if already seeded
        count = conn.execute("SELECT COUNT(*) FROM entities").fetchone()[0]
        if count > 0:
            print("[SEED] Database already populated. Skipping.")
            return

        print("[SEED] Generating synthetic intelligence dataset...")
        seed_users(conn)
        seed_cases(conn)
        seed_entities(conn)
        seed_relationships(conn)
        seed_documents(conn)
        seed_communications(conn)
        seed_transactions(conn)
        seed_alerts(conn)
        seed_insights(conn)
        seed_notes(conn)
        seed_audit_log(conn)
        update_case_counts(conn)
        print("[SEED] ✓ Dataset seeded successfully.")


def seed_users(conn):
    users = [
        ("AN-89241", "Analyst M. Vance", "intelligence_analyst", "Cyber Intelligence Unit", 4),
        ("IO-45012", "Insp. R. Kapoor", "investigating_officer", "Financial Crimes Division", 3),
        ("IO-33871", "Det. S. Morales", "investigating_officer", "Organized Crime Task Force", 3),
        ("CS-10044", "Supt. A. Chen", "case_supervisor", "Strategic Operations", 5),
        ("DA-00102", "Admin J. Park", "data_administrator", "IT Security", 2),
    ]
    for uid, name, role, dept, cl in users:
        conn.execute(
            "INSERT INTO users (id, name, role, department, clearance_level, avatar_url) VALUES (?,?,?,?,?,?)",
            (uid, name, role, dept, cl, f"assets/images/analyst-vance.png")
        )


def seed_cases(conn):
    cases = [
        ("CS-2024-8841", "Operation HYDRA — Maritime Smuggling Network",
         "Multi-jurisdictional investigation into a maritime logistics network suspected of facilitating contraband transshipment through Cyprus and Baltic ports. Primary targets include shell freight forwarders and offshore holding vehicles.",
         "investigating", "critical", ["AN-89241", "IO-45012"], "AN-89241"),
        ("CS-2024-7720", "FINTRACK — Hawala/Layering Network (Western Region)",
         "Financial investigation into a suspected hawala network operating across multiple jurisdictions. Pattern analysis reveals systematic structuring of transactions below reporting thresholds.",
         "investigating", "high", ["IO-45012", "IO-33871"], "IO-45012"),
        ("CS-2024-9103", "SIGNET — Encrypted Communications Cell",
         "Investigation into an organized communications cell using encrypted messaging platforms to coordinate operations. CDR analysis reveals burst communication patterns around key events.",
         "open", "high", ["AN-89241", "IO-33871"], "IO-33871"),
        ("CS-2023-6540", "GHOSTWIRE — Defunct Cyber Fraud Ring",
         "Closed investigation into a cyber fraud ring that was dismantled in Q3 2023. Retained for cross-case reference and entity linkage.",
         "closed", "medium", ["IO-33871"], "IO-33871"),
    ]
    for cid, title, desc, status, priority, officers, created_by in cases:
        conn.execute(
            "INSERT INTO cases (id, title, description, status, priority, assigned_officers, created_by) VALUES (?,?,?,?,?,?,?)",
            (cid, title, desc, status, priority, json.dumps(officers), created_by)
        )


def seed_entities(conn):
    """Create entities across multiple types and cases."""
    entities = [
        # ===== CASE CS-2024-8841: Operation HYDRA =====
        # Persons
        ("POI-9042", "Person", "Dmitri Petrov", ["The Architect", "D. Voronin"],
         "Core transshipment coordinator linking Limassol port operations to Baltic offshore accounts. Subject of INTERPOL Red Notice request.",
         94, 0.95, "active", "CS-2024-8841",
         {"dob": "1978-03-14", "gender": "Male", "nationality": "Russian/Cypriot",
          "contributing_factors": ["Highest betweenness centrality (0.94)", "Links 3 separate clusters", "28 direct connections", "Controls financial conduit to Baltic-X"]}),

        ("POI-3318", "Person", "Elena Rostova", ["E. Volkova"],
         "Financial trustee handling escrow arrangements for shell company transactions. Authorized signatory on 3 secondary accounts.",
         68, 0.88, "active", "CS-2024-8841",
         {"dob": "1985-09-22", "gender": "Female", "nationality": "Ukrainian",
          "contributing_factors": ["Escrow handler for 3 shell accounts", "Direct courier to Petrov", "Wiretap warrant active"]}),

        ("POI-7201", "Person", "Marcus Havel", ["M. Havel", "The Clerk"],
         "Low-profile logistics coordinator who connects two otherwise-separate network clusters. HIDDEN BROKER — not a named suspect but structurally critical.",
         42, 0.72, "active", "CS-2024-8841",
         {"dob": "1990-06-10", "gender": "Male", "nationality": "Czech",
          "contributing_factors": ["Bridges Baltic and Cyprus clusters", "Only 4 direct connections but highest betweenness in subgraph", "No criminal record — clean profile"]}),

        ("POI-4455", "Person", "Sergei Volkov", ["Serge", "The Captain"],
         "Former merchant navy captain, now suspected of coordinating vessel movements through Limassol for cargo diversions.",
         78, 0.90, "active", "CS-2024-8841",
         {"dob": "1972-11-08", "gender": "Male", "nationality": "Russian",
          "contributing_factors": ["Direct operational link to port terminal", "Controls vessel scheduling", "Known associate of Petrov since 2019"]}),

        ("POI-5589", "Person", "Nadia Osman", [],
         "Customs broker at Limassol port. Suspected of facilitating clearance for undeclared cargo shipments.",
         55, 0.75, "active", "CS-2024-8841",
         {"dob": "1988-04-17", "gender": "Female", "nationality": "Cypriot/Turkish",
          "contributing_factors": ["Port access credentials", "Unusual clearance patterns flagged", "Financial links to Vektor Logistics"]}),

        # Organizations
        ("ORG-5519", "Organization", "Vektor Logistics GmbH", ["Vektor Maritime GmbH", "VK Shipping"],
         "Shell freight forwarding company registered in Hamburg. Facilitated €1.4M in structured wire transfers via Cyprus and BVI. Accounts frozen pursuant to subpoena.",
         88, 0.92, "active", "CS-2024-8841",
         {"org_type": "shell_company", "registration_no": "HRB-224891"}),

        ("ORG-6023", "Organization", "Baltic-X Holding Ltd", ["Baltic Trade LLC"],
         "Offshore holding vehicle registered in BVI. Beneficial ownership tracing points to Dmitri Petrov through two nominee layers.",
         85, 0.87, "active", "CS-2024-8841",
         {"org_type": "offshore_holding", "registration_no": "BVI-778421"}),

        ("ORG-6650", "Organization", "Meridian Freight Solutions", [],
         "Legitimate freight company whose infrastructure was used by Vektor Logistics for cargo documentation. May be unwitting intermediary.",
         30, 0.60, "active", "CS-2024-8841",
         {"org_type": "freight_company", "registration_no": "CY-119048"}),

        # Locations
        ("LOC-4011", "Location", "Limassol Port Terminal", ["Berth 4-B", "Pier Seven Depot"],
         "Primary transshipment hub in Cyprus. Co-location point for 4 flagged cargo vessels in past 90 days.",
         82, 0.95, "active", "CS-2024-8841",
         {"address": "Limassol Port, Cyprus", "lat": 34.6741, "lng": 33.0379, "location_type": "port"}),

        ("LOC-4055", "Location", "Frankfurt Escrow Office", [],
         "Office suite used for financial transactions and document exchanges. Leased by Elena Rostova through a nominee arrangement.",
         60, 0.80, "active", "CS-2024-8841",
         {"address": "Neue Mainzer Str. 52, Frankfurt, Germany", "lat": 50.1109, "lng": 8.6821, "location_type": "office"}),

        ("LOC-4082", "Location", "Tallinn Warehouse District", ["Baltic Depot"],
         "Warehouse complex linked to Baltic-X Holding. Suspected staging point for diverted cargo.",
         70, 0.78, "active", "CS-2024-8841",
         {"address": "Sadama 25, Tallinn, Estonia", "lat": 59.4370, "lng": 24.7536, "location_type": "warehouse"}),

        # Vehicles
        ("VEH-2201", "Vehicle", "MV Caspian Dawn", [],
         "Bulk carrier vessel flagged for route anomalies. Diverted twice through Limassol without declared cargo manifest changes.",
         72, 0.85, "active", "CS-2024-8841",
         {"vehicle_reg": "IMO-9412785", "make_model": "Bulk Carrier / 2012", "color": "Grey"}),

        # Phones
        ("PHN-1101", "PhoneNumber", "+357-99-421-883", [],
         "Primary device associated with Dmitri Petrov. High-volume communications with multiple network targets.",
         0, 0.95, "active", "CS-2024-8841",
         {"carrier": "Cyta Mobile", "phone_number": "+357-99-421-883"}),

        ("PHN-1102", "PhoneNumber", "+49-151-882-4420", [],
         "Burner device linked to Elena Rostova. Active only during financial transaction windows.",
         0, 0.80, "active", "CS-2024-8841",
         {"carrier": "Vodafone DE", "phone_number": "+49-151-882-4420"}),

        ("PHN-1103", "PhoneNumber", "+420-777-551-209", [],
         "Device associated with Marcus Havel. Sparse usage pattern — activated only for cross-cluster coordination.",
         0, 0.70, "active", "CS-2024-8841",
         {"carrier": "T-Mobile CZ", "phone_number": "+420-777-551-209"}),

        # Bank Accounts
        ("BNK-3001", "BankAccount", "Vektor Logistics Operating Account", [],
         "Primary operating account for Vektor Logistics GmbH. Source of structured wire transfers.",
         0, 0.90, "active", "CS-2024-8841",
         {"bank_name": "Deutsche Bank", "account_number": "DE89-3704-0044-0532-0130-00", "account_type": "business"}),

        ("BNK-3002", "BankAccount", "Baltic-X Escrow Account", [],
         "Escrow account receiving structured deposits from multiple sources.",
         0, 0.85, "active", "CS-2024-8841",
         {"bank_name": "FirstCaribbean International", "account_number": "BVI-4421-7780-001", "account_type": "escrow"}),

        ("BNK-3003", "BankAccount", "Rostova Personal Account", [],
         "Personal account linked to Elena Rostova. Receiving irregular deposits.",
         0, 0.75, "active", "CS-2024-8841",
         {"bank_name": "Commerzbank", "account_number": "DE44-5004-0000-0123-4567-89", "account_type": "personal"}),

        # ===== CASE CS-2024-7720: FINTRACK =====
        ("POI-6612", "Person", "Rajesh Malhotra", ["R. Malhotra"],
         "Suspected hawala operator. Controls a network of cash couriers across 3 cities.",
         80, 0.88, "active", "CS-2024-7720",
         {"dob": "1975-08-20", "gender": "Male", "nationality": "Indian",
          "contributing_factors": ["Hub of financial network", "12 linked accounts", "Structuring pattern detected"]}),

        ("POI-6620", "Person", "Priya Sharma", ["P. S. Gupta"],
         "Financial intermediary managing shell company accounts for the hawala network.",
         65, 0.82, "active", "CS-2024-7720",
         {"dob": "1982-12-05", "gender": "Female", "nationality": "Indian",
          "contributing_factors": ["Shell company director", "4 accounts flagged", "Linked to Malhotra network"]}),

        ("POI-6631", "Person", "Vikram Singh", ["Vicky"],
         "Cash courier operating between Mumbai and Dubai. Pattern of sub-threshold transactions.",
         72, 0.85, "active", "CS-2024-7720",
         {"dob": "1992-03-18", "gender": "Male", "nationality": "Indian",
          "contributing_factors": ["Frequent cross-border cash movements", "Sub-threshold transaction pattern", "Linked to 2 hawala channels"]}),

        ("ORG-7780", "Organization", "Sapphire Trading Co.", ["Sapphire Imports"],
         "Shell company used as front for hawala operations. No verifiable trade activity.",
         75, 0.80, "active", "CS-2024-7720",
         {"org_type": "shell_company", "registration_no": "MH-2021-44892"}),

        ("BNK-3010", "BankAccount", "Sapphire Trading Operating", [],
         "Operating account used for layering. Multiple sub-₹10,00,000 deposits within 24-hour windows.",
         0, 0.85, "active", "CS-2024-7720",
         {"bank_name": "HDFC Bank", "account_number": "HDFC-5020-1234-5678", "account_type": "business"}),

        ("BNK-3011", "BankAccount", "Malhotra Holdings Account", [],
         "Account showing round-tripping pattern — funds cycle back within 72 hours.",
         0, 0.80, "active", "CS-2024-7720",
         {"bank_name": "ICICI Bank", "account_number": "ICICI-6670-9876-5432", "account_type": "business"}),

        # ===== CASE CS-2024-9103: SIGNET =====
        ("POI-8801", "Person", "Ahmad Farouk", ["Abu Saeed"],
         "Suspected communications cell coordinator. Encrypted device usage with burst patterns around key dates.",
         76, 0.83, "active", "CS-2024-9103",
         {"dob": "1980-07-14", "gender": "Male", "nationality": "Egyptian/British",
          "contributing_factors": ["Burst communication pattern detected", "Encrypted device cluster", "Central node in comms network"]}),

        ("POI-8815", "Person", "Karim Benzali", [],
         "Member of encrypted communications cell. Contact pattern shows strict operational security.",
         58, 0.76, "active", "CS-2024-9103",
         {"dob": "1993-01-28", "gender": "Male", "nationality": "Moroccan",
          "contributing_factors": ["OpSec-aware contact patterns", "Device activated only during coordination windows", "2-hop from Farouk"]}),

        ("PHN-1201", "PhoneNumber", "+44-7911-223-445", [],
         "Encrypted device associated with Ahmad Farouk. Shows burst activation patterns.",
         0, 0.80, "active", "CS-2024-9103",
         {"carrier": "EE UK", "phone_number": "+44-7911-223-445"}),

        ("PHN-1202", "PhoneNumber", "+44-7700-900-112", [],
         "Secondary encrypted device in the SIGNET cell.",
         0, 0.75, "active", "CS-2024-9103",
         {"carrier": "Three UK", "phone_number": "+44-7700-900-112"}),

        # Social Media Account
        ("SOC-0101", "SocialMediaAccount", "@vektor_maritime (Twitter/X)", [],
         "Corporate social media presence for Vektor Logistics. Posts about shipping schedules potentially used for coordination.",
         20, 0.55, "active", "CS-2024-8841",
         {"description": "Corporate Twitter/X account"}),
    ]

    for eid, etype, name, aliases, desc, risk, conf, status, case_id, extra in entities:
        params = {
            "id": eid, "entity_type": etype, "name": name,
            "aliases": json.dumps(aliases), "description": desc,
            "risk_score": risk, "confidence": conf, "status": status, "case_id": case_id,
        }
        # Merge extra fields
        if "dob" in extra: params["dob"] = extra["dob"]
        if "gender" in extra: params["gender"] = extra["gender"]
        if "nationality" in extra: params["nationality"] = extra["nationality"]
        if "org_type" in extra: params["org_type"] = extra["org_type"]
        if "registration_no" in extra: params["registration_no"] = extra["registration_no"]
        if "address" in extra: params["address"] = extra["address"]
        if "lat" in extra: params["lat"] = extra["lat"]
        if "lng" in extra: params["lng"] = extra["lng"]
        if "location_type" in extra: params["location_type"] = extra["location_type"]
        if "vehicle_reg" in extra: params["vehicle_reg"] = extra["vehicle_reg"]
        if "make_model" in extra: params["make_model"] = extra["make_model"]
        if "color" in extra: params["color"] = extra["color"]
        if "phone_number" in extra: params["phone_number"] = extra["phone_number"]
        if "carrier" in extra: params["carrier"] = extra["carrier"]
        if "bank_name" in extra: params["bank_name"] = extra["bank_name"]
        if "account_number" in extra: params["account_number"] = extra["account_number"]
        if "account_type" in extra: params["account_type"] = extra["account_type"]
        if "contributing_factors" in extra: params["contributing_factors"] = json.dumps(extra["contributing_factors"])

        cols = ", ".join(params.keys())
        placeholders = ", ".join(["?"] * len(params))
        conn.execute(f"INSERT INTO entities ({cols}) VALUES ({placeholders})", list(params.values()))


def seed_relationships(conn):
    """Create relationships between entities. Includes the hidden broker pattern."""
    rels = [
        # Operation HYDRA core network
        ("POI-9042", "ORG-5519", "CONTROLS", "Financial controller of Vektor Logistics", 0.95, 3.0),
        ("POI-9042", "ORG-6023", "BENEFICIAL_OWNER", "Beneficial owner through nominee layers", 0.87, 2.5),
        ("POI-9042", "POI-4455", "ASSOCIATE_OF", "Long-term operational associate since 2019", 0.92, 2.0),
        ("POI-9042", "POI-3318", "DIRECTS", "Directs financial operations through Rostova", 0.90, 2.5),
        ("POI-9042", "LOC-4011", "OPERATES_AT", "Coordinates operations through Limassol port", 0.88, 2.0),
        ("POI-9042", "PHN-1101", "OWNS", "Primary communication device", 0.95, 1.0),
        ("POI-9042", "BNK-3001", "CONTROLS", "Controls Vektor operating account", 0.90, 2.0),

        ("POI-3318", "LOC-4055", "OPERATES_AT", "Based at Frankfurt escrow office", 0.85, 1.5),
        ("POI-3318", "BNK-3002", "SIGNATORY", "Authorized signatory on escrow account", 0.92, 2.0),
        ("POI-3318", "BNK-3003", "OWNS", "Personal account holder", 0.95, 1.0),
        ("POI-3318", "PHN-1102", "OWNS", "Uses burner device for transactions", 0.80, 1.0),
        ("POI-3318", "ORG-5519", "EMPLOYEE_OF", "Listed as compliance officer", 0.85, 1.5),

        ("POI-4455", "LOC-4011", "OPERATES_AT", "Coordinates vessel movements at port", 0.93, 2.0),
        ("POI-4455", "VEH-2201", "COMMANDS", "Commands MV Caspian Dawn", 0.90, 2.0),
        ("POI-4455", "POI-5589", "ASSOCIATE_OF", "Works with customs broker", 0.80, 1.5),

        ("POI-5589", "LOC-4011", "EMPLOYED_AT", "Customs broker at Limassol port", 0.95, 1.5),
        ("POI-5589", "ORG-5519", "FACILITATES", "Facilitates clearances for Vektor shipments", 0.75, 1.5),

        # HIDDEN BROKER: Marcus Havel bridges Cyprus and Baltic clusters
        ("POI-7201", "ORG-5519", "CONSULTANT_TO", "External logistics consultant", 0.70, 2.5),
        ("POI-7201", "ORG-6023", "CONSULTANT_TO", "Advisory role at Baltic-X", 0.65, 2.5),
        ("POI-7201", "LOC-4082", "OPERATES_AT", "Manages Tallinn warehouse operations", 0.78, 2.0),
        ("POI-7201", "PHN-1103", "OWNS", "Sparse-usage coordination device", 0.70, 1.0),

        # Organization links
        ("ORG-5519", "ORG-6023", "TRANSACTS_WITH", "Structured wire transfers between entities", 0.88, 3.0),
        ("ORG-5519", "ORG-6650", "USES_INFRASTRUCTURE", "Uses Meridian for cargo documentation", 0.72, 1.5),
        ("ORG-5519", "LOC-4011", "SHIPS_THROUGH", "Primary shipping route", 0.90, 2.0),
        ("ORG-6023", "LOC-4082", "OWNS_PROPERTY", "Owns warehouse complex in Tallinn", 0.85, 1.5),

        ("VEH-2201", "LOC-4011", "DOCKED_AT", "Multiple dockings in 90-day period", 0.95, 1.5),

        # Financial edges
        ("BNK-3001", "BNK-3002", "TRANSACTED_WITH", "Structured wire transfers €1.4M total", 0.92, 3.0),
        ("BNK-3001", "BNK-3003", "TRANSACTED_WITH", "Irregular payments to Rostova", 0.85, 2.0),

        # Social media
        ("SOC-0101", "ORG-5519", "BELONGS_TO", "Corporate social media account", 0.90, 0.5),

        # FINTRACK network
        ("POI-6612", "POI-6620", "ASSOCIATE_OF", "Business associates in hawala network", 0.88, 2.0),
        ("POI-6612", "POI-6631", "DIRECTS", "Directs cash courier operations", 0.85, 2.0),
        ("POI-6612", "ORG-7780", "CONTROLS", "Controls Sapphire Trading shell company", 0.90, 2.5),
        ("POI-6612", "BNK-3010", "CONTROLS", "Controls operating account", 0.88, 2.0),
        ("POI-6612", "BNK-3011", "OWNS", "Holdings account owner", 0.92, 1.5),
        ("POI-6620", "ORG-7780", "DIRECTOR_OF", "Registered director of shell company", 0.95, 1.5),
        ("POI-6620", "BNK-3010", "SIGNATORY", "Account signatory", 0.90, 1.5),
        ("POI-6631", "POI-6612", "COURIER_FOR", "Cash courier", 0.82, 2.0),
        ("BNK-3010", "BNK-3011", "TRANSACTED_WITH", "Round-tripping pattern detected", 0.87, 3.0),

        # SIGNET network
        ("POI-8801", "POI-8815", "COMMUNICATED_WITH", "Encrypted communications", 0.80, 2.0),
        ("POI-8801", "PHN-1201", "OWNS", "Primary encrypted device", 0.85, 1.0),
        ("POI-8815", "PHN-1202", "OWNS", "Secondary cell device", 0.78, 1.0),
        ("PHN-1201", "PHN-1202", "COMMUNICATED_WITH", "Burst pattern communications", 0.82, 2.0),

        # CROSS-CASE LINKS (the interesting ones)
        ("POI-9042", "POI-6612", "LINKED_TO", "AI-inferred: shared financial intermediary pattern", 0.45, 1.0),
        ("ORG-5519", "ORG-7780", "LINKED_TO", "AI-inferred: overlapping beneficial ownership indicators", 0.38, 1.0),
    ]

    for src, tgt, rtype, label, conf, weight in rels:
        conn.execute("""
            INSERT INTO relationships (source_entity_id, target_entity_id, relationship_type,
                                       label, confidence, weight, source_document_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (src, tgt, rtype, label, conf, weight, f"DOC-{random.randint(1000,9999)}"))


def seed_documents(conn):
    docs = [
        ("DOC-4471", "CDR Analysis Report — Petrov Network Q1 2026", "CDR", "CS-2024-8841", "csv", 2450000, "processed", "AN-89241", "Complete CDR dataset for primary HYDRA targets. 340 call records extracted.", 12),
        ("DOC-4488", "Financial Intelligence Report — Vektor Logistics", "financial", "CS-2024-8841", "pdf", 1820000, "processed", "IO-45012", "Wire transfer analysis identifying structuring patterns in Vektor Logistics accounts.", 8),
        ("DOC-4501", "INTERPOL Red Notice Request — Dmitri Petrov", "law_enforcement", "CS-2024-8841", "pdf", 890000, "processed", "CS-10044", "Draft Red Notice request with supporting evidence compilation.", 5),
        ("DOC-4515", "Surveillance Report — Limassol Port Operations", "surveillance", "CS-2024-8841", "pdf", 3200000, "processed", "IO-33871", "72-hour surveillance operation documenting port activities and vessel movements.", 7),
        ("DOC-4520", "Company Registry Extract — Vektor Logistics GmbH", "corporate", "CS-2024-8841", "pdf", 450000, "processed", "AN-89241", "German company registry data showing beneficial ownership chain.", 4),
        ("DOC-4533", "Mutual Legal Assistance Request — Estonia", "legal", "CS-2024-8841", "docx", 780000, "not_applicable", "CS-10044", "MLA request to Estonian authorities for warehouse records.", 2),
        ("DOC-5001", "FIR — Hawala Network Operations", "FIR", "CS-2024-7720", "pdf", 1200000, "processed", "IO-45012", "First Information Report detailing suspected hawala operations.", 9),
        ("DOC-5015", "Bank Statement Analysis — Sapphire Trading", "financial", "CS-2024-7720", "xlsx", 980000, "processed", "IO-45012", "6-month statement analysis showing structuring and round-tripping.", 6),
        ("DOC-5020", "Transaction Alert — Sub-threshold Pattern", "financial", "CS-2024-7720", "pdf", 340000, "processed", "AN-89241", "Automated alert from financial monitoring system.", 3),
        ("DOC-6001", "CDR Burst Analysis — SIGNET Cell", "CDR", "CS-2024-9103", "csv", 1560000, "processed", "IO-33871", "Call detail record analysis showing burst communication patterns.", 8),
        ("DOC-6010", "Encrypted Device Forensics Report", "forensics", "CS-2024-9103", "pdf", 4500000, "processed", "AN-89241", "Digital forensics analysis of recovered encrypted devices.", 11),
    ]
    for did, title, stype, cid, ftype, size, ocr, uploader, summary, ecount in docs:
        conn.execute("""
            INSERT INTO documents (id, title, source_type, case_id, file_type, file_size,
                                   ocr_status, uploaded_by, summary, entity_count)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (did, title, stype, cid, ftype, size, ocr, uploader, summary, ecount))


def seed_communications(conn):
    """Generate synthetic CDR records with a burst communication pattern."""
    base_date = datetime(2026, 3, 1)
    records = []

    # Normal communication pattern for HYDRA network
    pairs = [
        ("+357-99-421-883", "+49-151-882-4420", "POI-9042", "POI-3318", "CS-2024-8841"),
        ("+357-99-421-883", "+420-777-551-209", "POI-9042", "POI-7201", "CS-2024-8841"),
        ("+49-151-882-4420", "+420-777-551-209", "POI-3318", "POI-7201", "CS-2024-8841"),
    ]

    for src_num, tgt_num, src_eid, tgt_eid, cid in pairs:
        for day_offset in range(90):
            if random.random() < 0.3:  # 30% chance of communication each day
                ts = base_date + timedelta(days=day_offset, hours=random.randint(8, 22),
                                           minutes=random.randint(0, 59))
                records.append((src_num, tgt_num, src_eid, tgt_eid, "voice",
                                random.randint(30, 600), ts.isoformat(), cid, 0, None))

    # BURST COMMUNICATION PATTERN: spike around March 15 (event date)
    burst_pairs = [
        ("+44-7911-223-445", "+44-7700-900-112", "POI-8801", "POI-8815", "CS-2024-9103"),
    ]
    for src_num, tgt_num, src_eid, tgt_eid, cid in burst_pairs:
        # Normal: ~1 call per week
        for week in range(12):
            ts = base_date + timedelta(days=week * 7, hours=random.randint(20, 23))
            records.append((src_num, tgt_num, src_eid, tgt_eid, "voice",
                            random.randint(60, 180), ts.isoformat(), cid, 0, None))

        # BURST: 18 calls in 48 hours around March 15
        burst_start = datetime(2026, 3, 14, 18, 0)
        for i in range(18):
            ts = burst_start + timedelta(hours=random.uniform(0, 48),
                                          minutes=random.randint(0, 59))
            records.append((src_num, tgt_num, src_eid, tgt_eid, "voice",
                            random.randint(15, 420), ts.isoformat(), cid, 1,
                            "Burst communication anomaly — 18x normal frequency in 48hr window"))

    for rec in records:
        conn.execute("""
            INSERT INTO communications (source_number, target_number, source_entity_id,
                                        target_entity_id, call_type, duration_seconds,
                                        timestamp, case_id, flagged, flag_reason)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, rec)


def seed_transactions(conn):
    """Generate synthetic financial transactions with structuring pattern."""
    base_date = datetime(2026, 1, 15)
    txns = []

    # Normal transactions for HYDRA
    for i in range(20):
        ts = base_date + timedelta(days=random.randint(0, 120))
        amount = random.choice([25000, 50000, 75000, 120000, 250000])
        txns.append(("DE89-3704-0044-0532-0130-00", "BVI-4421-7780-001",
                      "BNK-3001", "BNK-3002", amount, "EUR", "wire_transfer",
                      ts.isoformat(), "CS-2024-8841", 0, None, None))

    # STRUCTURING PATTERN for FINTRACK: multiple sub-₹10,00,000 transactions
    structuring_dates = [
        datetime(2026, 2, 10), datetime(2026, 2, 11), datetime(2026, 2, 12),
        datetime(2026, 3, 5), datetime(2026, 3, 6), datetime(2026, 3, 7),
        datetime(2026, 4, 1), datetime(2026, 4, 2), datetime(2026, 4, 3),
    ]
    for dt in structuring_dates:
        for j in range(random.randint(3, 5)):
            # Amounts just below the ₹10,00,000 threshold
            amount = random.randint(850000, 999000)
            ts = dt + timedelta(hours=random.randint(9, 17), minutes=random.randint(0, 59))
            txns.append(("HDFC-5020-1234-5678", "ICICI-6670-9876-5432",
                          "BNK-3010", "BNK-3011", amount, "INR", "UPI",
                          ts.isoformat(), "CS-2024-7720", 1,
                          "Structuring: sub-threshold transaction cluster",
                          "financial_structuring"))

    # Round-tripping pattern
    for i in range(5):
        dt = base_date + timedelta(days=random.randint(30, 90))
        amount = random.randint(500000, 900000)
        # Forward
        txns.append(("HDFC-5020-1234-5678", "ICICI-6670-9876-5432",
                      "BNK-3010", "BNK-3011", amount, "INR", "NEFT",
                      dt.isoformat(), "CS-2024-7720", 1,
                      "Round-tripping: funds returned within 72hrs", "round_tripping"))
        # Return (slightly different amount)
        ret_dt = dt + timedelta(hours=random.randint(24, 72))
        txns.append(("ICICI-6670-9876-5432", "HDFC-5020-1234-5678",
                      "BNK-3011", "BNK-3010", amount - random.randint(5000, 25000), "INR", "NEFT",
                      ret_dt.isoformat(), "CS-2024-7720", 1,
                      "Round-tripping: return leg", "round_tripping"))

    for txn in txns:
        conn.execute("""
            INSERT INTO transactions (source_account, target_account, source_entity_id,
                                      target_entity_id, amount, currency, mode,
                                      timestamp, case_id, flagged, flag_reason, flagged_pattern)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, txn)


def seed_alerts(conn):
    alerts = [
        ("ALT-8821", "Financial Structuring Pattern Detected — Sapphire/Malhotra Network",
         "financial_structuring", "critical",
         "Multiple sub-₹10,00,000 transactions between Sapphire Trading and Malhotra Holdings within 24-hour windows. 32 transactions across 9 days match known structuring typology.",
         "32 transactions between BNK-3010 and BNK-3011 cluster in 3-5 day bursts, each ₹8.5L–₹9.99L. This pattern is consistent with deliberate avoidance of the ₹10,00,000 cash transaction reporting threshold (PMLA Rule 3). The probability of this clustering occurring naturally is <0.01%.",
         "CS-2024-7720", ["POI-6612", "POI-6620", "BNK-3010", "BNK-3011"],
         ["DOC-5015", "DOC-5020"], "pending_review",
         ["financial_crime", "structuring", "PMLA"]),

        ("ALT-8834", "Burst Communication Anomaly — SIGNET Cell",
         "burst_communication", "critical",
         "18 calls in 48 hours between PHN-1201 and PHN-1202, compared to baseline of ~1 call/week. Spike coincides with a reported operational event on March 15.",
         "Communication frequency between +44-7911-223-445 and +44-7700-900-112 increased 18x above baseline during March 14-16 window. Historical 12-week pattern shows weekly contact averaging 1.2 calls/week. Z-score of burst: 14.2 (extreme outlier). Temporal correlation with HUMINT-reported meeting event on March 15.",
         "CS-2024-9103", ["POI-8801", "POI-8815", "PHN-1201", "PHN-1202"],
         ["DOC-6001"], "pending_review",
         ["communications", "burst_pattern", "operational_security"]),

        ("ALT-8847", "Hidden Broker Identified — Marcus Havel (POI-7201)",
         "key_influencer", "high",
         "Betweenness centrality analysis identifies POI-7201 (Marcus Havel) as a critical structural bridge between the Cyprus port operations cluster and the Baltic offshore cluster, despite having only 4 direct connections.",
         "Marcus Havel has a betweenness centrality score of 0.89, ranking #1 in the Operation HYDRA subgraph despite only 4 direct edges. He is the sole connector between: (1) Cyprus cluster (Petrov, Volkov, Osman, Limassol Port) and (2) Baltic cluster (Baltic-X, Tallinn Warehouse). Removing this node would split the network into 2 disconnected components. No criminal record. Clean financial profile. Classic intermediary/facilitator pattern.",
         "CS-2024-8841", ["POI-7201", "ORG-5519", "ORG-6023", "LOC-4082"],
         ["DOC-4471"], "pending_review",
         ["network_analysis", "hidden_broker", "betweenness_centrality"]),

        ("ALT-8855", "Vessel Route Anomaly — MV Caspian Dawn",
         "geospatial_anomaly", "high",
         "MV Caspian Dawn (IMO-9412785) has deviated from declared route twice in 30 days, both times transiting through Limassol without manifest changes.",
         "AIS tracking data shows two undeclared route diversions through Limassol Port between Feb 20 and March 20. Both diversions occurred during periods when Dmitri Petrov and Sergei Volkov were confirmed at the port terminal. Cargo manifest was not amended to reflect the stopovers.",
         "CS-2024-8841", ["VEH-2201", "POI-4455", "LOC-4011"],
         ["DOC-4515"], "confirmed",
         ["maritime", "route_anomaly", "smuggling"]),

        ("ALT-8860", "Round-Tripping Pattern — FINTRACK Accounts",
         "financial_anomaly", "medium",
         "Funds cycle between BNK-3010 and BNK-3011 with return within 72 hours, across 5 detected instances. Amounts vary by ₹5K-₹25K to obscure the pattern.",
         "5 instances detected where transfers from Sapphire Trading to Malhotra Holdings are returned within 24-72 hours with a small variance (0.5-2.8%). This pattern is consistent with layering/round-tripping to create an appearance of legitimate business transactions.",
         "CS-2024-7720", ["BNK-3010", "BNK-3011", "POI-6612"],
         ["DOC-5015"], "pending_review",
         ["financial_crime", "round_tripping", "layering"]),

        ("ALT-8871", "Cross-Case Entity Match — Shared Financial Pattern",
         "cross_case_link", "medium",
         "AI analysis suggests structural similarity between the Vektor Logistics financial pattern (CS-2024-8841) and the Sapphire Trading pattern (CS-2024-7720). Both use offshore holding vehicles with similar layering structures.",
         "Structural comparison of financial flow graphs between Operation HYDRA and FINTRACK reveals similar layering topology: operating company → escrow/intermediary → offshore holding. Confidence: 0.45. This is below auto-link threshold and requires analyst review.",
         None, ["ORG-5519", "ORG-7780", "POI-9042", "POI-6612"],
         [], "pending_review",
         ["cross_case", "pattern_similarity", "AI_inferred"]),

        ("ALT-8880", "Watchlist Hit — Dmitri Petrov Mentioned in New SIGINT",
         "watchlist_hit", "high",
         "Entity 'Dmitri Petrov' (POI-9042) referenced in newly ingested SIGINT summary from partner agency. Context suggests ongoing activity.",
         "Watchlist entity POI-9042 matched in incoming partner agency intelligence summary. The reference appears in the context of ongoing maritime logistics operations in the Eastern Mediterranean region. Full document review required.",
         "CS-2024-8841", ["POI-9042"],
         [], "pending_review",
         ["watchlist", "SIGINT", "partner_intelligence"]),
    ]

    for aid, title, atype, sev, desc, expl, cid, entities, evidence, disp, tags in alerts:
        conn.execute("""
            INSERT INTO alerts (id, title, alert_type, severity, description, explanation,
                                case_id, linked_entity_ids, evidence_ids, disposition, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (aid, title, atype, sev, desc, expl, cid,
              json.dumps(entities), json.dumps(evidence), disp, json.dumps(tags)))


def seed_insights(conn):
    insights = [
        ("INS-001", "key_influencer", "Dmitri Petrov — Network Hub (Eigenvector Centrality)",
         "POI-9042 ranks #1 by eigenvector centrality (0.94) in the HYDRA subgraph. This entity is connected to other highly-connected entities, indicating influence by association quality, not just volume. Key connections: Vektor Logistics (shell company control), Baltic-X (beneficial ownership), Limassol Port (operational hub).",
         0.94, "POI-9042", "CS-2024-8841", "neo4j_gds:eigenvector_centrality", "confirmed"),

        ("INS-002", "key_influencer", "Marcus Havel — Hidden Broker (Betweenness Centrality)",
         "POI-7201 has the highest betweenness centrality (0.89) despite only 4 direct connections. This entity sits on the shortest paths between the Cyprus operations cluster and the Baltic financial cluster. Removing this node would disconnect the two clusters entirely. This is a classic 'hidden broker' pattern — a low-profile individual whose structural position makes them operationally critical.",
         0.89, "POI-7201", "CS-2024-8841", "neo4j_gds:betweenness_centrality", "pending"),

        ("INS-003", "community", "Three Distinct Sub-Communities Detected in HYDRA Network",
         "Louvain community detection identifies 3 clusters with modularity 0.72: (1) Cyprus Port Operations: Petrov, Volkov, Osman, Limassol Port, Caspian Dawn. (2) Financial/Escrow Layer: Rostova, Frankfurt Office, Vektor accounts. (3) Baltic Offshore: Baltic-X, Tallinn Warehouse, Havel. Cluster (3) is connected to (1) and (2) solely through Marcus Havel.",
         0.72, None, "CS-2024-8841", "neo4j_gds:louvain", "pending"),

        ("INS-004", "anomaly", "Financial Structuring Alert — FINTRACK Network",
         "Isolation Forest anomaly detection flagged Sapphire Trading → Malhotra Holdings transaction pattern. Feature vector (transaction count per day, mean amount, amount variance, timing regularity) scores in the 99.8th percentile for anomaly. Manual rule-based check confirms: 32/35 transactions fall within ₹8.5L–₹9.99L range (sub-threshold).",
         0.95, "POI-6612", "CS-2024-7720", "sklearn:isolation_forest + rule_engine", "pending"),
    ]

    for iid, itype, title, expl, conf, eid, cid, gen_by, status in insights:
        conn.execute("""
            INSERT INTO insights (id, insight_type, title, explanation, confidence,
                                   entity_id, case_id, generated_by, review_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (iid, itype, title, expl, conf, eid, cid, gen_by, status))


def seed_notes(conn):
    notes = [
        ("CS-2024-8841", "POI-9042", "Initial surveillance confirms subject maintains regular schedule at Limassol port. Observed meeting with POI-4455 (Volkov) on March 2 at Berth 4-B. Recommend continued monitoring.", "AN-89241", "Analyst M. Vance", "observation"),
        ("CS-2024-8841", "POI-7201", "Subject appears to have no criminal record in any checked jurisdiction. Czech national, EU passport. Travels regularly between Prague, Tallinn, and Hamburg. Pattern suggests logistics coordination role but no direct involvement in primary criminal activity.", "AN-89241", "Analyst M. Vance", "analysis"),
        ("CS-2024-8841", None, "MLA request to Estonia submitted via diplomatic channels. Expected 4-6 week processing time. Need warehouse access records for Sadama 25 complex.", "CS-10044", "Supt. A. Chen", "administrative"),
        ("CS-2024-7720", "POI-6612", "Financial analysis complete. Subject controls at least 4 bank accounts through nominee arrangements. Transaction pattern consistent with hawala operations. Structuring pattern confirmed by independent audit.", "IO-45012", "Insp. R. Kapoor", "analysis"),
        ("CS-2024-7720", None, "Cross-reference with HYDRA case flagged by system. Structural similarity in financial flow patterns. Assigning for manual review.", "AN-89241", "Analyst M. Vance", "cross_reference"),
        ("CS-2024-9103", "POI-8801", "Burst communication pattern around March 15 correlates with HUMINT-reported meeting. Recommend expediting encrypted device forensics.", "IO-33871", "Det. S. Morales", "operational"),
    ]

    for cid, eid, content, author_id, author_name, ntype in notes:
        conn.execute("""
            INSERT INTO notes (case_id, entity_id, content, author_id, author_name, note_type)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (cid, eid, content, author_id, author_name, ntype))


def seed_audit_log(conn):
    """Seed some initial audit entries."""
    entries = [
        ("AN-89241", "analyst", "LOGIN", "session", None, None, None, "MFA verified. Session start."),
        ("AN-89241", "analyst", "VIEW", "case", "CS-2024-8841", "CS-2024-8841", None, "Accessed Operation HYDRA case file."),
        ("AN-89241", "analyst", "RUN_ANALYSIS", "graph", None, "CS-2024-8841", "Betweenness centrality for key influencer identification", "Ran betweenness centrality on HYDRA subgraph."),
        ("AN-89241", "analyst", "VIEW", "entity", "POI-9042", "CS-2024-8841", None, "Viewed Dmitri Petrov profile."),
        ("IO-45012", "investigating_officer", "UPLOAD", "document", "DOC-5015", "CS-2024-7720", "Financial evidence for FINTRACK", "Uploaded bank statement analysis."),
        ("IO-45012", "investigating_officer", "VIEW", "alert", "ALT-8821", "CS-2024-7720", None, "Reviewed structuring pattern alert."),
    ]

    for uid, role, action, rtype, rid, cid, just, details in entries:
        conn.execute("""
            INSERT INTO audit_log (user_id, user_role, action, resource_type,
                                    resource_id, case_id, justification, details)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (uid, role, action, rtype, rid, cid, just, details))


def update_case_counts(conn):
    """Update case entity/document/alert counts."""
    cases = conn.execute("SELECT id FROM cases").fetchall()
    for case in cases:
        cid = case['id']
        ec = conn.execute("SELECT COUNT(*) FROM entities WHERE case_id=?", (cid,)).fetchone()[0]
        dc = conn.execute("SELECT COUNT(*) FROM documents WHERE case_id=?", (cid,)).fetchone()[0]
        ac = conn.execute("SELECT COUNT(*) FROM alerts WHERE case_id=?", (cid,)).fetchone()[0]
        conn.execute("UPDATE cases SET entity_count=?, document_count=?, alert_count=? WHERE id=?",
                     (ec, dc, ac, cid))


if __name__ == "__main__":
    seed_all()
