# Installation Instructions for Testing

## Method 1: Local Installation (Recommended for Development)

1. **Locate your Foundry VTT Data folder:**
   - Windows: `%localappdata%/FoundryVTT/Data/systems/`
   - macOS: `~/Library/Application Support/FoundryVTT/Data/systems/`
   - Linux: `~/.local/share/FoundryVTT/Data/systems/`

2. **Copy this system folder:**
   ```bash
   # Navigate to your Foundry systems folder
   cd [YOUR_FOUNDRY_DATA_PATH]/systems/
   
   # Copy or symlink this repository
   cp -r /path/to/digital-world-adventures ./digital-world-adventures
   
   # OR create a symlink (better for development)
   ln -s /path/to/digital-world-adventures ./digital-world-adventures
   ```

3. **Restart Foundry VTT**

4. **Create a new world** and select "Digimon: Digital World Adventures" as the game system

## Method 2: Install from Manifest URL (For GitHub Testing)

If you want to test the manifest installation:

1. **Create a GitHub Release:**
   - Go to your repository: https://github.com/EikoSakura/digital-world-adventures
   - Click "Releases" → "Create a new release"
   - Tag version: `v2.0.0`
   - Title: `Version 2.0.0`
   - Upload `system.json` as a release asset
   - Create a zip of the entire system and upload as `digital-world-adventures.zip`

2. **Update system.json URLs** (see below)

3. **Install in Foundry:**
   - Go to "Install System"
   - Paste the manifest URL
   - Click "Install"

## Method 3: Direct Development Setup

For active development, use a symlink:

```bash
# From your development directory
cd digital-world-adventures

# Create symlink to Foundry systems folder
ln -s "$(pwd)" "$HOME/.local/share/FoundryVTT/Data/systems/digital-world-adventures"
```

This way, any changes you make are immediately reflected in Foundry!

## Troubleshooting

**System doesn't appear in Foundry:**
- Check that the folder name is `digital-world-adventures` (must match the `id` in system.json)
- Verify system.json is valid JSON
- Check Foundry logs for errors

**Compendiums don't load:**
- Compendiums need to be "compiled" by Foundry on first load
- Source files in `packs/*/source/` are converted to LevelDB format

**Sheet doesn't display correctly:**
- Check browser console for JavaScript errors
- Verify all template files exist
- Make sure module paths in system.json are correct
