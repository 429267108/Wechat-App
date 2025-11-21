export enum Permission {
  OWNER = 'owner',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export interface ListItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ListData {
  id: string;
  title: string;
  type: 'todo' | 'wishlist' | 'shopping' | 'general';
  items: ListItem[];
  ownerId: string;
  createdAt: number;
  sharedWith: {
    userId: string;
    permission: Permission.EDITOR | Permission.VIEWER;
  }[];
}

export interface InviteCode {
  code: string;
  listId: string;
  permission: Permission.EDITOR | Permission.VIEWER;
  createdBy: string;
}

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  list: ListData;
  onShare: (permission: Permission) => void;
}