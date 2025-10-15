import { filePath, getSkillDie, toModString } from '../constants.mjs';
import { abilities, classes, proficiencies, specializations, types } from './types.mjs'

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const { ChatMessage } = foundry.documents;

// TODO: move this somewhere more convenient
function toFormGroup(object) {
  return Object.entries(object).map(([value, label]) => ({ value, label }));
}

export class CharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    tag: "form",
    form: {
      submitOnChange: true
    },
    actions: {
      clearTrack: CharacterSheet.clearTrack,
      rollDie: CharacterSheet.rollDie
    }
  }

  static TABS = {
    primary: {
      tabs: [
        { id: "stats", label: "SYSTEM.Tabs.Stats", group: "primary" },
        { id: "about", label: "SYSTEM.Tabs.About", group: "primary" },
        { id: "moves", label: "SYSTEM.Tabs.Moves", group: "primary" },
        { id: "conditions", label: "SYSTEM.Tabs.Conditions", group: "primary" },
        { id: "tracks", label: "SYSTEM.Tabs.Tracks", group: "primary" },
        { id: "feats", label: "SYSTEM.Tabs.Feats", group: "primary" },
      ],
      initial: "stats",
      labelPrefix: "",
    }
  };

  static PARTS = {
    header: { template: filePath("templates/actor-sheet.hbs") },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    stats: { template: filePath("templates/sections/stats.hbs"), scrollable: [""] },
    about: { template: filePath("templates/sections/about.hbs") },
    moves: { template: filePath("templates/sections/moves.hbs") },
    conditions: { template: filePath("templates/sections/conditions.hbs") },
    tracks: { template: filePath("templates/sections/tracks.hbs") },
    feats: { template: filePath("templates/sections/feats.hbs") },
  }

  async _prepareContext(options) {
    return {
      ...await super._prepareContext(options),
      types: toFormGroup(types),
      classes: toFormGroup(classes),
      abilities: toFormGroup(abilities),
      specializations: toFormGroup(specializations),
      proficiencies,
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
    const { sides, modifier } = getSkillDie(this, target.dataset.skill);
    new Roll(`${sides}d6x${toModString(modifier)}`).toMessage({
      speaker: ChatMessage.implementation.getSpeaker({ actor: this.document }),
      flavor: target.dataset.name
    });
  }
}