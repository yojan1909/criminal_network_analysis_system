"""
Nexus Intelligence Command Center — SQLite Database Manager
Provides all table schemas and CRUD operations for the application.
"""

import sqlite3
import json
import os
from datetime import datetime
from contextlib import contextmanager

_DEFAULT_DB = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "nexus.db")
DB_PATH = os.environ.get("DB_PATH", _DEFAULT_DB)


def get_connection():
    """Get a new database connection with row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


@contextmanager
def get_db():
    """Context manager for database connections."""
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def dict_row(row):
    """Convert a sqlite3.Row to a dict, parsing JSON fields."""
    if row is None:
        return None
    d = dict(row)
    for key in ['aliases', 'known_addresses', 'assigned_officers', 'imei',
                'linked_entity_ids', 'evidence_ids', 'contributing_factors',
                'tags', 'sections', 'linked_entities', 'linked_documents',
                'extracted_attributes', 'properties', 'fbi_details', 'fbi_files']:
        if key in d and isinstance(d[key], str):
            try:
                d[key] = json.loads(d[key])
            except (json.JSONDecodeError, TypeError):
                pass
    return d


def init_database():
    """Create all tables if they don't exist."""
    conn = get_connection()
    cursor = conn.cursor()

    # --- Users ---
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'investigating_officer',
        department TEXT,
        clearance_level INTEGER DEFAULT 1,
        mfa_enabled INTEGER DEFAULT 1,
        avatar_url TEXT,
        status TEXT DEFAULT 'active',
        created_at TEXT DEFAULT (datetime('now'))
    )""")

    # --- Cases ---
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cases (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'open',
        priority TEXT DEFAULT 'medium',
        assigned_officers TEXT DEFAULT '[]',
        entity_count INTEGER DEFAULT 0,
        document_count INTEGER DEFAULT 0,
        alert_count INTEGER DEFAULT 0,
        created_by TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (created_by) REFERENCES users(id)
    )""")

    # --- Entities ---
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS entities (
        id TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL,
        name TEXT NOT NULL,
        aliases TEXT DEFAULT '[]',
        description TEXT,
        risk_score REAL DEFAULT 0.0,
        confidence REAL DEFAULT 0.0,
        status TEXT DEFAULT 'active',
        case_id TEXT,
        -- Person-specific
        dob TEXT,
        gender TEXT,
        nationality TEXT,
        known_addresses TEXT DEFAULT '[]',
        -- Organization-specific
        org_type TEXT,
        registration_no TEXT,
        -- Location-specific
        address TEXT,
        lat REAL,
        lng REAL,
        location_type TEXT,
        -- Vehicle-specific
        vehicle_reg TEXT,
        make_model TEXT,
        color TEXT,
        -- Phone-specific
        phone_number TEXT,
        carrier TEXT,
        imei TEXT DEFAULT '[]',
        -- Bank-specific
        bank_name TEXT,
        account_number TEXT,
        account_type TEXT,
        -- Meta
        contributing_factors TEXT DEFAULT '[]',
        created_by TEXT DEFAULT 'system:seed',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
    )""")

    # --- Relationships (edges) ---
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS relationships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_entity_id TEXT NOT NULL,
        target_entity_id TEXT NOT NULL,
        relationship_type TEXT NOT NULL,
        label TEXT,
        confidence REAL DEFAULT 0.8,
        weight REAL DEFAULT 1.0,
        properties TEXT DEFAULT '{}',
        source_document_id TEXT,
        review_status TEXT DEFAULT 'auto_accepted',
        created_by TEXT DEFAULT 'system:extraction',
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (source_entity_id) REFERENCES entities(id),
        FOREIGN KEY (target_entity_id) REFERENCES entities(id)
    )""")

    # --- Documents ---
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        source_type TEXT NOT NULL,
        case_id TEXT,
        file_type TEXT,
        file_size INTEGER DEFAULT 0,
        ocr_status TEXT DEFAULT 'not_applicable',
        upload_date TEXT DEFAULT (datetime('now')),
        uploaded_by TEXT,
        storage_ref TEXT,
        summary TEXT,
        entity_count INTEGER DEFAULT 0,
        FOREIGN KEY (case_id) REFERENCES cases(id)
    )""")

    # --- Alerts ---
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        alert_type TEXT NOT NULL,
        severity TEXT NOT NULL DEFAULT 'medium',
        description TEXT,
        explanation TEXT,
        case_id TEXT,
        linked_entity_ids TEXT DEFAULT '[]',
        evidence_ids TEXT DEFAULT '[]',
        disposition TEXT DEFAULT 'pending_review',
        reviewed_by TEXT,
        reviewed_at TEXT,
        generated_by TEXT DEFAULT 'system:anomaly_detection',
        tags TEXT DEFAULT '[]',
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (case_id) REFERENCES cases(id)
    )""")

    # --- Insights ---
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS insights (
        id TEXT PRIMARY KEY,
        insight_type TEXT NOT NULL,
        title TEXT NOT NULL,
        explanation TEXT,
        confidence REAL DEFAULT 0.0,
        entity_id TEXT,
        case_id TEXT,
        generated_by TEXT,
        review_status TEXT DEFAULT 'pending',
        reviewed_by TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (entity_id) REFERENCES entities(id),
        FOREIGN KEY (case_id) REFERENCES cases(id)
    )""")

    # --- Case Notes ---
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_id TEXT,
        entity_id TEXT,
        content TEXT NOT NULL,
        author_id TEXT,
        author_name TEXT,
        note_type TEXT DEFAULT 'general',
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (case_id) REFERENCES cases(id),
        FOREIGN KEY (entity_id) REFERENCES entities(id)
    )""")

    # --- Audit Log (append-only) ---
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        user_role TEXT,
        action TEXT NOT NULL,
        resource_type TEXT,
        resource_id TEXT,
        case_id TEXT,
        justification TEXT,
        details TEXT,
        ip_address TEXT,
        timestamp TEXT DEFAULT (datetime('now'))
    )""")

    # --- Communication Records (CDR) ---
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS communications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_number TEXT NOT NULL,
        target_number TEXT NOT NULL,
        source_entity_id TEXT,
        target_entity_id TEXT,
        call_type TEXT DEFAULT 'voice',
        duration_seconds INTEGER DEFAULT 0,
        timestamp TEXT NOT NULL,
        tower_location TEXT,
        case_id TEXT,
        flagged INTEGER DEFAULT 0,
        flag_reason TEXT
    )""")

    # --- Financial Transactions ---
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_account TEXT NOT NULL,
        target_account TEXT NOT NULL,
        source_entity_id TEXT,
        target_entity_id TEXT,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'INR',
        mode TEXT DEFAULT 'transfer',
        timestamp TEXT NOT NULL,
        case_id TEXT,
        flagged INTEGER DEFAULT 0,
        flag_reason TEXT,
        flagged_pattern TEXT
    )""")

    # --- NLP Extraction Review Queue (Human-in-the-Loop) ---
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS extraction_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id TEXT,
        case_id TEXT,
        entity_type TEXT NOT NULL,
        name TEXT NOT NULL,
        confidence REAL DEFAULT 0.75,
        text_span TEXT,
        extracted_attributes TEXT DEFAULT '{}',
        status TEXT DEFAULT 'pending',
        reviewed_by TEXT,
        reviewed_at TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (document_id) REFERENCES documents(id),
        FOREIGN KEY (case_id) REFERENCES cases(id)
    )""")

    # Attempt to add raw_text column to documents if it doesn't exist
    try:
        cursor.execute("ALTER TABLE documents ADD COLUMN raw_text TEXT")
    except sqlite3.OperationalError:
        pass

    # Indexes for performance
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_entities_type ON entities(entity_type)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_entities_case ON entities(case_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_relationships_source ON relationships(source_entity_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_relationships_target ON relationships(target_entity_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_alerts_case ON alerts(case_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_log(timestamp)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_communications_case ON communications(case_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_transactions_case ON transactions(case_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_extraction_queue_status ON extraction_queue(status)")

    conn.commit()
    conn.close()
    return True


def log_audit(user_id, action, resource_type=None, resource_id=None,
              case_id=None, justification=None, details=None):
    """Append an immutable audit log entry."""
    with get_db() as conn:
        conn.execute("""
            INSERT INTO audit_log (user_id, user_role, action, resource_type,
                                   resource_id, case_id, justification, details)
            VALUES (?, 'analyst', ?, ?, ?, ?, ?, ?)
        """, (user_id, action, resource_type, resource_id,
              case_id, justification, details))
