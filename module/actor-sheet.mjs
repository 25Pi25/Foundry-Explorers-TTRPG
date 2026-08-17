import { filePath, getSkillDie, toModString, toFormGroup, getMoveDie } from '../constants.mjs';
import { RollDialog } from './roll-dialog.mjs';
import { abilities, classes, proficiencies, specializations, categories, types, skills, effects } from './types.mjs'

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const { ChatMessage } = foundry.documents;

export class CharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    tag: "form",
    form: {
      submitOnChange: true
    },
    actions: {
      clearTrack: CharacterSheet.clearTrack,
      rollDie: CharacterSheet.rollDie,
      rollMoveDie: CharacterSheet.rollMoveDie,
      removeMove: CharacterSheet.removeMove,
      editPP: CharacterSheet.editPP
    }
  }

  static TABS = {
    primary: {
      tabs: [
        { id: "stats", label: "SYSTEM.Tabs.Stats", group: "primary" },
        { id: "about", label: "SYSTEM.Tabs.About", group: "primary" },
        { id: "moves", label: "SYSTEM.Tabs.Moves", group: "primary" },
        { id: "conditions", label: "SYSTEM.Tabs.Conditions", group: "primary" },
        { id: "feats", label: "SYSTEM.Tabs.Feats", group: "primary" },
      ],
      initial: "stats",
      labelPrefix: "",
    }
  };

  static PARTS = {
    header: { template: filePath("templates/actor/actor-sheet.hbs") },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    stats: { template: filePath("templates/actor/sections/stats.hbs"), scrollable: [""] },
    about: { template: filePath("templates/actor/sections/about.hbs") },
    moves: { template: filePath("templates/actor/sections/moves.hbs") },
    conditions: { template: filePath("templates/actor/sections/conditions.hbs") },
    feats: { template: filePath("templates/actor/sections/feats.hbs") },
  }

  async _prepareContext(options) {
    return {
      ...await super._prepareContext(options),
      moves: this.actor.items.filter(item => item.type === "Move"),
      types: toFormGroup(types),
      classes: toFormGroup(classes),
      specializations: toFormGroup(specializations),
      abilities,
      proficiencies,
      typesRecord: types,
      categories,
      skills,
      effects,
      systemFields: this.document.system.schema.fields,
      tabs: this._prepareTabs("primary"),
    };
  }

  static clearTrack() {
    const friendship = this.document.system.friendship;
    if (!friendship.isClearable) return;
    this.document.update({
      system: {
        friendship: {
          track: 0,
          dice: friendship.dice + 1,
          cleared: friendship.cleared + 1,
        }
      }
    });
  }

  static async rollDie(event, target) {
    const { sides, modifier } = getSkillDie(this.document, target.dataset.skill);
    new Roll(`${sides}d6x${toModString(modifier)}`).toMessage({
      speaker: ChatMessage.implementation.getSpeaker({ actor: this.document }),
      flavor: target.dataset.name
    });
  }

  static async rollMoveDie(event, target) {
    const move = this.actor.items.get(target.dataset.id);
    new RollDialog({ user: this.actor, move }).render({ force: true });
    // const { sides, modifier } = getMoveDie(this, move);
    // new Roll(`${sides}d6x${toModString(modifier)}`).toMessage({
    //   speaker: ChatMessage.implementation.getSpeaker({ actor: this.document }),
    //   flavor: `${move.name}${move.system.description ? ` - ${move.system.description}` : ""}`
    // });
  }

  static async removeMove(event, target) {
    const moveId = target.dataset.id;
    this.actor.items.get(moveId).delete();
  }

  static async editPP(event, target) {
    console.log(event, target)
  }
}

export class PlayerSheet extends CharacterSheet {
  static PARTS = {
    ...super.PARTS,
    tracks: { template: filePath("templates/actor/sections/tracks.hbs") }
  }

  static TABS = {
    ...super.TABS,
    primary: {
      ...super.TABS.primary,
      tabs: [
        ...super.TABS.primary.tabs,
        { id: "tracks", label: "SYSTEM.Tabs.Tracks", group: "primary" },
      ],
    }
  };

  async _prepareContext(options) {
    return {
      ...await super._prepareContext(options),
      isPlayerSheet: true
    };
  }
}