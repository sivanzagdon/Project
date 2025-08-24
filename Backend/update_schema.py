#!/usr/bin/env python3
"""
Script to update the database schema for user preferences
Run this script once to add new fields to existing users
"""

import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.db import get_collection

def update_schema():
    """Update the database schema for all users"""
    print("Starting database schema update...")
    
    try:
        # Get the users collection
        collection = get_collection("DS_PROJECT", "users")
        if collection is None:
            print("❌ Failed to connect to users collection")
            return False
        
        print("✅ Connected to users collection")
        
        # Get all users
        users = list(collection.find({}))
        print(f"📊 Found {len(users)} users in database")
        
        # Update each user with new fields
        updated_count = 0
        for user in users:
            emp_id = user.get('emp_id')
            print(f"🔄 Updating user {emp_id}...")
            
            # Prepare update data
            update_data = {}
            
            # Add company info if not exists
            if 'company' not in user:
                update_data['company'] = ''
            if 'department' not in user:
                update_data['department'] = ''
            if 'position' not in user:
                update_data['position'] = ''
            if 'level' not in user:
                update_data['level'] = ''
            if 'employee_id' not in user:
                update_data['employee_id'] = ''
            if 'hire_date' not in user:
                update_data['hire_date'] = None
            
            # Add dashboard preferences if not exists
            if 'dashboard_preferences' not in user:
                update_data['dashboard_preferences'] = {
                    'defaultPage': 'dashboard',
                    'autoRefreshInterval': 30,
                    'cardLayout': 'grid',
                    'defaultFilter': 'all'
                }
            
            # Add privacy settings if not exists
            if 'privacy_settings' not in user:
                update_data['privacy_settings'] = {
                    'profileVisibility': 'public',
                    'activityStatus': 'visible'
                }
            
            # Update user if there are new fields to add
            if update_data:
                result = collection.update_one(
                    {'_id': user['_id']},
                    {'$set': update_data}
                )
                if result.modified_count > 0:
                    updated_count += 1
                    print(f"✅ User {emp_id} updated successfully")
                else:
                    print(f"⚠️  User {emp_id} - no changes needed")
            else:
                print(f"✅ User {emp_id} - already up to date")
        
        print(f"\n🎉 Schema update completed!")
        print(f"📈 Total users processed: {len(users)}")
        print(f"🔄 Users updated: {updated_count}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error updating schema: {e}")
        return False

if __name__ == "__main__":
    print("🚀 User Preferences Database Schema Updater")
    print("=" * 50)
    
    success = update_schema()
    
    if success:
        print("\n✅ Schema update completed successfully!")
        print("🎯 You can now use the new user preferences features")
    else:
        print("\n❌ Schema update failed!")
        print("🔍 Check the error messages above")
        sys.exit(1)
