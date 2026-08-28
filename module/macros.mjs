import { MoveRollDialog, SkillRollDialog } from './roll-dialog.mjs';

export default {
  async openMoveRoll(userId, moveId) {
    new MoveRollDialog({ userId, moveId }).render({ force: true });
  },
  async openSkillRoll(userId, skill) {
    new SkillRollDialog({ userId, skill }).render({ force: true });
  }
}