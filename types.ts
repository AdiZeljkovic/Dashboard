

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string | number;
  title: string;
  completed: boolean;
  source: 'CRM' | 'Calendar' | 'Personal' | 'Homelab';
  priority?: 'low' | 'medium' | 'high';
  tag?: string;
  description?: string;
  images?: string[]; // Base64 strings or URLs
  subtasks?: Subtask[];
  dueDate?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Active' | 'Lead' | 'Churned' | 'Negotiation' | 'Proposal';
  value: number;
  notes?: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  number: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface Deal {
  id: string;
  clientId: string;
  title: string;
  value: number;
  stage: 'Lead' | 'Negotiation' | 'Proposal' | 'Won' | 'Lost';
  probability: number;
}

export interface Communication {
  id: string;
  clientId: string;
  type: 'Email' | 'Call' | 'Meeting';
  date: string;
  summary: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  status: 'Planning' | 'In Progress' | 'Review' | 'Done';
  progress: number;
  dueDate: string;
}

export interface VaultItem {
  id: string;
  clientId: string;
  title: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
}

export interface Ticket {
  id: string;
  clientId: string;
  title: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  date: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  category: string;
}

export interface CalendarEvent {
  id: string | number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: 'event' | 'task' | 'reminder';
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  completedDates: string[]; // ISO date strings (YYYY-MM-DD)
}

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  score: 1 | 2 | 3 | 4 | 5; // 1 = Angry, 5 = Happy
}

export interface Shortcut {
  id: string;
  name: string;
  url: string;
  iconName: string; 
  color: string;
}

export interface HomelabService {
  id: string;
  name: string;
  ip: string;
  url: string;
  status: 'online' | 'offline';
}

export interface NewsItem {
  id: string | number;
  category: 'tech' | 'gaming' | 'world';
  title: string;
  summary: string;
  source: string;
  time: string;
  img: string;
  featured: boolean;
  url?: string;
}

export interface VideoItem {
  id: string;
  category: 'tech' | 'gaming' | 'world';
  title: string;
  channel: string;
  views: string;
  url?: string;
  thumbnail?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  type: 'rss' | 'youtube';
  url: string; // RSS URL or Channel ID
  category: 'tech' | 'gaming' | 'world';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  timestamp: number;
  read: boolean;
  category: 'prayer' | 'calendar' | 'finance' | 'habit';
}

export interface SupabaseConfig {
  url: string;
  key: string;
  connected: boolean;
}

export interface Note {
  id: string;
  content: string;
  date: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  date: string; // "DD. MMM" string or similar
  status: 'paid' | 'pending';
  iconName: string; // for UI mapping
}

export interface AppData {
  tasks: Task[];
  clients: Client[];
  invoices: Invoice[];
  deals: Deal[];
  communications: Communication[];
  projects: Project[];
  vaultItems: VaultItem[];
  tickets: Ticket[];
  transactions: Transaction[];
  events: CalendarEvent[];
  habits: Habit[];
  moodEntries: MoodEntry[];
  shortcuts: Shortcut[];
  homelabServices: HomelabService[];
  news: NewsItem[];
  videos: VideoItem[];
  newsSources: NewsSource[];
  notes: Note[];
  bills: Bill[];
  boards: {
    todo: Task[];
    inProgress: Task[];
    done: Task[];
  };
  notifications: Notification[];
  prayerTimes: { name: string; time: string }[];
  supabaseConfig: SupabaseConfig;
  isLoggedIn: boolean;
}

export interface DataContextType extends AppData {
  addTask: (task: Task) => void;
  toggleTask: (id: string | number) => void;
  deleteTask: (id: string | number) => void;
  
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  
  addInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;

  addDeal: (deal: Deal) => void;
  deleteDeal: (id: string) => void;

  addCommunication: (comm: Communication) => void;
  deleteCommunication: (id: string) => void;

  addProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  updateProject: (project: Project) => void;

  addVaultItem: (item: VaultItem) => void;
  deleteVaultItem: (id: string) => void;

  addTicket: (ticket: Ticket) => void;
  deleteTicket: (id: string) => void;

  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;

  addEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string | number) => void;
  
  moveBoardTask: (taskId: number, sourceCol: string, destCol: string) => void;
  addBoardTask: (task: Task, columnId: string) => void;
  updateBoardTask: (task: Task) => void;

  addShortcut: (shortcut: Shortcut) => void;
  deleteShortcut: (id: string) => void;

  addHomelabService: (service: HomelabService) => void;
  deleteHomelabService: (id: string) => void;

  addNews: (news: NewsItem) => void;
  deleteNews: (id: string | number) => void;

  addVideo: (video: VideoItem) => void;
  deleteVideo: (id: string) => void;
  
  addNewsSource: (source: NewsSource) => void;
  deleteNewsSource: (id: string) => void;
  refreshNews: () => Promise<void>;

  addHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabitForDate: (id: string, date: string) => void;

  addMoodEntry: (entry: MoodEntry) => void;

  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;

  addBill: (bill: Bill) => void;
  deleteBill: (id: string) => void;
  updateBill: (bill: Bill) => void;

  // Notification Methods
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  removeNotification: (id: string) => void;

  // Supabase Methods
  updateSupabaseConfig: (config: SupabaseConfig) => void;
  syncFromCloud: () => Promise<void>;
  syncToCloud: (key: string, data: any) => Promise<void>;

  // Auth Methods
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}
