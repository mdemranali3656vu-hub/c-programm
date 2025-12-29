/**
 * Windows 11 to Windows 10 Rollback Assistant
 * ============================================
 * IMPORTANT: JavaScript cannot directly rollback Windows versions.
 * This script provides information and can help you access the recovery options.
 * 
 * Windows 11 allows rollback to Windows 10 within 10 days of upgrading.
 * After 10 days, you'll need to perform a clean installation.
 */

const os = require('os');
const fs = require('fs');
const { exec, spawn } = require('child_process');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function checkWindowsVersion() {
    console.log("\n" + "=".repeat(50));
    console.log("WINDOWS VERSION INFORMATION");
    console.log("=".repeat(50));
    
    console.log(`System: ${os.platform()}`);
    console.log(`Release: ${os.release()}`);
    console.log(`Architecture: ${os.arch()}`);
    console.log(`Hostname: ${os.hostname()}`);
    
    // Get Windows edition
    return new Promise((resolve) => {
        exec('wmic os get Caption', (error, stdout, stderr) => {
            if (!error && stdout) {
                const lines = stdout.trim().split('\n');
                if (lines.length > 1) {
                    const caption = lines[1].trim();
                    console.log(`Edition: ${caption}`);
                }
            } else {
                console.log(`Could not retrieve edition: ${error ? error.message : 'Unknown error'}`);
            }
            resolve();
        });
    });
}

function checkRollbackAvailability() {
    console.log("\n" + "=".repeat(50));
    console.log("ROLLBACK AVAILABILITY CHECK");
    console.log("=".repeat(50));
    
    const windowsOldPath = 'C:\\Windows.old';
    
    if (fs.existsSync(windowsOldPath)) {
        console.log("✓ Windows.old folder found!");
        console.log("  This suggests rollback might be available.");
        
        try {
            const stats = fs.statSync(windowsOldPath);
            const creationDate = stats.ctime;
            const now = new Date();
            const daysAgo = Math.floor((now - creationDate) / (1000 * 60 * 60 * 24));
            
            console.log(`  Created: ${creationDate.toLocaleString()}`);
            console.log(`  Days ago: ${daysAgo}`);
            
            if (daysAgo <= 10) {
                console.log("\n  ✓ ROLLBACK LIKELY AVAILABLE (within 10-day window)");
            } else {
                console.log("\n  ✗ ROLLBACK PERIOD EXPIRED (more than 10 days)");
                console.log("    You'll need to perform a clean Windows 10 installation.");
            }
        } catch (error) {
            console.log(`  Could not determine folder age: ${error.message}`);
        }
        
        return true;
    } else {
        console.log("✗ Windows.old folder not found.");
        console.log("  Rollback is NOT available. You'll need a clean installation.");
        return false;
    }
}

function displayRollbackInstructions() {
    console.log("\n" + "=".repeat(50));
    console.log("ROLLBACK INSTRUCTIONS");
    console.log("=".repeat(50));
    console.log(`
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
`);
}

function openRecoverySettings() {
    console.log("\n" + "=".repeat(50));
    console.log("OPENING RECOVERY SETTINGS");
    console.log("=".repeat(50));
    
    return new Promise((resolve) => {
        console.log("Attempting to open Windows Settings → Recovery...");
        
        // Open Windows Settings to Recovery page
        exec('start ms-settings:recovery', (error) => {
            if (!error) {
                console.log("✓ Recovery settings should open now.");
                console.log("  Look for 'Go back' option under Recovery options.");
                resolve(true);
            } else {
                console.log(`✗ Could not open settings: ${error.message}`);
                console.log("  Please open Settings manually:");
                console.log("  Windows Key + I → System → Recovery");
                resolve(false);
            }
        });
    });
}

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function main() {
    console.log(`
╔══════════════════════════════════════════════════╗
║  Windows 11 → Windows 10 Rollback Assistant     ║
╚══════════════════════════════════════════════════╝

WARNING: Always backup your important data before
         performing any system rollback operation!
`);
    
    // Check current version
    await checkWindowsVersion();
    
    // Check if rollback is available
    const rollbackAvailable = checkRollbackAvailability();
    
    // Display instructions
    displayRollbackInstructions();
    
    // Ask user if they want to open recovery settings
    if (rollbackAvailable) {
        console.log("\n" + "=".repeat(50));
        const response = await askQuestion("Open Windows Recovery Settings now? (y/n): ");
        
        if (response.toLowerCase() === 'y') {
            await openRecoverySettings();
        } else {
            console.log("\nYou can manually access Recovery settings anytime:");
            console.log("Press Windows Key + I → System → Recovery");
        }
    } else {
        console.log("\n" + "=".repeat(50));
        console.log("RECOMMENDATION");
        console.log("=".repeat(50));
        console.log("Since rollback is not available, consider:");
        console.log("1. Visit: https://www.microsoft.com/software-download/windows10");
        console.log("2. Download Windows 10 installation media");
        console.log("3. Backup all important data");
        console.log("4. Perform clean installation");
    }
    
    console.log("\n" + "=".repeat(50));
    console.log("Script completed. Good luck!");
    console.log("=".repeat(50));
    
    rl.close();
}

// Run the main function
main().catch(error => {
    console.error("An error occurred:", error);
    rl.close();
    process.exit(1);
});
