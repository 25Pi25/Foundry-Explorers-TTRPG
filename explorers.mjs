import { SYSTEM_ID, toModString, toSkillString } from './constants.mjs';
import { CharacterSheet } from './module/actor-sheet.mjs';
import { CharacterDataModel, MoveDataModel, PlayerDataModel } from "./module/data-models.mjs";
import { SystemToken } from './module/documents.mjs';
import { conditions } from './module/types.mjs';

const { Localization } = foundry.helpers;
const { Actors } = foundry.documents.collections;


Hooks.once("init", () => {
  // Configure custom Document implementations.
  CONFIG.Token.documentClass = SystemToken;
  // CONFIG.Actor.documentClass = SystemActor;
  // CONFIG.Item.documentClass = SystemItem;

  // Configure System Data Models.
  CONFIG.Actor.dataModels = {
    Character: CharacterDataModel,
    Player: PlayerDataModel
  };
  CONFIG.Item.dataModels = {
    Move: MoveDataModel
  };

  // Configure Sheets.
  Actors.registerSheet(SYSTEM_ID, CharacterSheet, { makeDefault: true });
  const templates = ["systems/explorers/templates/partials/stat-block.hbs", "systems/explorers/templates/partials/skill-block.hbs"];
  foundry.applications.handlebars.loadTemplates(templates);
  Handlebars.registerHelper('mod', toModString);
  Handlebars.registerHelper('skillDie', toSkillString);

  // Configure trackable attributes.
  CONFIG.Actor.trackableAttributes = {
    Character: {
      bar: ["hp"],
      value: []
    },
    Player: {
      bar: ["hp"],
      value: []
    }
  };

  const statusEffects = [];
  for (const condition in conditions) {
    statusEffects.push({ id: condition, name: conditions[condition], img: "./" })
  }
  CONFIG.statusEffects = statusEffects;
});

Hooks.once("i18nInit", () => {
  Localization.localizeDataModel(CharacterDataModel);
});
