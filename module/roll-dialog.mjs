import { filePath, getSkillDie, toModString, toFormGroup, getMoveDie } from '../constants.mjs';
import { CharacterDataModel } from './data-models.mjs';
import { advantage, typeMatchups } from './types.mjs';

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
      roll: RollDialog.#roll
    }
  }

  static PARTS = {
    roll: { template: filePath("templates/roll/roll.hbs") },
  }

  constructor(options={}) {
    super(options);
    const { user, move } = options;
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
    const { sides, modifier } = getMoveDie(user, move);
    this.moveInfo = {
      sides,
      modifier
    };
    this.messageMode = 'publicroll';
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.dialogState = this.dialogState;
    context.advantage = advantage;
    context.typeMatchups = typeMatchups;
    context.messageMode = this.messageMode;
    context.moveInfo = this.moveInfo;
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

  static async #roll(event, target) {
    const userSystem = this.user.actor.system;
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
      let multiplier = this.dialogState.multiplier;
      switch (matchup) {
        case 'mostlyIneffective':
          multiplier *= 0.5;
          sides -= 1;
          break;
        case 'notVeryEffective':
          sides -= 1;
          break;
        case 'superEffective':
          sides += 1;
          break;
        case 'extremelyEffective':
          multiplier *= 2;
          sides += 1;
          break;
      }
      let advantageState = this.dialogState.advantage;
      if (advantageState === '') {
        if (userSystem.type1 == this.move.system.type || userSystem.type2 == this.move.system.type) {
          advantageState = 'advantage';
        } else advantageState = 'normal';
      };
      let advantageString = '';
      if (advantageState == 'advantage') advantageString = 'r<3';
      else if (advantageState == 'disadvantage') advantageString = 'r>3';

      new Roll(matchup == 'immune' ? "0" : `${multiplier != 1 ? "floor((" : ""}${sides}d6x${advantageString}${toModString(modifier)}${multiplier != 1 ? `) * ${multiplier})` : ""}`)
      .toMessage({
        speaker: ChatMessage.implementation.getSpeaker({ actor: this.user }),
        flavor: `${this.move.name}${target ? ` (${target.parent.name})` : ""}${this.move.system.description ? ` - ${this.move.system.description}` : ""}`
      }, { rollMode: this.messageMode });
    }
  }
} 