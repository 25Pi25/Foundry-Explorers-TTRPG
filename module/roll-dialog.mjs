import { filePath, getSkillDie, toModString, toFormGroup, getMoveDie, getStatusDie } from '../constants.mjs';
import { CharacterDataModel } from './data-models.mjs';
import { advantage, effects, typeMatchups } from './types.mjs';

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
      setMessageMode: RollDialog.#setMessageMode,
      rollDamage: RollDialog.#rollDamage,
      rollStatus: RollDialog.#rollStatus
    }
  }

  static PARTS = {
    roll: { template: filePath("templates/roll/roll.hbs") },
  }

  get title() {
    const moveDie = getMoveDie(this.user, this.move);
    if (!moveDie) return this.move.name;
    const { sides, modifier } = moveDie;
    return `${this.user.name}: ${this.move.name} (Base ${sides}d6x+${modifier})`;
  }

  constructor(options={}) {
    super(options);
    const { userId, moveId } = options;
    const user = options.user ?? game.actors.get(userId);
    const move = options.move ?? user.items.get(moveId) ?? game.items.get(moveId);
    if (!user) throw new Error("No user given.");
    if (!move) throw new Error("No move given.");
    this.user = user;
    this.move = move;
    this.window.title = `${this.move.name}: ${this.user.name}`;
    this.dialogState = {
      extraPower: 0,
      extraModifier: 0,
      multiplier: 1,
      advantage: '',
      typeMatchup: ''
    };
    this.messageMode = 'publicroll';
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.dialogState = this.dialogState;
    context.advantage = advantage;
    context.typeMatchups = typeMatchups;
    context.messageMode = this.messageMode;
    context.triggers = this.move.system.getTriggerTypes();
    context.hasPower = this.move.system.power > 0;
    return context;
  }

  _onChangeForm(config, event) {
    super._onChangeForm(config, event);
    const inputName = event.target.dataset.name;
    if (this.dialogState[inputName] !== undefined) {
      if (typeof this.dialogState[inputName] == 'number') {
        this.dialogState[inputName] = Number(event.target.value);
      }
      else this.dialogState[inputName] = event.target.value;
    }
  }

  static #setMessageMode(event, target) {
    this.messageMode = target.dataset.messagemode;
    this.render();
  }

  static async #rollDamage() {
    const userSystem = this.user.system;
    let { sides, modifier } = getMoveDie(this.user, this.move);
    sides += this.dialogState.extraPower;
    modifier += this.dialogState.extraModifier;
    let targetRolls = game.user.targets.map(target => target.actor.system);
    if (targetRolls.size == 0) targetRolls = [null];
    for (const target of targetRolls) {
      let matchup = this.dialogState.typeMatchup;
      if (matchup === '' && target) {
        matchup = target.getTypeMatchup(this.move.system.type);
      }
      let additionString = "";
      let multiplier = this.dialogState.multiplier;
      switch (matchup) {
        case 'mostlyIneffective':
          multiplier *= 0.5;
          sides -= 1;
          additionString += `<span style=\"color:red;font-weight:bold;\">+${game.i18n.localize(typeMatchups[matchup])}</span><br>`;
          break;
        case 'notVeryEffective':
          sides -= 1;
          additionString += `<span style=\"color:red;font-weight:bold;\">+${game.i18n.localize(typeMatchups[matchup])}</span><br>`;
          break;
        case 'superEffective':
          sides += 1;
          additionString += `<span style=\"color:green;font-weight:bold;\">+${game.i18n.localize(typeMatchups[matchup])}</span><br>`;
          break;
        case 'extremelyEffective':
          multiplier *= 2;
          sides += 1;
          additionString += `<span style=\"color:green;font-weight:bold;\">+${game.i18n.localize(typeMatchups[matchup])}</span><br>`;
          break;
        case 'immune':
          multiplier = 0;
          additionString += `<span style=\"color:red;font-weight:bold;\">+${game.i18n.localize(typeMatchups[matchup])}</span><br>`;
          break;
      }
      let advantageState = this.dialogState.advantage;
      if (advantageState === '') {
        if (userSystem.type1 == this.move.system.type || userSystem.type2 == this.move.system.type) {
          advantageState = 'advantage';
          additionString += "<span style=\"color:green;font-weight:bold;\">+STAB</span><br>";
        } else advantageState = 'normal';
      };
      let advantageString = '';
      if (advantageState == 'advantage') advantageString = 'r<3';
      else if (advantageState == 'disadvantage') advantageString = 'r>3';

      new Roll(`${multiplier != 1 ? "floor((" : ""}${sides}d6x${advantageString}${toModString(modifier)}${multiplier != 1 ? `) * ${multiplier})` : ""}`)
      .toMessage({
        speaker: ChatMessage.implementation.getSpeaker({ actor: this.user }),
        flavor: `${additionString}${this.move.name}${target ? ` (${target.parent.name})` : ""} - Power`
      }, { rollMode: this.messageMode });
    }
  }

  static async #rollStatus() {
    let { sides, modifier } = getStatusDie(this.user, this.move);
    sides += this.dialogState.extraPower;
    modifier += this.dialogState.extraModifier;
    let targetRolls = game.user.targets.map(target => target.actor.system);
    if (targetRolls.size == 0) targetRolls = [null];
    for (const target of targetRolls) {
      const hitEffects = [];
      this.move.system.getTriggerEffects('hit').forEach(effect => {
        hitEffects.push(game.i18n.localize(effects[effect.effect]))
      });

      new Roll(`${sides}d6x${toModString(modifier)}`)
      .toMessage({
        speaker: ChatMessage.implementation.getSpeaker({ actor: this.user }),
        flavor: `${this.move.name}${target ? ` (${target.parent.name})` : ""} - Status (${hitEffects.join()})`
      }, { rollMode: this.messageMode });
    }
  }
} 