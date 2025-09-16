// import { SystemActor, SystemItem } from "./module/documents.mjs";
import { CharacterDataModel, MoveDataModel, PlayerDataModel } from "./module/data-models.mjs";

Hooks.once("init", () => {
  // Configure custom Document implementations.
  // CONFIG.Actor.documentClass = SystemActor;
  // CONFIG.Item.documentClass = SystemItem;

  // Configure System Data Models.
  CONFIG.Actor.dataModels = {
    character: CharacterDataModel,
    player: PlayerDataModel 
  };
  CONFIG.Item.dataModels = {
    move: MoveDataModel
  };

  // Configure trackable attributes.
  CONFIG.Actor.trackableAttributes = {
    hero: {
      bar: ["hp"],
      value: []
    },
    pawn: {
      bar: ["hp"],
      value: []
    }
  };
});

