const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export class CharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    tag: "form",
    form: {
      handler: CharacterSheet.formHandler,
      submitOnChange: false,
      closeOnSubmit: false
    }
  }

  static PARTS = {
    header: { template: `systems/${SYSTEM_ID}/templates/actor-sheet.hbs` }
  }

  static async formHandler(event, form, formData) {

  }
}