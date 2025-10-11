import { filePath } from '../constants.mjs';
import { abilities, classes, specializations, types } from './types.mjs'

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

// TODO: move this somewhere more convenient
const toFormGroup = obj => Object.entries(obj).map(([value, label]) => ({ value, label }));

export class CharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    tag: "form",
    form: {
      submitOnChange: true
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
    stats: { template: filePath("templates/sections/stats.hbs") },
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
      systemFields: this.document.system.schema.fields,
      tabs: this._prepareTabs("primary")
    };
  }
}