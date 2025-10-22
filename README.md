# Digital World Adventures - Foundry VTT System

A comprehensive Foundry Virtual Tabletop system for the Digital World Adventures custom TTRPG, built for Foundry VTT V13.

## Features

### Actor Types
- **Character**: Player characters with full progression system
  - 5 core attributes (Strength, Agility, Intellect, Willpower, Charisma)
  - Health and Energy resource tracking
  - Level and Experience progression
  - Inventory management
  - Equipment with bonuses
  - Skills system
  - Abilities with costs and effects

- **NPC**: Non-player characters for Game Masters
  - Challenge Rating system
  - Simplified attribute tracking
  - Ability management
  - Creature type classification

### Item Types
- **Items**: Standard inventory items with quantity and weight
- **Abilities**: Special powers and attacks
  - Energy/Health costs
  - Damage values and types
  - Range, duration, and target specifications

- **Equipment**: Wearable items
  - Equippable status
  - Armor values
  - Attribute bonuses

- **Skills**: Character proficiencies
  - Rank progression
  - Attribute associations

### System Features
- Automatic attribute modifier calculation
- Derived stats (Health/Energy based on attributes)
- Rollable attributes with d20 + modifier
- Rich text editors for descriptions and biographies
- Active Effects support
- Drag-and-drop item management
- Professional UI with custom styling

## Installation

### Manual Installation
1. Download the latest release
2. Extract to your Foundry VTT `Data/systems` folder
3. Restart Foundry VTT
4. Create a new world and select "Digital World Adventures" as the game system

### Manifest URL
Use this manifest URL in Foundry VTT's system installation:
```
https://github.com/EikoSakura/digital-world-adventures/releases/latest/download/system.json
```

## File Structure

```
digital-world-adventures/
├── module/
│   ├── actor/
│   │   ├── actor.mjs              # Actor data model
│   │   └── actor-sheet.mjs        # Actor sheet logic
│   ├── item/
│   │   ├── item.mjs               # Item data model
│   │   └── item-sheet.mjs         # Item sheet logic
│   ├── helpers/
│   │   └── helpers.mjs            # Helper utilities
│   └── digital-world-adventures.mjs # Main system entry point
├── templates/
│   ├── actor/
│   │   ├── actor-character-sheet.hbs
│   │   ├── actor-npc-sheet.hbs
│   │   └── parts/                 # Actor sheet partials
│   └── item/
│       ├── item-*.sheet.hbs       # Item type sheets
│       └── parts/                 # Item sheet partials
├── styles/
│   └── digital-world-adventures.css # System styling
├── lang/
│   └── en.json                    # English localization
├── system.json                    # System manifest
├── template.json                  # Data templates
└── README.md
```

## Usage Guide

### Creating a Character
1. Create a new Actor and select "Character" type
2. Fill in the character name and upload a portrait image
3. Set initial attribute values (default: 10)
4. Health and Energy maximums are automatically calculated
5. Add items, equipment, abilities, and skills as needed

### Using Abilities
1. Create a new Item and select "Ability" type
2. Set the cost (Energy or Health)
3. Define damage dice (e.g., "2d6")
4. Select damage type (Physical, Energy, Digital, Elemental)
5. Specify range, duration, and target
6. Click the ability name on the character sheet to use it

### Equipment Management
1. Create Equipment items with armor values and attribute bonuses
2. Check the "Equipped" box to apply bonuses
3. Equipped items provide their armor value and attribute bonuses

### Rolling Dice
- Click any attribute modifier to roll 1d20 + modifier
- Ability names are clickable to display their effects in chat

## Customization

### Adding New Attributes
Edit `template.json` to add new attributes to the `attributes` object:
```json
"attributes": {
  "newAttribute": {
    "value": 10
  }
}
```

### Modifying Damage Types
Edit the `damageTypes` object in `module/item/item-sheet.mjs` to add custom damage types.

### Styling
Modify `styles/digital-world-adventures.css` to customize the appearance of sheets and UI elements.

### Localization
Add new language files in the `lang/` directory and register them in `system.json`.

## Development

### Prerequisites
- Foundry VTT V13 or higher
- Basic knowledge of JavaScript/ES modules
- Understanding of Handlebars templating

### Building from Source
1. Clone this repository
2. Make your modifications
3. Test in a development Foundry instance
4. Submit pull requests for improvements

### Key Files
- `module/digital-world-adventures.mjs`: System initialization and configuration
- `module/actor/actor.mjs`: Actor data preparation and derived calculations
- `module/item/item.mjs`: Item data preparation and roll functionality
- `template.json`: Define data structure for all document types

## Game System Details

### Attributes
All characters and NPCs have five core attributes:
- **Strength**: Physical power and melee combat
- **Agility**: Speed, reflexes, and ranged combat
- **Intellect**: Knowledge, reasoning, and digital skills
- **Willpower**: Mental fortitude and spiritual power (affects max Health)
- **Charisma**: Social influence and leadership

Attribute modifiers are calculated as: `(Value - 10) / 2` (rounded down)

### Resources
- **Health**: Hit points, calculated as `10 + (Willpower × 2)` for characters
- **Energy**: Power points for abilities, calculated as `10 + Intellect` for characters
- **Experience**: XP progression for character advancement

### Challenge Rating (NPCs)
NPCs use a Challenge Rating (CR) instead of levels:
- Health: `10 + (CR × 5)`
- Energy: `10 + (CR × 3)`

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for:
- Bug fixes
- New features
- Documentation improvements
- Translations
- UI/UX enhancements

## License

This project is licensed under the terms specified in the LICENSE file.

## Credits

Developed for Foundry Virtual Tabletop V13

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the Foundry VTT community forums
- Review the Foundry VTT system development documentation

## Changelog

### Version 1.0.0
- Initial release
- Character and NPC actor types
- Item, Ability, Equipment, and Skill item types
- Complete character sheet with tabs
- Attribute rolling system
- Automatic derived stat calculation
- Active Effects support
- Full localization support
