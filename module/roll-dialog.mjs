import { filePath, getSkillDie, toModString, toFormGroup, getMoveDie, getStatusDie, getDieString } from '../constants.mjs';
import { CharacterDataModel } from './data-models.mjs';
import { advantage, effects, skills, typeMatchups } from './types.mjs';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const { ChatMessage } = foundry.documents;
const { Roll } = foundry.dice;

export class RollDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    tag: "form",
    form: {
      submitOnChange: true
    },
    actions: {
      setMessageMode: RollDialog.#setMessageMode
    }
  }

  static PARTS = {
    roll: { template: filePath("templates/roll/roll.hbs") }
  }
  
  constructor(options={}) {
    super(options);
    this.messageMode = 'publicroll';
    this.dialogState = {
      extraDie: 0,
      extraModifier: 0,
      multiplier: 1,
      advantage: '',
      highCrit: false
    };
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.dialogState = this.dialogState;
    context.advantage = advantage;
    context.messageMode = this.messageMode;
    return context;
  }

  _onChangeForm(config, event) {
    super._onChangeForm(config, event);
    const inputName = event.target.dataset.name;
    if (this.dialogState[inputName] !== undefined) {
      if (typeof this.dialogState[inputName] == 'number') {
        this.dialogState[inputName] = Number(event.target.value);
      }
      else if (typeof this.dialogState[inputName] == 'boolean') {
        this.dialogState[inputName] = event.target.checked;
      }
      else this.dialogState[inputName] = event.target.value;
    }
  }

  static getDialogDie(dialog) {
    return {
      sides: dialog.dialogState.extraDie,
      modifier: dialog.dialogState.extraModifier,
      advantage: dialog.dialogState.advantage,
      multiplier: dialog.dialogState.multiplier,
      highCrit: dialog.dialogState.highCrit
    }
  }

  static #setMessageMode(event, target) {
    this.messageMode = target.dataset.messagemode;
    this.render();
  }
}

export class SkillRollDialog extends RollDialog {
  static DEFAULT_OPTIONS = {
    actions: {
      roll: SkillRollDialog.#rollSkill
    }
  }

  get title() {
    const skillDie = getSkillDie(this.user, this.skill);
    if (!skillDie) return this.move.name;
    const { sides, modifier } = skillDie;
    return `${this.user.name}: ${game.i18n.localize(skills[this.skill])} (Base ${sides}d6x+${modifier})`;
  }

  constructor(options={}) {
    const { userId, skill } = options;
    const user = options.user ?? game.actors.get(userId);
    if (!user) throw new Error("No user given.");
    if (!skill) throw new Error("No skill given.");
    super(options);
    this.user = user;
    this.skill = skill;
  }

  static #rollSkill() {
    const die = RollDialog.getDialogDie(this);
    const { sides, modifier } = getSkillDie(this.user, this.skill);
    die.sides += sides;
    die.modifier += modifier;
    const targetRolls = game.user.targets.size > 0 ? game.user.targets.map(target => target.actor.system) : [null];
    for (const target of targetRolls) {
      new Roll(getDieString(die))
        .toMessage({
          speaker: ChatMessage.implementation.getSpeaker({ actor: this.user }),
          flavor: `${game.i18n.localize(skills[this.skill])}${target ? ` (${target.parent.name})` : ""}`
        }, { rollMode: this.messageMode });
    }
  }
}

export class MoveRollDialog extends RollDialog {
  static DEFAULT_OPTIONS = {
    actions: {
      roll: MoveRollDialog.#rollDamage,
      rollStatus: MoveRollDialog.#rollStatus
    }
  }

  get title() {
    const moveDie = getMoveDie(this.user, this.move);
    if (!moveDie) return this.move.name;
    const { sides, modifier } = moveDie;
    return `${this.user.name}: ${this.move.name} (Base ${sides}d6x+${modifier})`;
  }

  constructor(options={}) {
    const { userId, moveId } = options;
    const user = options.user ?? game.actors.get(userId);
    const move = options.move ?? user.items.get(moveId) ?? game.items.get(moveId);
    if (!user) throw new Error("No user given.");
    if (!move) throw new Error("No move given.");
    const { sides, modifier } = getMoveDie(user, move);
    options.sides = sides;
    options.modifier = modifier;
    super(options);

    this.user = user;
    this.move = move;
    this.dialogState.typeMatchup = '';
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.typeMatchups = typeMatchups;
    context.triggers = this.move.system.getTriggerTypes();
    context.hasPower = this.move.system.power > 0;
    context.isMove = true;
    return context;
  }

  static async #rollDamage() {
    const userSystem = this.user.system;
    const die = RollDialog.getDialogDie(this);
    let { sides, modifier } = getMoveDie(this.user, this.move);
    die.sides += sides;
    die.modifier += modifier;
    const targetRolls = game.user.targets.size > 0 ? game.user.targets.map(target => target.actor.system) : [null];
    for (const target of targetRolls) {
      let matchup = this.dialogState.typeMatchup;
      if (matchup === '' && target) {
        matchup = target.getTypeMatchup(this.move.system.type);
      }
      let additionString = "";
      switch (matchup) {
        case 'mostlyIneffective':
          die.multiplier *= 0.5;
          die.sides -= 1;
          additionString += `<span style=\"color:red;font-weight:bold;\">+${game.i18n.localize(typeMatchups[matchup])}</span><br>`;
          break;
        case 'notVeryEffective':
          die.sides -= 1;
          die.additionString += `<span style=\"color:red;font-weight:bold;\">+${game.i18n.localize(typeMatchups[matchup])}</span><br>`;
          break;
        case 'superEffective':
          die.sides += 1;
          die.additionString += `<span style=\"color:green;font-weight:bold;\">+${game.i18n.localize(typeMatchups[matchup])}</span><br>`;
          break;
        case 'extremelyEffective':
          die.multiplier *= 2;
          die.sides += 1;
          additionString += `<span style=\"color:green;font-weight:bold;\">+${game.i18n.localize(typeMatchups[matchup])}</span><br>`;
          break;
        case 'immune':
          die.multiplier = 0;
          additionString += `<span style=\"color:red;font-weight:bold;\">+${game.i18n.localize(typeMatchups[matchup])}</span><br>`;
          break;
      }
      if (die.advantage === '') {
        if (userSystem.type1 == this.move.system.type || userSystem.type2 == this.move.system.type) {
          die.advantage = 'advantage';
          additionString += "<span style=\"color:green;font-weight:bold;\">+STAB</span><br>";
        } else die.advantage = 'normal';
      };

      new Roll(getDieString(die))
      .toMessage({
        speaker: ChatMessage.implementation.getSpeaker({ actor: this.user }),
        flavor: `${additionString}${this.move.name}${target ? ` (${target.parent.name})` : ""} - Power`
      }, { rollMode: this.messageMode });
    }
  }

  static async #rollStatus() {
    const statusDie = getStatusDie(this.user, this.move);
    if (this.move.system.power == 0) {
      const { sides, modifier } = RollDialog.getDialogDie(this);
      statusDie.sides = sides;
      statusDie.modifier = modifier;
    }
    const targetRolls = game.user.targets.size > 0 ? game.user.targets.map(target => target.actor.system) : [null];
    for (const target of targetRolls) {
      const hitEffects = [];
      this.move.system.getTriggerEffects('hit').forEach(effect => {
        hitEffects.push(game.i18n.localize(effects[effect.effect]))
      });

      new Roll(getDieString(statusDie)) // not including adv/mult for status checks
      .toMessage({
        speaker: ChatMessage.implementation.getSpeaker({ actor: this.user }),
        flavor: `${this.move.name}${target ? ` (${target.parent.name})` : ""} - Status (${hitEffects.join()})`
      }, { rollMode: this.messageMode });
    }
  }
} 