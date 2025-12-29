"""
Windows 11 to Windows 10 Rollback Assistant
============================================
IMPORTANT: Python cannot directly rollback Windows versions.
This script provides information and can help you access the recovery options.

Windows 11 allows rollback to Windows 10 within 10 days of upgrading.
After 10 days, you'll need to perform a clean installation.
"""

import platform
import os
import subprocess
import datetime

def check_windows_version():
    """Check current Windows version"""
    print("\n" + "="*50)
    print("WINDOWS VERSION INFORMATION")
    print("="*50)
    
    system_info = platform.uname()
    print(f"System: {system_info.system}")
    print(f"Release: {system_info.release}")
    print(f"Version: {system_info.version}")
    
    # Get Windows edition
    try:
        result = subprocess.run(['wmic', 'os', 'get', 'Caption'], 
                              capture_output=True, text=True, shell=True)
        if result.returncode == 0:
            caption = result.stdout.strip().split('\n')[1].strip()
            print(f"Edition: {caption}")
    except Exception as e:
        print(f"Could not retrieve edition: {e}")
    
    return system_info

def check_rollback_availability():
    """Check if Windows rollback option is available"""
    print("\n" + "="*50)
    print("ROLLBACK AVAILABILITY CHECK")
    print("="*50)
    
    # Check if Windows.old folder exists
    windows_old_path = r"C:\Windows.old"
    
    if os.path.exists(windows_old_path):
        print("✓ Windows.old folder found!")
        print("  This suggests rollback might be available.")
        
        # Try to get folder creation time
        try:
            creation_time = os.path.getctime(windows_old_path)
            creation_date = datetime.datetime.fromtimestamp(creation_time)
            days_ago = (datetime.datetime.now() - creation_date).days
            
            print(f"  Created: {creation_date.strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"  Days ago: {days_ago}")
            
            if days_ago <= 10:
                print("\n  ✓ ROLLBACK LIKELY AVAILABLE (within 10-day window)")
            else:
                print("\n  ✗ ROLLBACK PERIOD EXPIRED (more than 10 days)")
                print("    You'll need to perform a clean Windows 10 installation.")
        except Exception as e:
            print(f"  Could not determine folder age: {e}")
    else:
        print("✗ Windows.old folder not found.")
        print("  Rollback is NOT available. You'll need a clean installation.")
    
    return os.path.exists(windows_old_path)

def display_rollback_instructions():
    """Display step-by-step rollback instructions"""
    print("\n" + "="*50)
    print("ROLLBACK INSTRUCTIONS")
    print("="*50)
    print("""
METHOD 1: Using Windows Settings (If within 10 days)
-----------------------------------------------------
1. Press Windows Key + I to open Settings
2. Go to: System → Recovery
3. Look for "Go back" option under "Recovery options"
4. Click "Go back" if available
5. Follow the on-screen wizard
6. Your PC will restart and rollback to Windows 10

METHOD 2: Using This Script
---------------------------
This script can open the Recovery settings for you.

METHOD 3: Advanced Options (If settings don't work)
---------------------------------------------------
1. Press Windows Key + I → System → Recovery
2. Click "Restart now" next to Advanced startup
3. Choose: Troubleshoot → Advanced options → Go back to previous version

METHOD 4: Clean Installation (After 10 days)
--------------------------------------------
If rollback is not available, you'll need to:
1. Download Windows 10 ISO from Microsoft
2. Create installation media
3. Backup your data
4. Perform clean installation
""")

def open_recovery_settings():
    """Open Windows Recovery Settings"""
    print("\n" + "="*50)
    print("OPENING RECOVERY SETTINGS")
    print("="*50)
    
    try:
        # Open Windows Settings to Recovery page
        print("Attempting to open Windows Settings → Recovery...")
        subprocess.Popen(['start', 'ms-settings:recovery'], shell=True)
        print("✓ Recovery settings should open now.")
        print("  Look for 'Go back' option under Recovery options.")
        return True
    except Exception as e:
        print(f"✗ Could not open settings: {e}")
        print("  Please open Settings manually:")
        print("  Windows Key + I → System → Recovery")
        return False

def main():
    """Main function"""
    print("""
╔══════════════════════════════════════════════════╗
║  Windows 11 → Windows 10 Rollback Assistant     ║
╚══════════════════════════════════════════════════╝

WARNING: Always backup your important data before
         performing any system rollback operation!
""")
    
    # Check current version
    check_windows_version()
    
    # Check if rollback is available
    rollback_available = check_rollback_availability()
    
    # Display instructions
    display_rollback_instructions()
    
    # Ask user if they want to open recovery settings
    if rollback_available:
        print("\n" + "="*50)
        response = input("Open Windows Recovery Settings now? (y/n): ").lower()
        
        if response == 'y':
            open_recovery_settings()
        else:
            print("\nYou can manually access Recovery settings anytime:")
            print("Press Windows Key + I → System → Recovery")
    else:
        print("\n" + "="*50)
        print("RECOMMENDATION")
        print("="*50)
        print("Since rollback is not available, consider:")
        print("1. Visit: https://www.microsoft.com/software-download/windows10")
        print("2. Download Windows 10 installation media")
        print("3. Backup all important data")
        print("4. Perform clean installation")
    
    print("\n" + "="*50)
    print("Script completed. Good luck!")
    print("="*50)

if __name__ == "__main__":
    main()
