
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ArticleEditor from '@/pages/admin/ArticleEditor';
import { AuthProvider } from '@/contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import * as supabaseClient from '@/integrations/supabase/client';
import { vi } from 'vitest';

// Mock supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
          maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: '123' }, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: { id: '123' }, error: null })),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    }),
  },
}));

// Mock auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user-id' },
    isAuthenticated: true,
  })),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock react-hook-form's useForm
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    register: vi.fn(),
    handleSubmit: vi.fn((fn) => fn),
    control: {},
    formState: { errors: {} },
    watch: vi.fn((field) => ''),
    setValue: vi.fn(),
    getValues: vi.fn(() => ({})),
    reset: vi.fn(),
    setError: vi.fn(),
  })),
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ArticleEditor Component', () => {
  const renderArticleEditor = (id?: string) => {
    const route = id ? `/admin/articles/edit/${id}` : '/admin/articles/new';
    
    return render(
      <MemoryRouter initialEntries={[route]}>
        <TooltipProvider>
          <Routes>
            <Route path="/admin/articles/new" element={<ArticleEditor />} />
            <Route path="/admin/articles/edit/:id" element={<ArticleEditor />} />
          </Routes>
        </TooltipProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful category and tag fetch
    vi.mocked(supabaseClient.supabase.from).mockImplementation((table: string) => {
      if (table === 'categories') {
        return {
          select: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({
              data: [
                { id: 'cat1', name: 'Technology', slug: 'technology' },
                { id: 'cat2', name: 'Business', slug: 'business' },
              ],
              error: null,
            })),
          })),
        } as any;
      }
      
      if (table === 'tags') {
        return {
          select: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({
              data: [
                { id: 'tag1', name: 'React', slug: 'react' },
                { id: 'tag2', name: 'JavaScript', slug: 'javascript' },
              ],
              error: null,
            })),
          })),
        } as any;
      }
      
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: null, error: null })),
            maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
          })),
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: { id: '123' }, error: null })),
          })),
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ data: { id: '123' }, error: null })),
            })),
          })),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null })),
        })),
      } as any;
    });
  });

  it('renders the create article page correctly', async () => {
    renderArticleEditor();
    
    await waitFor(() => {
      expect(screen.getByText('Create New Article')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Article Content')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders the edit article page correctly when given an ID', async () => {
    // Mock the article fetch for edit mode
    vi.mocked(supabaseClient.supabase.from).mockImplementation((table: string) => {
      if (table === 'articles') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({
                data: {
                  id: 'article1',
                  title: 'Test Article',
                  slug: 'test-article',
                  content: 'Test content',
                  excerpt: 'Test excerpt',
                  category_id: 'cat1',
                  cover_image: 'https://example.com/image.jpg',
                  read_time: '5 min read',
                  status: 'draft',
                  is_featured: false,
                },
                error: null,
              })),
            })),
          })),
        } as any;
      }
      
      // Return default mocks for other tables
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: null, error: null })),
            maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
          })),
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      } as any;
    });
    
    renderArticleEditor('article1');
    
    await waitFor(() => {
      expect(screen.getByText('Edit Article')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Article Content')).toBeInTheDocument();
  });

  it('displays settings panel when settings button is clicked', async () => {
    renderArticleEditor();
    
    await waitFor(() => {
      expect(screen.getByText('Article Content')).toBeInTheDocument();
    });
    
    // Settings panel is hidden by default
    expect(screen.queryByText('Article Settings')).not.toBeInTheDocument();
    
    // Click settings button (identified by its aria-label)
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);
    
    // Settings panel should now be visible
    expect(screen.getByText('Article Settings')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  // Add more tests as needed for form submission, validation, etc.
});
