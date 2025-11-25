
import React, { useState, useEffect } from 'react';
import { 
  initStorage, getCurrentUser, loginAsUser, logout, 
  getLists, createList, updateList, deleteList, 
  generateInviteCode, redeemInviteCode, getUsers, copyList 
} from './services/storageService';
import { suggestListItems } from './services/geminiService';
import { User, ListData, Permission, ListItem } from './types';
import { CuteButton, Card, Avatar, Badge, Modal } from './components/Shared';

// --- Screens & Components ---

const LoginScreen: React.FC<{ users: User[]; onLogin: (uid: string) => void }> = ({ users, onLogin }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fefbf5] relative overflow-hidden">
    {/* Background Decor */}
    <div className="absolute top-0 left-0 w-64 h-64 bg-sanrio-pink/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
    <div className="absolute bottom-0 right-0 w-80 h-80 bg-ghibli-green/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

    <div className="z-10 w-full max-w-xs text-center space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-display font-bold text-slate-800 tracking-tight">
          Whimsy<span className="text-sanrio-pink">Lists</span>
        </h1>
        <p className="text-slate-500 font-medium">Dream it. List it. Share it.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Select User</p>
        <div className="space-y-3">
          {users.map(u => (
            <button 
              key={u.id}
              onClick={() => onLogin(u.id)}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white transition-all border border-transparent hover:border-sanrio-blue/30 hover:shadow-md group"
            >
              <Avatar url={u.avatar} name={u.name} size="sm" />
              <span className="font-display font-bold text-slate-600 group-hover:text-sanrio-blue">{u.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2 justify-center text-slate-400 text-xs">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.625 0C3.863 0 0 3.328 0 7.438c0 2.266 1.172 4.305 3.086 5.703-.156.57-.539 1.93-.617 2.227 0 0-.133.484.266.484.32 0 2.336-1.445 2.633-1.633.969.266 2.008.422 3.094.422h.164c-.078-.57-.164-1.148-.164-1.742 0-4.914 4.367-8.906 9.75-8.906 2.102 0 4.055.64 5.68 1.742C22.836 2.383 18.242 0 13.03 0H8.625zM13.68 5.703c-4.766 0-8.625 3.531-8.625 7.89 0 4.36 3.859 7.891 8.625 7.891 1.078 0 2.117-.172 3.086-.469.359.227 2.461 1.766 2.844 1.766.445 0 .305-.586.305-.586-.086-.344-.5-1.867-.672-2.539 2.14-1.508 3.453-3.719 3.453-6.18 0-4.36-3.86-7.773-8.625-7.773z"/></svg>
        <span>WeChat Mini Program</span>
      </div>
    </div>
  </div>
);

const ListCard: React.FC<{ 
  list: ListData; 
  currentUser: User; 
  onClick: () => void; 
}> = ({ list, currentUser, onClick }) => {
  const isOwner = list.ownerId === currentUser.id;
  const permission = list.sharedWith.find(s => s.userId === currentUser.id)?.permission;
  const itemCount = list.items.filter(i => !i.completed).length;
  const totalCount = list.items.length;
  const progress = totalCount > 0 ? ((totalCount - itemCount) / totalCount) * 100 : 0;

  return (
    <div onClick={onClick} className="relative group cursor-pointer active:scale-98 transition-transform duration-150">
      <Card className="p-5 h-full min-h-[180px] flex flex-col justify-between relative overflow-hidden border-2 border-transparent hover:border-sanrio-pink/30">
        {/* Progress Bar Background */}
        <div className="absolute bottom-0 left-0 h-1.5 bg-slate-100 w-full">
          <div className="h-full bg-sanrio-pink transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xl font-display font-bold text-slate-700 leading-tight">{list.title}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{list.type}</p>
          </div>
          {isOwner ? (
             <div className="bg-yellow-100 text-yellow-600 p-1.5 rounded-full">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
             </div>
          ) : permission === Permission.EDITOR ? (
            <Badge color="bg-green-100 text-green-600">Editor</Badge>
          ) : (
            <Badge color="bg-blue-50 text-blue-500">Viewer</Badge>
          )}
        </div>

        <div className="mt-6 flex items-end justify-between">
          <div className="flex -space-x-3 pl-1">
             {list.sharedWith.length > 0 && (
               <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                 +{list.sharedWith.length}
               </div>
             )}
             <div className="w-8 h-8 rounded-full bg-sanrio-pink/20 border-2 border-white flex items-center justify-center">
               <span className="text-xs">👑</span>
             </div>
          </div>
          
          <div className="text-right">
            <span className="text-2xl font-display font-bold text-slate-700">{itemCount}</span>
            <span className="text-xs text-slate-400 font-medium ml-1">left</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [lists, setLists] = useState<ListData[]>([]);
  
  // Navigation State
  const [view, setView] = useState<'login' | 'dashboard' | 'detail'>('login');
  const [activeListId, setActiveListId] = useState<string | null>(null);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  
  // Note Modal States
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNoteItem, setCurrentNoteItem] = useState<{id: string, text: string, note: string} | null>(null);
  const [noteInput, setNoteInput] = useState('');

  // Form States
  const [createTitle, setCreateTitle] = useState('');
  const [createType, setCreateType] = useState<ListData['type']>('todo');
  
  // Share States
  const [sharePermission, setSharePermission] = useState<Permission.VIEWER | Permission.EDITOR>(Permission.VIEWER);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  
  // Detail View States
  const [newItemText, setNewItemText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    initStorage();
    setUsers(getUsers());
    const stored = getCurrentUser();
    if (stored) {
      setCurrentUserState(stored);
      setLists(getLists(stored.id));
      setView('dashboard');
    }
  }, []);

  // Reset title editing when switching lists
  useEffect(() => {
    setIsEditingTitle(false);
    setEditedTitle('');
  }, [activeListId]);

  // --- Actions ---

  const handleLogin = (uid: string) => {
    loginAsUser(uid);
    const user = users.find(u => u.id === uid);
    if (user) {
      setCurrentUserState(user);
      setLists(getLists(uid));
      setView('dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUserState(null);
    setView('login');
  };

  const refreshLists = () => {
    if (currentUser) setLists(getLists(currentUser.id));
  };

  const handleCreate = () => {
    if (!createTitle.trim() || !currentUser) return;
    createList(createTitle, createType, currentUser.id);
    setCreateTitle('');
    setShowCreateModal(false);
    refreshLists();
  };

  const handleShare = () => {
    if (!activeListId || !currentUser) return;
    // Generate code
    const code = generateInviteCode(activeListId, sharePermission, currentUser.id);
    setGeneratedCode(code);
  };

  const handleJoin = () => {
    if (!joinCode.trim() || !currentUser) return;
    const result = redeemInviteCode(joinCode.toUpperCase(), currentUser.id);
    alert(result.message);
    if (result.success) {
      setShowJoinModal(false);
      setJoinCode('');
      refreshLists();
    }
  };

  const handleDeleteList = () => {
    if (activeListId && confirm("Delete this list?")) {
      deleteList(activeListId);
      setActiveListId(null);
      setView('dashboard');
      refreshLists();
    }
  };

  const handleCopyList = () => {
    if (activeListId && currentUser) {
      copyList(activeListId, currentUser.id);
      refreshLists();
      alert("List copied to your dashboard!");
    }
  };

  // --- Detail Actions ---
  const activeList = lists.find(l => l.id === activeListId);
  const canEdit = activeList && currentUser ? (
    activeList.ownerId === currentUser.id || 
    activeList.sharedWith.find(s => s.userId === currentUser.id)?.permission === Permission.EDITOR
  ) : false;

  const handleUpdateItems = (newItems: ListItem[]) => {
    if (activeList) {
      const updated = { ...activeList, items: newItems };
      updateList(updated);
      setLists(prev => prev.map(l => l.id === updated.id ? updated : l));
    }
  };

  const handleToggleItem = (itemId: string) => {
    if (!activeList || !canEdit) return;
    
    const item = activeList.items.find(i => i.id === itemId);
    if (!item) return;

    const newCompleted = !item.completed;
    
    // Optimistic update
    const updatedItems = activeList.items.map(i => 
      i.id === itemId ? { ...i, completed: newCompleted } : i
    );
    handleUpdateItems(updatedItems);

    // If marking as completed, offer to add a note
    if (newCompleted) {
      setCurrentNoteItem({ id: item.id, text: item.text, note: item.note || '' });
      setNoteInput(item.note || '');
      setShowNoteModal(true);
    }
  };

  const handleSaveNote = () => {
    if (!currentNoteItem || !activeList) return;
    
    const updatedItems = activeList.items.map(i => 
      i.id === currentNoteItem.id ? { ...i, note: noteInput } : i
    );
    handleUpdateItems(updatedItems);
    setShowNoteModal(false);
    setCurrentNoteItem(null);
  };

  const handleAddItem = () => {
    if (!newItemText.trim() || !canEdit || !activeList) return;
    const newItem: ListItem = { id: Date.now().toString(), text: newItemText, completed: false };
    handleUpdateItems([...activeList.items, newItem]);
    setNewItemText('');
  };

  const handleAiSuggest = async () => {
    if (!canEdit || !activeList) return;
    setIsThinking(true);
    const suggestions = await suggestListItems(activeList.title, activeList.type);
    const newItems = suggestions.map(text => ({
      id: Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
    }));
    handleUpdateItems([...activeList.items, ...newItems]);
    setIsThinking(false);
  };

  const handleUpdateTitle = () => {
    if (activeList && editedTitle.trim()) {
      const updated = { ...activeList, title: editedTitle.trim() };
      updateList(updated);
      setLists(prev => prev.map(l => l.id === updated.id ? updated : l));
    }
    setIsEditingTitle(false);
  };

  // --- Renders ---

  if (view === 'login' || !currentUser) {
    return <LoginScreen users={users} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#fefbf5] text-slate-700 pb-10">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#fefbf5]/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-100">
        {view === 'detail' ? (
          <button onClick={() => setView('dashboard')} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors z-10">
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
        ) : (
          <div className="flex items-center gap-2 z-10">
             <Avatar url={currentUser.avatar} name={currentUser.name} size="sm" />
             <span className="font-display font-bold text-slate-700">{currentUser.name}</span>
          </div>
        )}
        
        <div className="absolute left-1/2 -translate-x-1/2 flex justify-center max-w-[60%]">
          {view === 'detail' && activeList ? (
            isEditingTitle ? (
              <input 
                autoFocus
                className="bg-transparent border-b-2 border-sanrio-pink text-slate-800 text-center font-display font-bold text-lg focus:outline-none w-full min-w-[120px]"
                value={editedTitle}
                onChange={e => setEditedTitle(e.target.value)}
                onBlur={handleUpdateTitle}
                onKeyDown={e => e.key === 'Enter' && handleUpdateTitle()}
              />
            ) : (
              <button 
                onClick={() => {
                  if (canEdit) {
                    setEditedTitle(activeList.title);
                    setIsEditingTitle(true);
                  }
                }}
                disabled={!canEdit}
                className={`font-display font-bold text-lg text-slate-800 truncate flex items-center gap-2 ${canEdit ? 'hover:text-sanrio-pink' : ''}`}
              >
                <span className="truncate">{activeList.title}</span>
                {canEdit && <svg className="w-3 h-3 text-slate-400 opacity-50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>}
              </button>
            )
          ) : (
            <h1 className="font-display font-bold text-lg text-slate-800">My Lists</h1>
          )}
        </div>

        <div className="flex items-center gap-2 z-10">
          {view === 'dashboard' && (
            <button onClick={handleLogout} className="text-xs font-medium text-slate-400 hover:text-red-400">Exit</button>
          )}
          {view === 'detail' && activeList?.ownerId === currentUser.id && (
            <button onClick={() => { setGeneratedCode(null); setShowShareModal(true); }} className="bg-slate-100 p-2 rounded-full text-slate-600 hover:bg-green-100 hover:text-green-600 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            </button>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="p-4 max-w-2xl mx-auto">
        
        {/* Dashboard */}
        {view === 'dashboard' && (
          <>
             {/* Join Card */}
             <div className="mb-6 bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-slate-700">Have a code?</h3>
                  <p className="text-xs text-slate-400">Enter a code to join a friend's list.</p>
                </div>
                <CuteButton variant="secondary" onClick={() => setShowJoinModal(true)} className="text-sm py-2 px-4">
                   Join List
                </CuteButton>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {lists.map(list => (
                 <ListCard 
                   key={list.id} 
                   list={list} 
                   currentUser={currentUser}
                   onClick={() => { setActiveListId(list.id); setView('detail'); }}
                 />
               ))}
               <button 
                 onClick={() => setShowCreateModal(true)}
                 className="h-full min-h-[180px] border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 hover:border-sanrio-pink hover:text-sanrio-pink hover:bg-pink-50 transition-all gap-2"
               >
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                 <span className="font-display font-bold">Create List</span>
               </button>
             </div>
          </>
        )}

        {/* Detail View */}
        {view === 'detail' && activeList && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            
            {/* Permission Banner */}
            {!canEdit && (
               <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl mb-4 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                   View Only
                 </div>
                 <button onClick={handleCopyList} className="text-xs bg-white text-blue-500 px-3 py-1.5 rounded-lg font-bold shadow-sm hover:bg-blue-500 hover:text-white transition-colors">
                   Make Copy
                 </button>
               </div>
            )}

            {/* Items */}
            <div className="space-y-3 mb-24">
              {activeList.items.map(item => (
                <div 
                  key={item.id}
                  className={`group flex items-start p-4 bg-white rounded-2xl border border-slate-50 shadow-[0_2px_8px_rgb(0,0,0,0.02)] transition-all ${item.completed ? 'opacity-50 bg-slate-50' : 'hover:-translate-y-0.5 hover:shadow-md'}`}
                >
                  <button 
                    onClick={() => handleToggleItem(item.id)}
                    disabled={!canEdit}
                    className={`mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors mr-3 ${item.completed ? 'bg-sanrio-green border-sanrio-green text-white bg-green-400 border-green-400' : 'border-slate-300 hover:border-green-400'}`}
                  >
                    {item.completed && <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <span className={`block font-medium ${item.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {item.text}
                    </span>
                    {item.note && (
                      <p 
                        onClick={(e) => {
                          if (!canEdit) return;
                          e.stopPropagation();
                          setCurrentNoteItem({ id: item.id, text: item.text, note: item.note || '' });
                          setNoteInput(item.note || '');
                          setShowNoteModal(true);
                        }}
                        className={`text-xs text-slate-400 mt-1 italic flex items-center gap-1 ${canEdit ? 'cursor-pointer hover:text-sanrio-blue' : ''}`}
                      >
                        <svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        {item.note}
                      </p>
                    )}
                  </div>
                  {canEdit && (
                    <div className="flex flex-col gap-1">
                      <button 
                         onClick={() => handleUpdateItems(activeList.items.filter(i => i.id !== item.id))}
                         className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-400 transition-all"
                         title="Delete Item"
                      >
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentNoteItem({ id: item.id, text: item.text, note: item.note || '' });
                          setNoteInput(item.note || '');
                          setShowNoteModal(true);
                        }}
                        className={`p-2 transition-all ${item.note ? 'text-sanrio-blue opacity-100' : 'opacity-0 group-hover:opacity-100 text-slate-300 hover:text-sanrio-blue'}`}
                        title="Add/Edit Note"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Action Bar */}
            {canEdit && (
              <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center pointer-events-none">
                 <div className="bg-white/90 backdrop-blur-xl p-2 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white flex gap-2 w-full max-w-md pointer-events-auto">
                   <input 
                     className="flex-1 px-4 bg-slate-50 rounded-2xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-sanrio-pink/50 transition-all"
                     placeholder="Add item..."
                     value={newItemText}
                     onChange={e => setNewItemText(e.target.value)}
                     onKeyDown={e => e.key === 'Enter' && handleAddItem()}
                   />
                   <button onClick={handleAddItem} className="p-3 bg-sanrio-pink rounded-full text-white shadow-lg shadow-sanrio-pink/40 hover:scale-105 active:scale-95 transition-all">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                   </button>
                   <button onClick={handleAiSuggest} disabled={isThinking} className="p-3 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full text-white shadow-lg shadow-purple-400/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100">
                     {isThinking ? (
                       <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                     ) : (
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                     )}
                   </button>
                 </div>
              </div>
            )}

            {activeList.ownerId === currentUser.id && (
              <div className="mt-8 text-center">
                <button onClick={handleDeleteList} className="text-sm text-red-400 hover:text-red-600 font-medium underline decoration-red-200 underline-offset-4">
                  Delete List
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* --- Modals --- */}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="New List">
        <div className="space-y-4">
           <input 
             className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-sanrio-pink focus:bg-white outline-none transition-all text-lg font-display font-bold text-slate-700"
             placeholder="My Awesome List"
             value={createTitle}
             onChange={e => setCreateTitle(e.target.value)}
             autoFocus
           />
           <div className="flex gap-2 overflow-x-auto py-2">
             {['todo', 'wishlist', 'shopping', 'general'].map(t => (
               <button 
                 key={t}
                 onClick={() => setCreateType(t as any)}
                 className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${createType === t ? 'bg-slate-800 text-white shadow-lg scale-105' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
               >
                 {t}
               </button>
             ))}
           </div>
           <CuteButton onClick={handleCreate} className="w-full mt-2">Create</CuteButton>
        </div>
      </Modal>

      <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} title="Join List">
        <div className="space-y-4">
           <p className="text-slate-500 text-sm">Paste the 6-character code shared by your friend.</p>
           <input 
             className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-sanrio-blue focus:bg-white outline-none transition-all text-center font-mono text-2xl tracking-widest uppercase"
             placeholder="XXXXXX"
             value={joinCode}
             onChange={e => setJoinCode(e.target.value)}
             maxLength={6}
           />
           <CuteButton variant="secondary" onClick={handleJoin} className="w-full">Join Now</CuteButton>
        </div>
      </Modal>

      <Modal isOpen={showShareModal} onClose={() => { setShowShareModal(false); setGeneratedCode(null); }} title="Share List">
        {!generatedCode ? (
          <div className="space-y-4">
            <p className="text-center text-slate-500 mb-4">Who can edit this list?</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { setSharePermission(Permission.VIEWER); handleShare(); }}
                className="p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-300 hover:bg-blue-50 flex flex-col items-center gap-2 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <span className="font-bold text-slate-700">Viewer</span>
                <span className="text-xs text-slate-400">Read only</span>
              </button>
              <button 
                onClick={() => { setSharePermission(Permission.EDITOR); handleShare(); }}
                className="p-4 rounded-2xl border-2 border-slate-100 hover:border-green-300 hover:bg-green-50 flex flex-col items-center gap-2 transition-all group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <span className="font-bold text-slate-700">Editor</span>
                <span className="text-xs text-slate-400">Can edit items</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 py-4">
            <div className="space-y-2">
              <p className="text-slate-500 text-sm uppercase tracking-wider font-bold">Your Invite Code</p>
              <div className="bg-slate-800 text-white text-4xl font-mono font-bold py-4 rounded-2xl tracking-widest">
                {generatedCode}
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
              <p className="text-green-700 font-bold mb-2 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.625 0C3.863 0 0 3.328 0 7.438c0 2.266 1.172 4.305 3.086 5.703-.156.57-.539 1.93-.617 2.227 0 0-.133.484.266.484.32 0 2.336-1.445 2.633-1.633.969.266 2.008.422 3.094.422h.164c-.078-.57-.164-1.148-.164-1.742 0-4.914 4.367-8.906 9.75-8.906 2.102 0 4.055.64 5.68 1.742C22.836 2.383 18.242 0 13.03 0H8.625z"/></svg>
                WeChat Share
              </p>
              <p className="text-sm text-green-600">Tap the <span className="font-bold">...</span> menu in the top right to share this code with friends!</p>
            </div>

            <CuteButton 
              variant="secondary" 
              onClick={() => {
                navigator.clipboard.writeText(generatedCode);
                alert("Code copied! Paste it to a friend.");
              }}
              className="w-full"
            >
              Copy Code
            </CuteButton>
          </div>
        )}
      </Modal>

      {/* --- Add Note Modal --- */}
      <Modal 
        isOpen={showNoteModal} 
        onClose={() => setShowNoteModal(false)} 
        title={currentNoteItem?.text ? `Note for "${currentNoteItem.text.substring(0, 15)}${currentNoteItem.text.length>15 ? '...' : ''}"` : "Add Note"}
      >
        <div className="space-y-4">
          <p className="text-slate-500 text-sm">Add a little memory or detail!</p>
          <textarea
            className="w-full px-4 py-3 rounded-xl bg-yellow-50 border-2 border-yellow-100 focus:border-yellow-300 focus:bg-white outline-none transition-all text-slate-700 font-medium h-32 resize-none"
            placeholder="It was so tasty... / Best day ever..."
            value={noteInput}
            onChange={e => setNoteInput(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            <CuteButton variant="secondary" onClick={() => setShowNoteModal(false)} className="flex-1">
              Cancel
            </CuteButton>
            <CuteButton 
              onClick={handleSaveNote} 
              className={`flex-1 transition-all duration-300 ${noteInput.trim() ? 'shadow-md scale-105' : 'opacity-90'}`}
              variant={noteInput.trim() ? 'primary' : 'secondary'}
            >
              Save Note
            </CuteButton>
          </div>
        </div>
      </Modal>

    </div>
  );
}
