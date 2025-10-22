import { filePath, isStatCondition, SYSTEM_ID, toSkillString } from './constants.mjs';
import { CharacterSheet } from './module/actor-sheet.mjs';
import { CharacterDataModel, MoveDataModel, PlayerDataModel } from "./module/data-models.mjs";
import { SystemToken } from './module/documents.mjs';
import { ItemSheet } from './module/move-sheet.mjs';
import { conditions } from './module/types.mjs';

const { Localization } = foundry.helpers;
const { Actors, Items } = foundry.documents.collections;


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
  Items.registerSheet(SYSTEM_ID, ItemSheet, { makeDefault: true });
  const templates = ["templates/actor/partials/stat-block.hbs", "templates/actor/partials/skill-block.hbs"].map(filePath);
  foundry.applications.handlebars.loadTemplates(templates);
  Handlebars.registerHelper('skillDie', toSkillString);
  Handlebars.registerHelper('filePath', filePath);
  Handlebars.registerHelper('isStatCondition', isStatCondition);

  // Configure trackable attributes.
  CONFIG.Actor.trackableAttributes = {
    Character: {
      bar: ["hp.max"],
      value: ["hp.raw"]
    },
    Player: {
      bar: ["hp.max"],
      value: ["hp.raw"]
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
  Localization.localizeDataModel(PlayerDataModel);
  Localization.localizeDataModel(MoveDataModel);
});
