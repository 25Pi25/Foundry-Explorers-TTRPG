import { filePath, toModString, toMoveString, hasEffectCount, SYSTEM_ID, toSkillString } from './constants.mjs';
import { CharacterSheet, PlayerSheet } from './module/actor-sheet.mjs';
import { CharacterDataModel, MoveDataModel, PlayerDataModel } from "./module/data-models.mjs";
import { SystemToken } from './module/documents.mjs';
import { ExplorersRoll } from './module/explorers-roll.mjs';
import { ItemSheet } from './module/move-sheet.mjs';
import { conditions } from './module/types.mjs';

const { Localization } = foundry.helpers;
const { Die } = foundry.dice.terms;
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
  CONFIG.Dice.rolls = [ExplorersRoll];

  // Configure Sheets.
  Actors.registerSheet(SYSTEM_ID, PlayerSheet, { types: ["Player"], makeDefault: true });
  Actors.registerSheet(SYSTEM_ID, CharacterSheet, { types: ["Character"]});
  Items.registerSheet(SYSTEM_ID, ItemSheet, { makeDefault: true });
  const templates = ["templates/actor/partials/stat-block.hbs",
    "templates/actor/partials/skill-block.hbs",
    "templates/actor/partials/move-block.hbs"].map(filePath);
  foundry.applications.handlebars.loadTemplates(templates);
  Handlebars.registerHelper('modString', toModString);
  Handlebars.registerHelper('skillDie', toSkillString);
  Handlebars.registerHelper('moveDie', toMoveString);
  Handlebars.registerHelper('filePath', filePath);
  Handlebars.registerHelper('hasEffectCount', hasEffectCount);
  Handlebars.registerHelper('equals', (a, b) => a === b);

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
