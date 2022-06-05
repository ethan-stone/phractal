import { Note, Permission, Visibility, Role } from "../types";

type CheckPermissionResult = {
  canView: boolean;
  canComment: boolean;
  canEdit: boolean;
  canAdmin: boolean;
};

export class PermissionChecker {
  private note: Note;
  private permission: Permission | null;

  constructor(note: Note, permission: Permission | null) {
    this.note = note;
    this.permission = permission;
  }

  public checkPermission(): CheckPermissionResult {
    const canView =
      this.note.visibility === Visibility.PUBLIC || this.permission !== null;
    const canComment =
      this.permission !== null &&
      (this.permission.role === Role.COMMENTER ||
        this.permission.role === Role.EDITOR ||
        this.permission.role === Role.ADMIN);

    const canEdit =
      this.permission !== null &&
      (this.permission.role === Role.EDITOR ||
        this.permission.role === Role.ADMIN);

    const canAdmin =
      this.permission !== null && this.permission.role === Role.ADMIN;
    return {
      canView,
      canComment,
      canEdit,
      canAdmin
    };
  }
}
