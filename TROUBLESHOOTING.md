# Troubleshooting UI Issues

## Current Issue: Sidebar Button Duplication & Text Truncation

If you're seeing "Create Folder" buttons duplicated in the sidebar or text being cut off, this is likely a **CSS caching issue**.

## Quick Fix Steps

### 1. Hard Refresh Your Browser
The browser might still be using the old cached CSS. Try these in order:

**Method A: Hard Refresh**
- **Windows/Linux**: Press `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: Press `Cmd + Shift + R`

**Method B: Clear Cache and Refresh**
1. Open Browser DevTools (`F12`)
2. Right-click the refresh button
3. Select **"Empty Cache and Hard Reload"** (Chrome/Edge) or **"Clear Cache"** (Firefox)

### 2. Verify CSS Changes Were Applied
1. Open Foundry VTT
2. Press `F12` to open DevTools
3. Go to the **Sources** or **Debugger** tab
4. Navigate to: `digital-world-adventures/styles/digital-world-adventures.css`
5. Look for lines 19-32 and verify they show:
   ```css
   .digital-world-adventures .flexrow {
     display: flex;
     ...
   }

   .digital-world-adventures .flexcol {
     display: flex;
     ...
   }
   ```
6. If they DON'T have `.digital-world-adventures` prefix, the CSS wasn't reloaded

### 3. Pull Latest Changes
If you haven't already, pull the latest fixes:

```bash
cd /path/to/digital-world-adventures
git pull origin claude/create-foundry-system-011CUNdbHjVnzAHu24qHTKpM
```

### 4. Restart Foundry Completely
Sometimes Foundry needs a full restart to reload system files:

1. Close Foundry VTT completely
2. Restart Foundry
3. Launch your world
4. Hard refresh the browser

### 5. Check for JavaScript Errors
1. Open DevTools (`F12`)
2. Go to the **Console** tab
3. Look for any red errors
4. If you see errors, share them with me

## What Was Fixed

We fixed CSS scope issues where utility classes weren't properly scoped:

**Files Changed:**
- `styles/digital-world-adventures.css` (lines 19-32)

**Changes Made:**
- ✓ Scoped `.flexrow` → `.digital-world-adventures .flexrow`
- ✓ Scoped `.flexcol` → `.digital-world-adventures .flexcol`

This prevents the system's CSS from affecting Foundry's sidebar and core UI.

## Still Having Issues?

If the problem persists after trying all steps above:

1. **Share a screenshot** - This helps identify the exact issue
2. **Check console for errors** - Copy any red errors from the Console tab
3. **Verify file changes** - Make sure the CSS file actually has the `.digital-world-adventures` prefix on flexrow/flexcol

## Normal Foundry Behavior

Note: Each sidebar section (Scenes, Actors, Items, etc.) **does** normally have its own "Create Folder" button. If you're seeing exactly one button per section, that's correct Foundry behavior. The issue would be if you see:
- Multiple "Create Folder" texts stacked on top of each other
- Buttons appearing in wrong locations
- Text repeating (like "Create Scene Create Scene")
