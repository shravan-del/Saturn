#!/usr/bin/env python3
"""
Database migration script for Voice Guardian Enterprise Features
Run this to add all the new enterprise tables to your database
"""

import sqlite3
import os
from datetime import datetime

def migrate_database():
    """Add enterprise tables to the database"""
    
    db_path = "voice_guardian.db"
    
    if not os.path.exists(db_path):
        print("❌ Database not found. Please run the backend first to create the database.")
        return False
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        print("🚀 Starting Voice Guardian Enterprise Migration...")
        
        # Create Teams table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS teams (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                owner_id TEXT NOT NULL,
                settings TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (owner_id) REFERENCES users (id)
            )
        """)
        print("✅ Created teams table")
        
        # Create Team Members table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS team_members (
                id TEXT PRIMARY KEY,
                team_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                role TEXT DEFAULT 'member',
                permissions TEXT,
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (team_id) REFERENCES teams (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        print("✅ Created team_members table")
        
        # Create Shared Context table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS shared_contexts (
                id TEXT PRIMARY KEY,
                team_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                context_type TEXT NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                metadata TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (team_id) REFERENCES teams (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        print("✅ Created shared_contexts table")
        
        # Create Workflow Templates table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS workflow_templates (
                id TEXT PRIMARY KEY,
                team_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                steps TEXT NOT NULL,
                triggers TEXT NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (team_id) REFERENCES teams (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        print("✅ Created workflow_templates table")
        
        # Create Voice Macros table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS voice_macros (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                trigger_phrase TEXT NOT NULL,
                actions TEXT NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        print("✅ Created voice_macros table")
        
        # Create Voice Shortcuts table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS voice_shortcuts (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                shortcut_key TEXT NOT NULL,
                voice_command TEXT NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        print("✅ Created voice_shortcuts table")
        
        # Create Decisions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS decisions (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                context TEXT,
                decision_text TEXT NOT NULL,
                reasoning TEXT,
                confidence TEXT,
                metadata TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        print("✅ Created decisions table")
        
        # Create indexes for better performance
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members (team_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members (user_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_shared_contexts_team_id ON shared_contexts (team_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_workflow_templates_team_id ON workflow_templates (team_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_voice_macros_user_id ON voice_macros (user_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_voice_shortcuts_user_id ON voice_shortcuts (user_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_decisions_user_id ON decisions (user_id)")
        print("✅ Created performance indexes")
        
        # Commit all changes
        conn.commit()
        
        print("🎉 Voice Guardian Enterprise Migration Completed Successfully!")
        print("📊 New Tables Added:")
        print("   • teams - Team management")
        print("   • team_members - Team membership")
        print("   • shared_contexts - Team collaboration")
        print("   • workflow_templates - Workflow automation")
        print("   • voice_macros - Voice command automation")
        print("   • voice_shortcuts - Keyboard shortcuts")
        print("   • decisions - AI decision tracking")
        
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        conn.rollback()
        return False
        
    finally:
        conn.close()

if __name__ == "__main__":
    success = migrate_database()
    if success:
        print("\n🚀 Ready to use Voice Guardian Enterprise Features!")
        print("💡 Next steps:")
        print("   1. Restart your backend server")
        print("   2. Test the new team and admin endpoints")
        print("   3. Create your first team and workflow")
    else:
        print("\n❌ Migration failed. Please check the error messages above.")


