import { ListData, User, Permission, InviteCode } from '../types';

const STORAGE_KEYS = {
  USERS: 'whimsy_users',
  LISTS: 'whimsy_lists',
  CURRENT_USER: 'whimsy_current_user_id',
  INVITES: 'whimsy_invites', // Store active invite codes
};

// Mock Users simulating WeChat profiles
const MOCK_USERS: User[] = [
  { id: 'wx_user_1', name: 'Kiki (Me)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kiki&backgroundColor=b6e3f4', color: 'bg-red-200' },
  { id: 'wx_user_2', name: 'Totoro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Totoro&backgroundColor=c0aede', color: 'bg-green-200' },
  { id: 'wx_user_3', name: 'Cinnamoroll', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cinna&backgroundColor=ffdfbf', color: 'bg-blue-200' },
];

export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LISTS)) {
    localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify([]));
  }
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : MOCK_USERS;
};

export const getCurrentUser = (): User | null => {
  const id = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!id) return null;
  const users = getUsers();
  return users.find(u => u.id === id) || null;
};

export const loginAsUser = (userId: string) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const getLists = (userId: string): ListData[] => {
  const allLists: ListData[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTS) || '[]');
  return allLists.filter(list => 
    list.ownerId === userId || 
    list.sharedWith.some(share => share.userId === userId)
  );
};

export const createList = (title: string, type: ListData['type'], ownerId: string): ListData => {
  const allLists: ListData[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTS) || '[]');
  const newList: ListData = {
    id: Date.now().toString(),
    title,
    type,
    items: [],
    ownerId,
    createdAt: Date.now(),
    sharedWith: [],
  };
  allLists.push(newList);
  localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(allLists));
  return newList;
};

export const updateList = (updatedList: ListData) => {
  const allLists: ListData[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTS) || '[]');
  const index = allLists.findIndex(l => l.id === updatedList.id);
  if (index !== -1) {
    allLists[index] = updatedList;
    localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(allLists));
  }
};

export const deleteList = (listId: string) => {
  let allLists: ListData[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTS) || '[]');
  allLists = allLists.filter(l => l.id !== listId);
  localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(allLists));
};

export const copyList = (listId: string, newOwnerId: string): ListData | null => {
  const allLists: ListData[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTS) || '[]');
  const sourceList = allLists.find(l => l.id === listId);
  
  if (sourceList) {
    const newList: ListData = {
      ...sourceList,
      id: Date.now().toString(),
      title: `${sourceList.title} (Copy)`,
      ownerId: newOwnerId,
      sharedWith: [], 
      createdAt: Date.now(),
    };
    allLists.push(newList);
    localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(allLists));
    return newList;
  }
  return null;
};

// --- Sharing Logic ---

export const generateInviteCode = (listId: string, permission: Permission.EDITOR | Permission.VIEWER, userId: string): string => {
  const invites: InviteCode[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVITES) || '[]');
  
  // Generate a simple 6-char code
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const newInvite: InviteCode = {
    code,
    listId,
    permission,
    createdBy: userId
  };
  
  invites.push(newInvite);
  localStorage.setItem(STORAGE_KEYS.INVITES, JSON.stringify(invites));
  return code;
};

export const redeemInviteCode = (code: string, userId: string): { success: boolean; message: string; listId?: string } => {
  const invites: InviteCode[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVITES) || '[]');
  const invite = invites.find(i => i.code === code);
  
  if (!invite) {
    return { success: false, message: "Invalid or expired code." };
  }

  const allLists: ListData[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTS) || '[]');
  const listIndex = allLists.findIndex(l => l.id === invite.listId);

  if (listIndex === -1) {
    return { success: false, message: "List no longer exists." };
  }

  const list = allLists[listIndex];

  if (list.ownerId === userId) {
    return { success: false, message: "You already own this list." };
  }

  // Update permissions
  const existingShareIndex = list.sharedWith.findIndex(s => s.userId === userId);
  if (existingShareIndex >= 0) {
    list.sharedWith[existingShareIndex].permission = invite.permission;
  } else {
    list.sharedWith.push({ userId, permission: invite.permission });
  }

  allLists[listIndex] = list;
  localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(allLists));

  return { success: true, message: `Joined list as ${invite.permission}!`, listId: list.id };
};