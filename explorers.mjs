// import { SystemActor, SystemItem } from "./module/documents.mjs";
import { CharacterDataModel, MoveDataModel, PlayerDataModel } from "./module/data-models.mjs";

Hooks.once("init", () => {
  // Configure custom Document implementations.
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

