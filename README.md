# Digimon: Digital World Adventures - Foundry VTT System

A comprehensive Foundry Virtual Tabletop system for the Digimon: Digital World Adventures custom TTRPG, built for Foundry VTT V13. This dice pool-based system allows players to control both a Tamer (human) and their Digimon Partner.

## Core Mechanics

### Dice Pool System
- **Dice Type**: d6 only
- **Success**: 4, 5, or 6 on a die counts as a success
- **Dice Pool Formula**: Parameter + Skill
- **Critical Success**: 3+ successes over difficulty
- **Critical Failure**: 3+ successes under difficulty
- **Automatic Successes**: Some abilities grant bonus successes
- **Purchase Successes**: Trade 3 dice for 1 automatic success (non-combat only)

### Difficulty Ranks
- **Simple (1)**: Baby I/II level tasks
- **Moderate (2)**: Child level tasks
- **Demanding (3)**: Adult level tasks
- **Extreme (4)**: Perfect level tasks
- **Impossible (5+)**: Ultimate/Super Ultimate level tasks

## Character Types

### Tamers (Humans)

**Parameters** (2 points to distribute at creation):
- **Power (POW)**: Physical strength and melee combat
- **Agility (AGI)**: Speed, reflexes, and evasion
- **Vigor (VIG)**: Endurance and physical defense
- **Intellect (INT)**: Knowledge, technology, and problem-solving
- **Spirit (SPI)**: Willpower, magic defense, and bond with partner

**Skills** (5 points, max 2 per skill at creation):
- **Combat**: Command, Evade, Fight, Protect
- **Knowledge**: Craft, Lore, Medicine, Technology
- **Social**: Empathy, Intimidation, Perform, Persuasion
- **Survival**: Alert, Athletics, Nature, Stealth

**Crests** (Choose 1):
- Courage, Friendship, Love, Knowledge, Sincerity, Reliability, Hope, Light, Kindness
- **Effect**: Grants 1 automatic success when acting according to crest virtue
- On success: Regain 1 Digisoul
- On critical success: Digimon can evolve temporarily

**Derived Stats**:
- **HP**: Base HP (3, or 5 with Brawler talent) + Vigor
- **Digisoul**: Spirit + 3
- **Initiative**: Intellect + Partner's Agility
- **Defense**: (Vigor + Agility) / 4 (rounded up, min 1)
- **Magic Defense**: (Spirit + Agility) / 4 (rounded up, min 1)

### Digimon Partners

**Evolution Stages**:
- Baby I → Baby II → Child → Adult → Perfect → Ultimate → Super Ultimate

**Parameters** (Min/Max based on stage and species):
- Power, Agility, Vigor, Intellect, Spirit
- Values range from 0-8 depending on evolution stage

**Skills** (5 points to distribute):
- **Digimon-Only**: Melee, Projectile
- **Shared**: Evade, Protect, plus all Tamer skills

**Personalities** (Affects parameter min/max):
- **Brainy** (Intellect bonus)
- **Brave** (Vigor bonus)
- **Empath** (Spirit bonus)
- **Fighter** (Power bonus)
- **Timid** (Agility bonus)

**Attributes** (Damage Triangle):
- **Vaccine** → Virus → Data → Vaccine
- **Free** (no advantages/weaknesses)

**Elements** (Damage Triangles):
- Fire → Plant → Water → Fire
- Electric → Wind → Earth → Electric
- Light ↔ Dark
- Neutral (no modifiers)

**Types**: Avian, Beast, Ore, Slime, Spirit

**Movement Types**: Burrow, Float, Fly, Land, Swim, Teleport

**Derived Stats**:
- **HP**: Base HP (from evolution stage) + Vigor
- **Digisoul**: Spirit + 3
- **Initiative**: Tamer's Intellect + Digimon's Agility
- **Defense**: (Vigor + Agility) / 4
- **Magic Defense**: (Spirit + Agility) / 4

## Combat System

### Structure
- **Zone-based**: Combat divided into zones connected by pathways
- **Initiative**: 1d6 + Initiative Bonus
- **Turn Structure**: Each Tamer+Digimon pair gets 2 phases (Move + Action for each)

### Actions

**Tamer Actions**:
- Activate Talent
- Aid (give bonus dice to Digimon)
- Evolve (costs 1 Digisoul per stage)
- Use Item

**Digimon Actions**:
- Use Attack
- Move between zones

### Attack Resolution
1. Select attack (check range: Close, Near, Far)
2. Roll Accuracy (Parameter + Skill)
3. Compare to Defense/Magic Defense
4. Reactive Action (Clash, Evade, Guard)
5. Roll Damage: Intensity + successes on Parameter roll
6. Modify for Attribute/Element (±1 damage each)
7. Apply effects

### Reactive Actions (1 per turn pair)
- **Clash**: Block with own attack
  - Physical: Power + Protect
  - Magical: Intellect + Protect
- **Evade**: Dodge attack
  - Agility + Evade
- **Guard**: Reduce damage
  - Vigor + Protect
  - Each success reduces damage by 1

## Evolution System

- **Cost**: 1 Digisoul per stage jumped
- **Requirements**: Stage must be unlocked by Storyteller
- **Triggers**:
  - Manual evolution during Tamer's turn
  - Crest critical success (temporary)
- **Special Types**: Armor, Bio-Merge, Jogress, Hybrid, Burst Mode, Super Evolution

## Digisoul

**Recovery**:
- 1 per rest
- 2 per camp scene
- Full at adventure end
- 1 when embodying crest

**Uses**:
- Evolution (1+ Digisoul)
- Additional die on non-combat check (1 Digisoul)
- Reroll failed die (1 Digisoul)

## Status Ailments

Blind, Bugged, Burned, Charmed, Confused, Corruption, Dot, Frozen, Panicked, Paralyzed, Poisoned, Stunned

## Items & Equipment

### Starting Gear
- Digivice (required for evolution)
- Backpack
- 500 Bits (currency)

### Item Types
- **Talents**: Special abilities for Tamers (Asset, Command, Evolution, Raising, Tamer)
- **Attacks**: Basic and Special attacks for Digimon
- **Abilities**: Passive and active abilities for Digimon
- **Equipment**: Chips and modules that provide bonuses (400 Bits each)
- **Consumables**: HP Capsules/Sprays (100-400 Bits), Recovery Disks (100-300 Bits)
- **Assets**: Communication, Digicare, Hobby, Medical, Survival, Technology items (50-400 Bits)

## Installation

### Manual Installation
1. Download the latest release
2. Extract to your Foundry VTT `Data/systems` folder
3. Restart Foundry VTT
4. Create a new world and select "Digimon: Digital World Adventures" as the game system

### Manifest URL
```
https://github.com/EikoSakura/digital-world-adventures/releases/latest/download/system.json
```

## Usage Guide

### Creating a Tamer
1. Create a new Actor and select "Tamer" type
2. Distribute 2 points among parameters
3. Distribute 5 points among skills (max 2 per skill at start)
4. Select a Crest
5. Starting HP: 3 + Vigor
6. Starting Digisoul: Spirit + 3
7. Starting Bits: 500

### Creating a Digimon
1. Create a new Actor and select "Digimon" type
2. Set species name and starting stage (usually Baby I)
3. Select personality type
4. Choose attribute (Free, Vaccine, Data, Virus)
5. Choose element
6. Set parameters within stage limits
7. Distribute 5 skill points

### Rolling Dice Pools
- Click on any rollable element
- System automatically calculates pool size (Parameter + Skill)
- Dice are rolled and successes counted (4-6 = success)
- Results are displayed in chat with critical indicators

### Evolution
1. Ensure evolution stage is unlocked
2. Tamer must have enough Digisoul (1 per stage jumped)
3. Click evolve button or use evolution action
4. Digisoul is deducted automatically
5. Digimon stats update to new stage

### Combat
1. Roll initiative (1d6 + Initiative bonus)
2. On your turn: Tamer phase, then Digimon phase
3. Tamer can: Use talent, aid partner, evolve partner, use item
4. Digimon can: Attack, move
5. When attacked: Choose reactive action (Clash/Evade/Guard)
6. Damage is calculated with attribute/element modifiers

## File Structure

```
digital-world-adventures/
├── module/
│   ├── actor/
│   │   ├── actor.mjs              # Actor data model with evolution
│   │   └── actor-sheet.mjs        # Actor sheet logic
│   ├── item/
│   │   ├── item.mjs               # Item data model
│   │   └── item-sheet.mjs         # Item sheet logic
│   ├── helpers/
│   │   └── helpers.mjs            # Dice pool and combat helpers
│   └── digital-world-adventures.mjs # Main system entry point
├── templates/
│   ├── actor/
│   │   ├── actor-tamer-sheet.hbs
│   │   ├── actor-digimon-sheet.hbs
│   │   └── actor-npc-sheet.hbs
│   ├── item/
│   │   └── item-sheet.hbs         # Universal item sheet
│   └── chat/
│       └── dice-pool-roll.hbs     # Dice roll chat template
├── styles/
│   └── digital-world-adventures.css
├── lang/
│   └── en.json
├── system.json
├── template.json
└── README.md
```

## Development

### Prerequisites
- Foundry VTT V13 or higher
- Basic knowledge of JavaScript/ES modules
- Understanding of Handlebars templating

### Key Features Implemented
- ✅ Dice pool roller with success counting (4-6 = success)
- ✅ Tamer and Digimon actor types
- ✅ Complete evolution system with stage tracking
- ✅ Damage triangles (Attribute and Element)
- ✅ Digisoul tracking and management
- ✅ Crest system
- ✅ Character sheets with tabs
- ✅ Item management (Talents, Attacks, Abilities, Equipment, Consumables)
- ✅ Derived stat calculation
- ✅ Initiative system

### Future Enhancements
- Combat tracker with zone support
- Reactive action automation
- Status ailment tracking UI
- Talent prerequisite checking
- Training/Downtime activity tracking
- Dual partner support
- Special evolution types (Armor, Bio-Merge, etc.)
- Scene management (Combat, Camp, Shopping)

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for:
- Bug fixes
- New features
- Documentation improvements
- Additional Digimon species data
- UI/UX enhancements

## License

This project is licensed under the terms specified in the LICENSE file.

## Credits

Developed for Foundry Virtual Tabletop V13

Based on the Digimon: Digital World Adventures TTRPG system

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the Foundry VTT community forums
- Review the Foundry VTT system development documentation

## Changelog

### Version 2.0.0 (Current)
- Complete system overhaul for Digimon mechanics
- Implemented dice pool system (d6, successes on 4-6)
- Added Tamer and Digimon actor types
- Implemented evolution system with 7 stages
- Added Crest system with automatic success triggers
- Implemented Digisoul tracking and recovery
- Added damage triangles (Attribute and Element)
- Created talent, attack, ability, equipment, consumable, and asset item types
- Implemented parameter and skill system
- Added defense and magic defense calculations
- Created chat templates for dice pool rolls
- Full character sheet implementation for Tamers and Digimon

### Version 1.0.0
- Initial generic system release
