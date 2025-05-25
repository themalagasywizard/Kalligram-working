import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// Types
interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_picture_url?: string;
}

interface Project {
  id: string;
  title: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  last_edited?: string;
  word_count?: number;
}

interface Chapter {
  id: string;
  title: string;
  content: string;
  project_id: string;
  order_index: number;
  created_at: string;
  updated_at: string;
  word_count?: number;
}

interface Character {
  id: string;
  name: string;
  description?: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  project_id: string;
  created_at: string;
  updated_at: string;
}

interface AIMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// Utility functions
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const countWords = (text: string): number => {
  if (!text || text.trim() === '') return 0;
  return text.trim().split(/\s+/).length;
};

const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'default', 
  size = 'default', 
  children, 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };
  
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

// Card Component
interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children }) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
    {children}
  </div>
);

const CardHeader: React.FC<CardProps> = ({ className, children }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
    {children}
  </div>
);

const CardTitle: React.FC<CardProps> = ({ className, children }) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)}>
    {children}
  </h3>
);

const CardContent: React.FC<CardProps> = ({ className, children }) => (
  <div className={cn("p-6 pt-0", className)}>
    {children}
  </div>
);

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className, type, ...props }) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};

// Theme Toggle Component
const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle theme">
      <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`} />
    </Button>
  );
};

// Toast Component
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg transition-all",
      typeClasses[type]
    )}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
          <i className="fas fa-times" />
        </button>
      </div>
    </div>
  );
};

// Main App Component
const KalligramApp: React.FC = () => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [chapterContent, setChapterContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
  const [showLoadProject, setShowLoadProject] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Refs
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // Effects
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentProject) {
      loadChapters(currentProject.id);
      loadCharacters(currentProject.id);
    }
  }, [currentProject]);

  useEffect(() => {
    if (currentChapter) {
      setChapterContent(currentChapter.content);
      setIsDirty(false);
    }
  }, [currentChapter]);

  // Auto-save functionality
  const debouncedSave = useCallback(
    debounce(async (content: string) => {
      if (currentChapter && isDirty) {
        await saveChapter(currentChapter.id, content);
      }
    }, 2000),
    [currentChapter, isDirty]
  );

  useEffect(() => {
    if (isDirty && chapterContent) {
      debouncedSave(chapterContent);
    }
  }, [chapterContent, isDirty, debouncedSave]);

  // Auth functions
  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user as User);
        await loadProjects();
      } else {
        window.location.href = '/auth/auth.html';
      }
    } catch (error) {
      console.error('Auth check error:', error);
      showToast('Authentication error', 'error');
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/auth/auth.html';
    } catch (error) {
      console.error('Sign out error:', error);
      showToast('Failed to sign out', 'error');
    }
  };

  // Project functions
  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
      
      if (data && data.length > 0) {
        setCurrentProject(data[0]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      showToast('Failed to load projects', 'error');
    }
  };

  const createProject = async (title: string, description: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title,
          description,
          user_id: user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setProjects(prev => [data, ...prev]);
      setCurrentProject(data);
      setShowNewProject(false);
      showToast('Project created successfully', 'success');
    } catch (error) {
      console.error('Error creating project:', error);
      showToast('Failed to create project', 'error');
    }
  };

  // Chapter functions
  const loadChapters = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      setChapters(data || []);
      
      if (data && data.length > 0) {
        setCurrentChapter(data[0]);
      }
    } catch (error) {
      console.error('Error loading chapters:', error);
      showToast('Failed to load chapters', 'error');
    }
  };

  const createChapter = async (title: string) => {
    if (!currentProject) return;
    
    try {
      const { data, error } = await supabase
        .from('chapters')
        .insert({
          title,
          content: '',
          project_id: currentProject.id,
          order_index: chapters.length
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setChapters(prev => [...prev, data]);
      setCurrentChapter(data);
      showToast('Chapter created successfully', 'success');
    } catch (error) {
      console.error('Error creating chapter:', error);
      showToast('Failed to create chapter', 'error');
    }
  };

  const saveChapter = async (chapterId: string, content: string) => {
    try {
      setSaveStatus('saving');
      
      const { error } = await supabase
        .from('chapters')
        .update({
          content,
          updated_at: new Date().toISOString(),
          word_count: countWords(content)
        })
        .eq('id', chapterId);
      
      if (error) throw error;
      
      setSaveStatus('saved');
      setIsDirty(false);
      
      // Update current chapter
      if (currentChapter && currentChapter.id === chapterId) {
        setCurrentChapter(prev => prev ? {
          ...prev,
          content,
          word_count: countWords(content),
          updated_at: new Date().toISOString()
        } : null);
      }
    } catch (error) {
      console.error('Error saving chapter:', error);
      setSaveStatus('error');
      showToast('Failed to save chapter', 'error');
    }
  };

  // Character functions
  const loadCharacters = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('project_id', projectId);
      
      if (error) throw error;
      setCharacters(data || []);
    } catch (error) {
      console.error('Error loading characters:', error);
      showToast('Failed to load characters', 'error');
    }
  };

  // AI functions
  const generateAIContent = async () => {
    if (!aiInput.trim() || isGenerating) return;
    
    try {
      setIsGenerating(true);
      
      // Add user message
      const userMessage: AIMessage = {
        id: Date.now().toString(),
        content: aiInput,
        isUser: true,
        timestamp: new Date()
      };
      setAiMessages(prev => [...prev, userMessage]);
      
      // Call AI API (placeholder - replace with actual API)
      const response = await fetch('/.netlify/functions/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiInput,
          context: currentChapter?.content || ''
        })
      });
      
      if (!response.ok) throw new Error('AI generation failed');
      
      const result = await response.json();
      
      // Add AI response
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: result.text || 'Sorry, I could not generate content at this time.',
        isUser: false,
        timestamp: new Date()
      };
      setAiMessages(prev => [...prev, aiMessage]);
      setAiOutput(result.text || '');
      
      setAiInput('');
    } catch (error) {
      console.error('Error generating AI content:', error);
      showToast('Failed to generate AI content', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const insertAIContent = () => {
    if (!aiOutput || !editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = chapterContent.substring(0, start) + aiOutput + chapterContent.substring(end);
    
    setChapterContent(newContent);
    setIsDirty(true);
    setSaveStatus('unsaved');
    
    // Clear AI output
    setAiOutput('');
    showToast('AI content inserted', 'success');
  };

  // Utility functions
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChapterContent(e.target.value);
    setIsDirty(true);
    setSaveStatus('unsaved');
  };

  // Render
  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fas fa-bars" />
          </Button>
          
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl">
            <i className="fas fa-feather-alt" />
          </div>
          
          <h1 className="text-xl font-semibold text-primary hidden md:block">
            Kalligram
          </h1>
          
          {/* Save Status */}
          <div className="flex items-center text-sm text-muted-foreground">
            {saveStatus === 'saving' && (
              <>
                <i className="fas fa-spinner fa-spin mr-2" />
                Saving...
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <i className="fas fa-check text-green-500 mr-2" />
                Saved
              </>
            )}
            {saveStatus === 'unsaved' && (
              <>
                <i className="fas fa-circle text-yellow-500 mr-2" />
                Unsaved changes
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <i className="fas fa-exclamation-triangle text-red-500 mr-2" />
                Save failed
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={() => currentChapter && saveChapter(currentChapter.id, chapterContent)}>
            <i className="fas fa-save mr-2" />
            Save
          </Button>
          
          <Button onClick={() => setShowLoadProject(true)}>
            <i className="fas fa-folder-open mr-2" />
            Load Project
          </Button>
          
          <Button variant="secondary" onClick={() => setShowNewProject(true)}>
            <i className="fas fa-plus mr-2" />
            New Project
          </Button>
          
          <ThemeToggle />
          
          <div className="relative group">
            <img
              src={user?.profile_picture_url || `https://ui-avatars.com/api/?name=${user?.first_name || user?.email?.charAt(0) || 'U'}&background=4B5EAA&color=fff`}
              alt="User Avatar"
              className="w-9 h-9 rounded-full cursor-pointer border-2 border-transparent hover:border-primary transition-colors"
            />
            <div className="absolute right-0 mt-2 w-48 bg-popover rounded-lg shadow-lg p-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-10">
              <div className="p-2 hover:bg-accent rounded cursor-pointer flex items-center">
                <i className="fas fa-user-circle text-primary mr-2" />
                <span>{user?.first_name || user?.email?.split('@')[0] || 'User'}</span>
              </div>
              <div className="p-2 hover:bg-accent rounded cursor-pointer flex items-center">
                <i className="fas fa-cog text-muted-foreground mr-2" />
                <span>Settings</span>
              </div>
              <div 
                onClick={signOut}
                className="p-2 hover:bg-accent rounded cursor-pointer flex items-center text-destructive"
              >
                <i className="fas fa-sign-out-alt mr-2" />
                <span>Sign Out</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={cn(
          "w-64 bg-card border-r border-border overflow-y-auto transition-transform duration-300",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="p-4 space-y-6">
            {/* Project Info */}
            <Card>
              <CardContent className="p-4">
                <h2 className="font-medium text-primary mb-1">
                  {currentProject?.title || 'No Project Selected'}
                </h2>
                <div className="flex items-center text-xs text-muted-foreground">
                  <i className="fas fa-clock mr-1" />
                  <span>
                    {currentProject?.updated_at ? formatDate(currentProject.updated_at) : 'Never'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Chapters */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Chapters
                </h2>
              </div>
              
              <div className="space-y-1">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    onClick={() => setCurrentChapter(chapter)}
                    className={cn(
                      "p-2 rounded cursor-pointer transition-colors border-l-3",
                      currentChapter?.id === chapter.id
                        ? "bg-accent border-l-primary text-primary font-medium"
                        : "hover:bg-accent border-l-transparent"
                    )}
                  >
                    <div className="font-medium text-sm">{chapter.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {chapter.word_count || countWords(chapter.content)} words
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                variant="outline"
                className="w-full mt-3"
                onClick={() => {
                  const title = prompt('Chapter title:');
                  if (title) createChapter(title);
                }}
              >
                <i className="fas fa-plus mr-2" />
                Add Chapter
              </Button>
            </div>

            {/* Context */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Story Context
                </h2>
                <span className="text-xs text-muted-foreground">
                  {characters.length} items
                </span>
              </div>
              
              <Card>
                <CardContent className="p-2">
                  <div className="space-y-1">
                    {characters.slice(0, 3).map((character) => (
                      <div key={character.id} className="text-sm p-2 hover:bg-accent rounded">
                        <div className="font-medium">{character.name}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {character.role}
                        </div>
                      </div>
                    ))}
                    {characters.length === 0 && (
                      <div className="text-center p-2 text-muted-foreground text-sm">
                        <i className="fas fa-info-circle mr-2" />
                        No context items yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Button
                variant="outline"
                className="w-full mt-3"
                onClick={() => setShowContextModal(true)}
              >
                <i className="fas fa-cog mr-2" />
                Manage Context
              </Button>
            </div>

            {/* AI Assistant */}
            <Button
              variant={showAIPanel ? "default" : "outline"}
              className="w-full"
              onClick={() => setShowAIPanel(!showAIPanel)}
            >
              <i className="fas fa-robot mr-2" />
              AI Assistant
            </Button>
          </div>
        </aside>

        {/* Editor */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Toolbar */}
          <div className="h-12 bg-card border-b border-border flex items-center px-4 space-x-2">
            <Button variant="ghost" size="sm">
              <i className="fas fa-bold" />
            </Button>
            <Button variant="ghost" size="sm">
              <i className="fas fa-italic" />
            </Button>
            <Button variant="ghost" size="sm">
              <i className="fas fa-underline" />
            </Button>
            <div className="w-px h-6 bg-border mx-2" />
            <Button variant="ghost" size="sm">
              <i className="fas fa-list-ul" />
            </Button>
            <Button variant="ghost" size="sm">
              <i className="fas fa-list-ol" />
            </Button>
            <div className="flex-1" />
            <div className="text-sm text-muted-foreground">
              {countWords(chapterContent)} words
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 p-6">
              {currentChapter ? (
                <Textarea
                  ref={editorRef}
                  value={chapterContent}
                  onChange={handleContentChange}
                  placeholder="Start writing your story..."
                  className="w-full h-full resize-none border-none shadow-none focus:ring-0 editor-content text-base leading-relaxed"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <i className="fas fa-file-alt text-4xl mb-4" />
                    <p>Select a chapter to start writing</p>
                  </div>
                </div>
              )}
            </div>

            {/* AI Panel */}
            {showAIPanel && (
              <div className="w-96 bg-card border-l border-border flex flex-col">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">AI Assistant</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowAIPanel(false)}
                    >
                      <i className="fas fa-times" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <Textarea
                      ref={chatInputRef}
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Ask AI to help with your writing..."
                      className="min-h-[100px]"
                    />
                    
                    <Button
                      onClick={generateAIContent}
                      disabled={!aiInput.trim() || isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-magic mr-2" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* AI Output */}
                {aiOutput && (
                  <div className="p-4 border-b border-border">
                    <div className="bg-accent rounded-lg p-3 mb-3">
                      <div className="text-sm whitespace-pre-wrap">{aiOutput}</div>
                    </div>
                    <Button
                      onClick={insertAIContent}
                      variant="outline"
                      className="w-full"
                    >
                      <i className="fas fa-plus mr-2" />
                      Insert into Chapter
                    </Button>
                  </div>
                )}

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                  {aiMessages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "max-w-[85%] p-3 rounded-lg text-sm",
                        message.isUser
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "mr-auto bg-accent"
                      )}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modals would go here - simplified for this example */}
    </div>
  );
};

export default KalligramApp; 