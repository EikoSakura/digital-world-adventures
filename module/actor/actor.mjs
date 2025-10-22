/**
 * Extend the base Actor document for Digimon: Digital World Adventures
 */
import * as helpers from "../helpers/helpers.mjs";

export class DigitalWorldActor extends Actor {

  /**
   * Augment the actor source data with additional dynamic data
   */
  prepareData() {
    super.prepareData();
  }

  /**
   * Prepare base actor data
   */
  prepareBaseData() {
    // Data modifications in this step occur before processing derived data
  }

  /**
   * Prepare derived actor data
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;

    // Make separate methods for each Actor type
    this._prepareTamerData(actorData);
    this._prepareDigimonData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Tamer type specific data
   */
  _prepareTamerData(actorData) {
    if (actorData.type !== 'tamer') return;

    const systemData = actorData.system;

    // Calculate derived stats
    const vigor = systemData.parameters.vigor.value;
    const agility = systemData.parameters.agility.value;
    const spirit = systemData.parameters.spirit.value;

    // Calculate max HP: Base HP (3 or 5 with Brawler) + Vigor
    systemData.hp.max = systemData.hp.base + vigor;

    // Calculate max Digisoul: Spirit + 3
    systemData.digisoul.max = spirit + 3;

    // Calculate Defense: (Vigor + Agility) / 4, minimum 1
    systemData.defense.value = helpers.calculateDefense(vigor, agility);

    // Calculate Magic Defense: (Spirit + Agility) / 4, minimum 1
    systemData.magicDefense.value = helpers.calculateMagicDefense(spirit, agility);

    // Initiative bonus is calculated with partner's agility in sheet
  }

  /**
   * Prepare Digimon type specific data
   */
  _prepareDigimonData(actorData) {
    if (actorData.type !== 'digimon') return;

    const systemData = actorData.system;

    // Get current stage evolution data
    const currentStage = systemData.stage;
    const evolutionData = systemData.evolution[currentStage];

    if (!evolutionData) return;

    // Calculate derived stats
    const vigor = systemData.parameters.vigor.value;
    const agility = systemData.parameters.agility.value;
    const spirit = systemData.parameters.spirit.value;

    // Calculate max HP: Base HP (from evolution stage) + Vigor
    systemData.hp.base = evolutionData.baseHp;
    systemData.hp.max = evolutionData.baseHp + vigor;

    // Calculate max Digisoul: Spirit + 3
    systemData.digisoul.max = spirit + 3;

    // Calculate Defense: (Vigor + Agility) / 4, minimum 1
    systemData.defense.value = helpers.calculateDefense(vigor, agility);

    // Calculate Magic Defense: (Spirit + Agility) / 4, minimum 1
    systemData.magicDefense.value = helpers.calculateMagicDefense(spirit, agility);

    // Apply personality modifiers to parameter limits
    this._applyPersonalityLimits(systemData);
  }

  /**
   * Apply personality modifiers to Digimon parameter limits
   */
  _applyPersonalityLimits(systemData) {
    const personality = systemData.personality;

    for (let [stageName, stageData] of Object.entries(systemData.evolution)) {
      const params = stageData.parameters;

      // Reset all to default
      for (let param in params) {
        // Personality increases max of associated parameter by 1
        if (
          (personality === 'fighter' && param === 'power') ||
          (personality === 'brave' && param === 'vigor') ||
          (personality === 'timid' && param === 'agility') ||
          (personality === 'brainy' && param === 'intellect') ||
          (personality === 'empath' && param === 'spirit')
        ) {
          // Note: This would need to be stored separately or calculated each time
        }
      }
    }
  }

  /**
   * Prepare NPC type specific data
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    const systemData = actorData.system;

    // Calculate derived stats
    const vigor = systemData.parameters.vigor.value;
    const agility = systemData.parameters.agility.value;
    const spirit = systemData.parameters.spirit.value;

    // Calculate max HP: Base + Vigor
    systemData.hp.max = systemData.hp.base + vigor;

    // Calculate max Digisoul: Spirit + 3
    systemData.digisoul.max = spirit + 3;

    // Calculate Defense
    systemData.defense.value = helpers.calculateDefense(vigor, agility);

    // Calculate Magic Defense
    systemData.magicDefense.value = helpers.calculateMagicDefense(spirit, agility);
  }

  /**
   * Override getRollData() to provide data for rolls
   */
  getRollData() {
    const data = { ...super.getRollData() };

    // Add parameters for easy access
    if (data.parameters) {
      for (let [k, v] of Object.entries(data.parameters)) {
        data[k] = v.value;
      }
    }

    // Add skills for easy access
    if (data.skills) {
      for (let [category, skills] of Object.entries(data.skills)) {
        for (let [skillName, skillData] of Object.entries(skills)) {
          data[skillName] = skillData.value;
        }
      }
    }

    return data;
  }

  /**
   * Roll a dice pool check
   */
  async rollCheck(parameter, skill, difficulty = 1, autoSuccesses = 0) {
    const systemData = this.system;

    // Get parameter and skill values
    let paramValue = 0;
    let skillValue = 0;

    if (systemData.parameters && systemData.parameters[parameter]) {
      paramValue = systemData.parameters[parameter].value;
    }

    // Find skill in any category
    if (systemData.skills) {
      for (let category of Object.values(systemData.skills)) {
        if (category[skill]) {
          skillValue = category[skill].value;
          break;
        }
      }
    }

    // Calculate dice pool
    const poolSize = paramValue + skillValue;

    // Roll the dice pool
    const rollResult = await helpers.rollDicePool(poolSize, autoSuccesses);

    // Check for critical
    const criticalResult = helpers.checkCritical(rollResult.successes, difficulty);

    // Create chat message
    const messageData = {
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `${parameter.toUpperCase()} + ${skill.charAt(0).toUpperCase() + skill.slice(1)} Check`,
      content: await renderTemplate("systems/digital-world-adventures/templates/chat/dice-pool-roll.hbs", {
        actor: this,
        parameter: parameter,
        skill: skill,
        poolSize: rollResult.poolSize,
        results: rollResult.results,
        successes: rollResult.successes,
        autoSuccesses: rollResult.autoSuccesses,
        difficulty: difficulty,
        difficultyLabel: helpers.getDifficultyLabel(difficulty),
        result: criticalResult
      })
    };

    await ChatMessage.create(messageData);

    return {
      ...rollResult,
      criticalResult: criticalResult
    };
  }

  /**
   * Evolve Digimon to a new stage
   */
  async evolve(targetStage) {
    if (this.type !== 'digimon') {
      ui.notifications.warn("Only Digimon can evolve!");
      return false;
    }

    const systemData = this.system;
    const currentStage = systemData.stage;
    const evolutionData = systemData.evolution[targetStage];

    // Check if stage is unlocked
    if (!evolutionData || !evolutionData.unlocked) {
      ui.notifications.warn("This evolution stage is not yet unlocked!");
      return false;
    }

    // Calculate digisoul cost
    const cost = helpers.calculateEvolutionCost(currentStage, targetStage);

    // Check if tamer has enough digisoul
    const tamer = game.actors.get(systemData.tamerId);
    if (tamer && tamer.system.digisoul.value < cost) {
      ui.notifications.warn(`Evolution requires ${cost} Digisoul!`);
      return false;
    }

    // Deduct digisoul from tamer
    if (tamer) {
      await tamer.update({
        'system.digisoul.value': tamer.system.digisoul.value - cost
      });
    }

    // Update stage
    await this.update({
      'system.stage': targetStage
    });

    // Create chat message
    const messageData = {
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `<div class="evolution-message">
        <h3>${this.name} digivolves!</h3>
        <p>${helpers.getStageLabel(currentStage)} → ${helpers.getStageLabel(targetStage)}</p>
        <p>Digisoul Cost: ${cost}</p>
      </div>`
    };

    await ChatMessage.create(messageData);

    ui.notifications.info(`${this.name} evolved to ${helpers.getStageLabel(targetStage)}!`);
    return true;
  }

  /**
   * Spend Digisoul
   */
  async spendDigisoul(amount) {
    const systemData = this.system;

    if (systemData.digisoul.value < amount) {
      ui.notifications.warn("Not enough Digisoul!");
      return false;
    }

    await this.update({
      'system.digisoul.value': systemData.digisoul.value - amount
    });

    return true;
  }

  /**
   * Recover Digisoul
   */
  async recoverDigisoul(amount) {
    const systemData = this.system;
    const newValue = Math.min(systemData.digisoul.value + amount, systemData.digisoul.max);

    await this.update({
      'system.digisoul.value': newValue
    });

    ui.notifications.info(`Recovered ${amount} Digisoul!`);
    return true;
  }
}
