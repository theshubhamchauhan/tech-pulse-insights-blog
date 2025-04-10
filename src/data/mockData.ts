
import { ArticleWithRelations, Author, Category, Tag, Article } from "@/lib/types";

// Mock authors
export const authors: Author[] = [
  {
    id: "1",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?u=1",
    role: "Editor",
    bio: "Experienced writer with a passion for technology and innovation."
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?u=2",
    role: "Senior Writer",
    bio: "Award-winning journalist covering science and health topics."
  },
  {
    id: "3",
    name: "Mark Johnson",
    avatar: "https://i.pravatar.cc/150?u=3",
    role: "Contributor",
    bio: "Software engineer and tech enthusiast writing about coding and AI."
  }
];

// Mock categories
export const categories: Category[] = [
  {
    id: "1",
    name: "Technology",
    slug: "technology",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "2",
    name: "Science",
    slug: "science",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "3",
    name: "Health",
    slug: "health",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "4",
    name: "Business",
    slug: "business",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

// Mock tags
export const tags: Tag[] = [
  {
    id: "1",
    name: "Web Development",
    slug: "web-development",
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    name: "AI",
    slug: "ai",
    created_at: new Date().toISOString()
  },
  {
    id: "3",
    name: "Climate",
    slug: "climate",
    created_at: new Date().toISOString()
  }
];

// Mock articles
export const articles: ArticleWithRelations[] = [
  {
    id: "1",
    title: "The Future of AI in Healthcare",
    slug: "future-of-ai-in-healthcare",
    excerpt: "Exploring how artificial intelligence is transforming medical diagnosis and treatment.",
    content: "<p>Artificial intelligence is revolutionizing healthcare in numerous ways...</p>",
    cover_image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: authors[0],
    category: categories[2],
    tags: [tags[1]],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    read_time: "5 min read",
    is_featured: true,
    status: "published",
    meta_title: "The Future of AI in Healthcare | Duckcod",
    meta_description: "Exploring how artificial intelligence is transforming medical diagnosis and treatment.",
    meta_keywords: "AI, healthcare, medicine, technology, future",
    canonical_url: "",
    og_image: ""
  },
  {
    id: "2",
    title: "Understanding Web3 and the Decentralized Internet",
    slug: "understanding-web3",
    excerpt: "A comprehensive guide to Web3 technologies and how they're reshaping the internet.",
    content: "<p>Web3 represents the next evolution of the internet, built on blockchain technology...</p>",
    cover_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: authors[1],
    category: categories[0],
    tags: [tags[0]],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read_time: "8 min read",
    is_featured: false,
    status: "published",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    canonical_url: "",
    og_image: ""
  },
  {
    id: "3",
    title: "Climate Change: Latest Research and Solutions",
    slug: "climate-change-research-solutions",
    excerpt: "Examining the most recent climate science and potential pathways to sustainability.",
    content: "<p>The latest IPCC report highlights the urgency of addressing climate change...</p>",
    cover_image: "https://images.unsplash.com/photo-1569098644584-210bcd375b59?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: authors[2],
    category: categories[1],
    tags: [tags[2]],
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    read_time: "10 min read",
    is_featured: true,
    status: "published",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    canonical_url: "",
    og_image: ""
  },
  {
    id: "4",
    title: "The Rise of Remote Work",
    slug: "rise-of-remote-work",
    excerpt: "How the pandemic permanently changed our work culture and what's next for remote work.",
    content: "<p>Remote work has become the new normal for many industries...</p>",
    cover_image: "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: authors[0],
    category: categories[3],
    tags: [tags[0]],
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    read_time: "6 min read",
    is_featured: false,
    status: "draft",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    canonical_url: "",
    og_image: ""
  }
];

// Statistical data for admin dashboard
export const statsData = {
  totalArticles: 156,
  totalViews: 2547893,
  publishedArticles: 143,
  draftArticles: 13,
  totalComments: 4281,
  totalCategories: 12,
  totalAuthors: 8,
  totalTags: 34
};

export const viewsOverTimeData = [
  { date: "Jan", views: 12400 },
  { date: "Feb", views: 14800 },
  { date: "Mar", views: 16300 },
  { date: "Apr", views: 18200 },
  { date: "May", views: 21000 },
  { date: "Jun", views: 19800 },
  { date: "Jul", views: 22100 },
  { date: "Aug", views: 24800 },
  { date: "Sep", views: 26900 },
  { date: "Oct", views: 29400 },
  { date: "Nov", views: 31200 },
  { date: "Dec", views: 33800 }
];

export const articlesByCategory = [
  { name: "Technology", value: 42 },
  { name: "Science", value: 28 },
  { name: "Health", value: 19 },
  { name: "Business", value: 24 },
  { name: "Lifestyle", value: 18 },
  { name: "Travel", value: 15 },
  { name: "Food", value: 10 }
];

export const topAuthors = [
  { name: "John Doe", articles: 32, views: 428900 },
  { name: "Jane Smith", articles: 28, views: 362700 },
  { name: "Mark Johnson", articles: 25, views: 298500 },
  { name: "Sarah Williams", articles: 21, views: 246300 },
  { name: "David Brown", articles: 19, views: 215800 }
];
