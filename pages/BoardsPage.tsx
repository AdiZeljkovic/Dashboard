
import React, { useState, useRef } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Plus, MoreHorizontal, X, AlignLeft, CheckSquare, Image as ImageIcon, Calendar, Trash2, Upload } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Task, Subtask } from '../types';

export const BoardsPage: React.FC = () => {
  const { boards, addBoardTask, updateBoardTask } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTag, setNewTaskTag] = useState('General');

  // Detail Modal State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert boards object to array for mapping
  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-zinc-500', tasks: boards.todo },
    { id: 'inProgress', title: 'In Progress', color: 'bg-blue-500', tasks: boards.inProgress },
    { id: 'done', title: 'Done', color: 'bg-green-500', tasks: boards.done },
  ];

  const handleAddTask = () => {
    if (!newTaskTitle) return;
    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle,
      tag: newTaskTag,
      source: 'Personal',
      completed: false,
      priority: 'medium',
      subtasks: [],
      images: []
    };

    addBoardTask(newTask, 'todo'); // Default to first column
    
    setNewTaskTitle('');
    setIsModalOpen(false);
  };

  // --- Detail Modal Logic ---

  const handleUpdateTask = (updates: Partial<Task>) => {
    if (!selectedTask) return;
    const updated = { ...selectedTask, ...updates };
    setSelectedTask(updated); // Update local view
    updateBoardTask(updated); // Update global state
  };

  const handleAddSubtask = (title: string) => {
    if (!title || !selectedTask) return;
    const newSubtask: Subtask = { id: Date.now().toString(), title, completed: false };
    const updatedSubtasks = [...(selectedTask.subtasks || []), newSubtask];
    handleUpdateTask({ subtasks: updatedSubtasks });
  };

  const toggleSubtask = (subtaskId: string) => {
    if (!selectedTask) return;
    const updatedSubtasks = selectedTask.subtasks?.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    handleUpdateTask({ subtasks: updatedSubtasks });
  };

  const deleteSubtask = (subtaskId: string) => {
      if (!selectedTask) return;
      const updatedSubtasks = selectedTask.subtasks?.filter(st => st.id !== subtaskId);
      handleUpdateTask({ subtasks: updatedSubtasks });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedTask) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const updatedImages = [...(selectedTask.images || []), base64];
        handleUpdateTask({ images: updatedImages });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
      if(!selectedTask || !selectedTask.images) return;
      const updatedImages = selectedTask.images.filter((_, i) => i !== index);
      handleUpdateTask({ images: updatedImages });
  };

  return (
    <div className="h-[calc(100vh-8rem)] relative">
      <div className="flex h-full gap-6 min-w-max pb-4 overflow-x-auto">
        {columns.map(col => (
          <div key={col.id} className="w-80 flex flex-col gap-4">
             {/* Column Header */}
             <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-3">
                   <div className={`w-3 h-3 rounded-full ${col.color}`}></div>
                   <span className="font-bold font-display text-lg">{col.title}</span>
                   <span className="text-zinc-500 text-sm">({col.tasks.length})</span>
                </div>
                <button className="text-zinc-500 hover:text-white"><Plus size={18} /></button>
             </div>

             {/* Drop Zone */}
             <div className="flex-1 flex flex-col gap-3 p-2 rounded-xl bg-white/5 border border-dashed border-white/5 overflow-y-auto custom-scrollbar">
                {col.tasks.map(task => (
                   <GlassCard 
                      key={task.id} 
                      className="p-4 cursor-pointer hover:border-primary/50 group relative"
                      onClick={() => setSelectedTask(task)}
                   >
                      <div className="flex justify-between items-start mb-2">
                         <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border 
                           ${task.tag === 'Dev' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                             task.tag === 'Design' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                             'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                           {task.tag || 'General'}
                         </span>
                         <button className="opacity-0 group-hover:opacity-100 text-zinc-500"><MoreHorizontal size={14} /></button>
                      </div>
                      <p className="text-sm font-medium text-zinc-200 mb-3">{task.title}</p>
                      
                      {/* Icons for content */}
                      <div className="flex gap-2 mb-3">
                         {task.description && <AlignLeft size={12} className="text-zinc-500" />}
                         {(task.subtasks?.length || 0) > 0 && (
                             <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                                 <CheckSquare size={12} />
                                 {task.subtasks?.filter(st => st.completed).length}/{task.subtasks?.length}
                             </div>
                         )}
                         {(task.images?.length || 0) > 0 && <div className="flex items-center gap-1 text-[10px] text-zinc-500"><ImageIcon size={12}/> {task.images?.length}</div>}
                      </div>

                      <div className="flex justify-between items-center">
                         <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-zinc-700 border border-black flex items-center justify-center text-[10px] text-white">A</div>
                         </div>
                         <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                      </div>
                   </GlassCard>
                ))}
             </div>
          </div>
        ))}
        
        {/* Add Task Button */}
        <div className="w-80 flex flex-col justify-start pt-2">
          <button 
             onClick={() => setIsModalOpen(true)}
             className="w-full h-16 flex items-center justify-center gap-2 rounded-xl bg-primary/20 border border-primary/50 text-white hover:bg-primary/30 transition-all shadow-lg shadow-primary/10"
          >
             <Plus size={24} />
             <span className="font-bold">Novi Zadatak</span>
          </button>
        </div>
      </div>

      {/* --- CREATE TASK MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <GlassCard className="w-full max-w-md p-6 animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-display font-bold">Dodaj Zadatak</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white"><X size={20} /></button>
              </div>
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs uppercase text-zinc-500 mb-1">Naziv Zadatka</label>
                    <input 
                      type="text" 
                      autoFocus
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary"
                      placeholder="npr. Redizajn logoa..."
                    />
                 </div>
                 <div>
                    <label className="block text-xs uppercase text-zinc-500 mb-1">Tag / Kategorija</label>
                    <select 
                      value={newTaskTag}
                      onChange={(e) => setNewTaskTag(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none"
                    >
                       <option value="General">General</option>
                       <option value="Dev">Development</option>
                       <option value="Design">Design</option>
                       <option value="Marketing">Marketing</option>
                    </select>
                 </div>
                 
                 <div className="pt-4 flex justify-end gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-zinc-400 hover:text-white">Odustani</button>
                    <button onClick={handleAddTask} className="px-6 py-2 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20">Dodaj</button>
                 </div>
              </div>
           </GlassCard>
        </div>
      )}

      {/* --- DETAIL VIEW MODAL --- */}
      {selectedTask && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
              <div className="w-full max-w-4xl h-[85vh] bg-[#0f1115] border border-white/10 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
                  
                  {/* Main Content (Left) */}
                  <div className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto custom-scrollbar bg-[#0f1115]">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-6">
                          <div className="flex-1">
                              <input 
                                type="text" 
                                value={selectedTask.title}
                                onChange={(e) => handleUpdateTask({ title: e.target.value })}
                                className="text-2xl md:text-3xl font-display font-bold bg-transparent border-none outline-none text-white w-full placeholder:text-zinc-600"
                                placeholder="Naslov zadatka..."
                              />
                              <div className="flex gap-2 mt-2">
                                  <span className="text-xs bg-white/5 px-2 py-1 rounded text-zinc-400">u listi <span className="text-zinc-200 underline decoration-zinc-600">Board</span></span>
                              </div>
                          </div>
                          <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors">
                              <X size={24} />
                          </button>
                      </div>

                      <div className="space-y-8">
                          
                          {/* Description */}
                          <div className="space-y-3">
                              <div className="flex items-center gap-3 text-zinc-400 font-medium">
                                  <AlignLeft size={20} /> Opis
                              </div>
                              <textarea 
                                value={selectedTask.description || ''}
                                onChange={(e) => handleUpdateTask({ description: e.target.value })}
                                placeholder="Dodaj detaljan opis..."
                                className="w-full min-h-[120px] bg-black/20 border border-white/10 rounded-xl p-4 text-zinc-300 text-sm leading-relaxed outline-none focus:border-primary/50 transition-colors resize-y"
                              />
                          </div>

                          {/* Checklist */}
                          <div className="space-y-3">
                              <div className="flex items-center justify-between text-zinc-400 font-medium">
                                  <div className="flex items-center gap-3"><CheckSquare size={20} /> Checklist</div>
                                  {(selectedTask.subtasks?.length || 0) > 0 && (
                                      <span className="text-xs bg-white/5 px-2 py-1 rounded">{Math.round((selectedTask.subtasks!.filter(s => s.completed).length / selectedTask.subtasks!.length) * 100)}%</span>
                                  )}
                              </div>
                              
                              {/* Progress Bar */}
                              {(selectedTask.subtasks?.length || 0) > 0 && (
                                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-primary transition-all duration-500" 
                                        style={{ width: `${Math.round((selectedTask.subtasks!.filter(s => s.completed).length / selectedTask.subtasks!.length) * 100)}%` }}
                                      />
                                  </div>
                              )}

                              <div className="space-y-2 mt-2">
                                  {selectedTask.subtasks?.map(st => (
                                      <div key={st.id} className="flex items-center gap-3 group hover:bg-white/5 p-2 rounded-lg -mx-2 transition-colors">
                                          <input 
                                            type="checkbox" 
                                            checked={st.completed}
                                            onChange={() => toggleSubtask(st.id)}
                                            className="w-4 h-4 rounded border-zinc-600 bg-transparent checked:bg-primary checked:border-primary cursor-pointer"
                                          />
                                          <span className={`flex-1 text-sm ${st.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>{st.title}</span>
                                          <button onClick={() => deleteSubtask(st.id)} className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400"><X size={14}/></button>
                                      </div>
                                  ))}
                                  <input 
                                    type="text" 
                                    placeholder="+ Dodaj stavku"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddSubtask(e.currentTarget.value);
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                    className="w-full bg-transparent text-sm text-zinc-400 hover:bg-white/5 p-2 rounded-lg outline-none focus:text-white placeholder:text-zinc-600"
                                  />
                              </div>
                          </div>

                          {/* Attachments / Images */}
                          <div className="space-y-3">
                              <div className="flex items-center gap-3 text-zinc-400 font-medium">
                                  <ImageIcon size={20} /> Slike & Prilozi
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                  {selectedTask.images?.map((img, idx) => (
                                      <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden bg-black/40 border border-white/10">
                                          <img src={img} alt="Attachment" className="w-full h-full object-cover" />
                                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                              <button onClick={() => removeImage(idx)} className="p-2 bg-red-500/80 rounded-full text-white"><Trash2 size={16}/></button>
                                          </div>
                                      </div>
                                  ))}
                                  <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-video rounded-lg border border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-primary"
                                  >
                                      <Upload size={20} />
                                      <span className="text-xs">Dodaj sliku</span>
                                  </button>
                                  <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                  />
                              </div>
                          </div>

                      </div>
                  </div>

                  {/* Sidebar (Right) */}
                  <div className="w-full md:w-72 bg-[#0a0c10] border-l border-white/10 p-6 flex flex-col gap-6">
                      
                      {/* Meta Data */}
                      <div className="space-y-4">
                          <div>
                              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Status</label>
                              <div className="text-sm font-medium text-zinc-300 bg-white/5 px-3 py-2 rounded-lg border border-white/5 flex items-center justify-between">
                                  In List
                                  <div className="flex gap-1">
                                     <div className="w-2 h-2 rounded-full bg-zinc-500"></div>
                                  </div>
                              </div>
                          </div>

                          <div>
                              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Tag</label>
                              <select 
                                value={selectedTask.tag} 
                                onChange={(e) => handleUpdateTask({ tag: e.target.value })}
                                className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-primary/50"
                              >
                                  <option value="General">General</option>
                                  <option value="Design">Design</option>
                                  <option value="Dev">Development</option>
                                  <option value="Marketing">Marketing</option>
                              </select>
                          </div>

                          <div>
                              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Prioritet</label>
                              <div className="flex gap-2">
                                  {['low', 'medium', 'high'].map(p => (
                                      <button
                                        key={p}
                                        onClick={() => handleUpdateTask({ priority: p as any })}
                                        className={`flex-1 py-1.5 rounded text-xs capitalize border transition-all
                                           ${selectedTask.priority === p 
                                              ? p === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/50' : p === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-green-500/20 text-green-400 border-green-500/50'
                                              : 'bg-white/5 text-zinc-500 border-transparent hover:bg-white/10'
                                           }
                                        `}
                                      >
                                          {p}
                                      </button>
                                  ))}
                              </div>
                          </div>

                          <div>
                              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Rok završetka</label>
                              <div className="relative">
                                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                  <input 
                                    type="date" 
                                    value={selectedTask.dueDate || ''}
                                    onChange={(e) => handleUpdateTask({ dueDate: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-300 outline-none focus:border-primary/50 [color-scheme:dark]" 
                                  />
                              </div>
                          </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto pt-6 border-t border-white/5">
                          <button className="w-full py-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                              <Trash2 size={16} /> Obriši zadatak
                          </button>
                      </div>
                  </div>

              </div>
          </div>
      )}
    </div>
  );
};
