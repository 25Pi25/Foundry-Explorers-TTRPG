import { filePath, isStatCondition, toFormGroup } from '../constants.mjs';
import { MoveDataModel } from './data-models.mjs';
import { ranges, targets, types } from './types.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;
const { ChatMessage } = foundry.documents;

export class ItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    tag: "form",
    form: {
      submitOnChange: true,
    },
    position: {
      width: 600,
    },
    actions: {
      addEffectGroup: ItemSheet.addEffectGroup,
      deleteEffectGroup: ItemSheet.deleteEffectGroup,
      addEffect: ItemSheet.addEffect,
      deleteEffect: ItemSheet.deleteEffect,
    }
  }

  static PARTS = {
    move: { template: filePath("templates/move/move.hbs") },
    options: { template: filePath("templates/move/move-options.hbs"), scrollable: [".effect-set"] },
  }

  async _prepareContext(options) {
    const effectGroups = Object.entries(this.document.system.effects).map(([id, values]) => ({
      namePrefix: `system.effects.${id}.`,
      // TODO: get label prefix from other values in context
      labelPrefix: "SYSTEM.Models.Move.FIELDS.effects.",
      fields: this.document.system.schema.fields.effects.element.fields,
      values,
      id,
    }));
    for (const effectGroup of effectGroups) {
      effectGroup.effects = Object.entries(effectGroup.values.appliedEffects).map(([id, values]) => ({
        namePrefix: `${effectGroup.namePrefix}appliedEffects.${id}.`,
        labelPrefix: `${effectGroup.labelPrefix}appliedEffects.`,
        fields: effectGroup.fields.appliedEffects.element.fields,
        values,
        id
      }));
    }
    return {
      ...await super._prepareContext(options),
      systemFields: this.document.system.schema.fields,
      types,
      targets,
      ranges,
      effectGroups
    };
  }

  _processFormData(event, form, formData) {
    const submitData = super._processFormData(event, form, formData);
    if (!submitData.system.isStatus) {
      submitData.system.offensiveCheck = null;
      submitData.system.defensiveCheck = null;
    }
    if (!submitData.system.withRangeLevel) {
      submitData.system.rangeCount = null;
    }
    // TODO: check null exactly for else branches instead of falsy
    if (submitData.system.target === 'self') {
      submitData.system.range = null;
    } else if (!submitData.system.range) {
      submitData.system.range = 'front';
    }
    if (submitData.system.range === 'special') {
      submitData.system.target = null;
    } else if (!submitData.system.target) {
      submitData.system.target = 'foe';
    }
    for (const group of Object.values(submitData.system.effects ?? {})) {
      for (const appliedEffect of Object.values(group.appliedEffects ?? {})) {
        if (!isStatCondition(appliedEffect.effect)) {
          appliedEffect.effectCount = null;
        }
      }
    }
    return submitData;
  }

  static addEffectGroup() {
    this.document.update({
      system: {
        effects: {
          [foundry.utils.randomID()]: this.document.system.schema.fields.effects.element.getInitialValue()
        }
      }
    });
  }

  static deleteEffectGroup(event, target) {
    const id = target.dataset.effectGroupId;
    this.document.update({ [`system.effects.-=${id}`]: null });
  }

  static addEffect(event, target) {
    this.document.update({
      system: {
        effects: {
          [target.dataset.effectGroupId]: {
            appliedEffects: {
              [foundry.utils.randomID()]: this.document.system.schema.fields.effects.element.fields.appliedEffects.element.getInitialValue()
            }
          }
        }
      }
    });
  }

  static deleteEffect(event, target) {
    const groupId = target.dataset.effectGroupId;
    const id = target.dataset.effectId;
    this.document.update({ [`system.effects.${groupId}.appliedEffects.-=${id}`]: null });
  }
}