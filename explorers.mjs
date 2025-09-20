// import { SystemActor, SystemItem } from "./module/documents.mjs";
import { CharacterSheet } from './module/actor-sheet.mjs';
import { CharacterDataModel, MoveDataModel, PlayerDataModel } from "./module/data-models.mjs";
import { SystemToken } from './module/documents.mjs';

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
});

