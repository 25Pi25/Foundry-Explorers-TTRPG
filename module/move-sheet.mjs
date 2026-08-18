import { filePath, hasEffectCount, toFormGroup } from '../constants.mjs';
import { effects, ranges, tags, targets, triggerTypes, types } from './types.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;
const { ChatMessage } = foundry.documents;

export class MoveSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    tag: "form",
    form: {
      submitOnChange: true,
    },
    position: {
      width: 600,
    },
    actions: {
      addEffectGroup: MoveSheet.addEffectGroup,
      deleteEffectGroup: MoveSheet.deleteEffectGroup,
      addEffect: MoveSheet.addEffect,
      deleteEffect: MoveSheet.deleteEffect,
      addTag: MoveSheet.addTag,
      deleteTag: MoveSheet.deleteTag,
    }
  }

  static PARTS = {
    move: { template: filePath("templates/move/move.hbs") },
    options: { template: filePath("templates/move/move-options.hbs"), scrollable: ["", ".effect-set"] },
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
    const tagGroups = Object.entries(this.document.system.tags).map(([id, value]) => ({
      namePrefix: `system.tags.${id}`,
      field: this.document.system.schema.fields.tags.element,
      value,
      id,
    }));
    return {
      ...await super._prepareContext(options),
      systemFields: this.document.system.schema.fields,
      types,
      targets,
      ranges,
      effectGroups,
      triggerTypes,
      effects,
      tags,
      tagGroups,
      isEditable: this.isEditable
    };
  }

  _processFormData(event, form, formData) {
    const submitData = super._processFormData(event, form, formData);
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
    if (!['away', 'ahead', 'range'].includes(submitData.system.range)) {
      submitData.system.rangeCount = null;
    }
    for (const group of Object.values(submitData.system.effects ?? {})) {
      for (const appliedEffect of Object.values(group.appliedEffects ?? {})) {
        if (!hasEffectCount(appliedEffect.effect)) {
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

  static addTag() {
    this.document.update({
      system: {
        tags: {
          [foundry.utils.randomID()]: this.document.system.schema.fields.tags.element.getInitialValue()
        }
      }
    });
  }

  static deleteTag(event, target) {
    const id = target.dataset.tagId;
    this.document.update({ [`system.tags.-=${id}`]: null });
  }
}