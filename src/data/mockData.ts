
import { ArticleProps } from "@/components/articles/ArticleCard";

// Mock category data
export const categories = [
  { id: "1", name: "AI & Machine Learning", slug: "ai" },
  { id: "2", name: "Cloud Computing", slug: "cloud" },
  { id: "3", name: "Web Development", slug: "development" },
  { id: "4", name: "Cybersecurity", slug: "cybersecurity" },
  { id: "5", name: "Data Science", slug: "data" },
  { id: "6", name: "DevOps", slug: "devops" },
  { id: "7", name: "Blockchain", slug: "blockchain" },
  { id: "8", name: "Mobile Development", slug: "mobile" },
];

// Mock tags data
export const tags = [
  { id: "1", name: "Machine Learning" },
  { id: "2", name: "AWS" },
  { id: "3", name: "React" },
  { id: "4", name: "Security" },
  { id: "5", name: "Python" },
  { id: "6", name: "Docker" },
  { id: "7", name: "Ethereum" },
  { id: "8", name: "iOS" },
  { id: "9", name: "JavaScript" },
  { id: "10", name: "TypeScript" },
  { id: "11", name: "Neural Networks" },
  { id: "12", name: "Azure" },
  { id: "13", name: "API" },
  { id: "14", name: "Penetration Testing" },
  { id: "15", name: "Analytics" },
];

// Mock authors data
export const authors = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    role: "Senior Tech Writer",
    bio: "Alex has over 10 years of experience in the tech industry, specializing in AI and ML technologies.",
  },
  {
    id: "2",
    name: "Samantha Lee",
    avatar: "https://i.pravatar.cc/150?img=5",
    role: "Cloud Specialist",
    bio: "Samantha is a certified cloud architect with expertise in AWS, Azure, and GCP.",
  },
  {
    id: "3",
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "Web Development Lead",
    bio: "Michael is a full-stack developer with a passion for creating high-performance web applications.",
  },
  {
    id: "4",
    name: "Jessica Williams",
    avatar: "https://i.pravatar.cc/150?img=4",
    role: "Cybersecurity Expert",
    bio: "Jessica is a certified ethical hacker and security consultant with experience in vulnerability assessments.",
  },
  {
    id: "5",
    name: "David Kim",
    avatar: "https://i.pravatar.cc/150?img=8",
    role: "Data Scientist",
    bio: "David specializes in big data analytics and has worked with Fortune 500 companies on data-driven solutions.",
  },
];

// Mock articles data
export const articles: ArticleProps[] = [
  {
    id: "1",
    title: "The Future of AI: How Machine Learning is Transforming Industries",
    excerpt: "An in-depth look at how artificial intelligence and machine learning are revolutionizing various sectors and what we can expect in the coming years.",
    coverImage: "https://images.unsplash.com/photo-1677442135136-760c813220e4?q=80&w=800&auto=format&fit=crop",
    category: "AI & Machine Learning",
    author: authors[0],
    date: "May 15, 2023",
    readTime: "8 min read",
    slug: "future-of-ai-machine-learning-transforming-industries",
    featured: true,
  },
  {
    id: "2",
    title: "Cloud Migration Strategies for Enterprise Applications",
    excerpt: "Discover the most effective strategies for migrating enterprise applications to the cloud, including best practices and common pitfalls to avoid.",
    coverImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=800&auto=format&fit=crop",
    category: "Cloud Computing",
    author: authors[1],
    date: "April 22, 2023",
    readTime: "10 min read",
    slug: "cloud-migration-strategies-enterprise-applications",
  },
  {
    id: "3",
    title: "Modern Web Development with React and TypeScript",
    excerpt: "Learn how to build robust and scalable web applications using React and TypeScript, with practical examples and best practices.",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
    category: "Web Development",
    author: authors[2],
    date: "June 5, 2023",
    readTime: "12 min read",
    slug: "modern-web-development-react-typescript",
  },
  {
    id: "4",
    title: "Cybersecurity Trends: Protecting Your Organization in 2023",
    excerpt: "Stay ahead of cyber threats with this comprehensive guide to the latest cybersecurity trends and strategies for protecting your organization.",
    coverImage: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=800&auto=format&fit=crop",
    category: "Cybersecurity",
    author: authors[3],
    date: "March 18, 2023",
    readTime: "9 min read",
    slug: "cybersecurity-trends-protecting-organization-2023",
  },
  {
    id: "5",
    title: "Data-Driven Decision Making: Leveraging Analytics for Business Growth",
    excerpt: "Explore how businesses can harness the power of data analytics to make informed decisions and drive sustainable growth in a competitive landscape.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    category: "Data Science",
    author: authors[4],
    date: "July 10, 2023",
    readTime: "7 min read",
    slug: "data-driven-decision-making-analytics-business-growth",
  },
  {
    id: "6",
    title: "DevOps Best Practices for Continuous Integration and Deployment",
    excerpt: "Implement efficient DevOps workflows with these proven best practices for continuous integration and deployment in modern software development.",
    coverImage: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop",
    category: "DevOps",
    author: authors[2],
    date: "August 3, 2023",
    readTime: "11 min read",
    slug: "devops-best-practices-continuous-integration-deployment",
  },
  {
    id: "7",
    title: "Blockchain Applications Beyond Cryptocurrency",
    excerpt: "Discover innovative applications of blockchain technology beyond cryptocurrencies, including supply chain management, healthcare, and voting systems.",
    coverImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=800&auto=format&fit=crop",
    category: "Blockchain",
    author: authors[0],
    date: "September 12, 2023",
    readTime: "10 min read",
    slug: "blockchain-applications-beyond-cryptocurrency",
  },
  {
    id: "8",
    title: "Cross-Platform Mobile Development with Flutter",
    excerpt: "Learn how to build beautiful, natively compiled mobile applications for iOS and Android from a single codebase using Flutter.",
    coverImage: "https://images.unsplash.com/photo-1522125670776-3c7abb882bc2?q=80&w=800&auto=format&fit=crop",
    category: "Mobile Development",
    author: authors[2],
    date: "October 5, 2023",
    readTime: "8 min read",
    slug: "cross-platform-mobile-development-flutter",
  },
  {
    id: "9",
    title: "The Role of AI in Healthcare: Innovations and Ethical Considerations",
    excerpt: "Explore how artificial intelligence is revolutionizing healthcare, from diagnosis and treatment to administrative tasks, and the ethical questions it raises.",
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
    category: "AI & Machine Learning",
    author: authors[3],
    date: "November 20, 2023",
    readTime: "13 min read",
    slug: "role-of-ai-in-healthcare-innovations-ethical-considerations",
  },
  {
    id: "10",
    title: "Serverless Computing: Benefits, Limitations, and Use Cases",
    excerpt: "An in-depth analysis of serverless computing, including its advantages, limitations, and ideal use cases for modern application development.",
    coverImage: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=800&auto=format&fit=crop",
    category: "Cloud Computing",
    author: authors[1],
    date: "December 8, 2023",
    readTime: "9 min read",
    slug: "serverless-computing-benefits-limitations-use-cases",
  },
];

// Function to get article by slug
export const getArticleBySlug = (slug: string): ArticleProps | undefined => {
  return articles.find((article) => article.slug === slug);
};

// Function to get articles by category
export const getArticlesByCategory = (category: string): ArticleProps[] => {
  return articles.filter(
    (article) => article.category.toLowerCase() === category.toLowerCase()
  );
};

// Function to get featured articles
export const getFeaturedArticles = (): ArticleProps[] => {
  return articles.filter((article) => article.featured);
};

// Mock comments data
export interface CommentProps {
  id: string;
  articleId: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
  replies?: CommentProps[];
}

export const comments: CommentProps[] = [
  {
    id: "1",
    articleId: "1",
    author: {
      name: "John Smith",
      avatar: "https://i.pravatar.cc/150?img=10",
    },
    content: "This is a fascinating insight into the future of AI. I particularly appreciated the section on ethical considerations.",
    date: "May 16, 2023",
    replies: [
      {
        id: "1-1",
        articleId: "1",
        author: authors[0],
        content: "Thank you for your feedback, John! I'm glad you found the ethical considerations section valuable.",
        date: "May 16, 2023",
      },
    ],
  },
  {
    id: "2",
    articleId: "1",
    author: {
      name: "Emily Johnson",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    content: "Great article! I work in healthcare and we're already seeing some of these AI applications in diagnostic tools.",
    date: "May 17, 2023",
  },
  {
    id: "3",
    articleId: "2",
    author: {
      name: "Robert Chen",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    content: "We just completed a major cloud migration at my company and this would have been invaluable. Saving for future reference!",
    date: "April 23, 2023",
  },
];

// Function to get comments by article ID
export const getCommentsByArticleId = (articleId: string): CommentProps[] => {
  return comments.filter((comment) => comment.articleId === articleId);
};
