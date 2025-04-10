import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormDescription,
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Save,
  Image,
  FileText,
  Tag,
  Plus,
  X,
  ArrowLeft,
  Eye,
  Clock,
  Settings,
  Upload,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Article, Category, Tag as TagType, ArticleStatus } from "@/lib/types";

const articleFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  slug: z.string().min(5, { message: "Slug must be at least 5 characters" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { 
      message: "Slug must be lowercase with hyphens only (e.g. my-article-title)" 
    }),
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters" })
    .max(200, { message: "Excerpt cannot exceed 200 characters" }),
  content: z.string().min(50, { message: "Content must be at least 50 characters" }),
  category_id: z.string().uuid({ message: "Please select a category" }),
  cover_image: z.string().url({ message: "Please enter a valid URL for the cover image" }),
  read_time: z.string().min(1, { message: "Please provide estimated read time" }),
  status: z.enum(["published", "draft", "scheduled"], { 
    required_error: "Please select a status" 
  }),
  is_featured: z.boolean().default(false),
});

const seoFormSchema = z.object({
  meta_title: z.string().max(60, { message: "Meta title should not exceed 60 characters" }).optional(),
  meta_description: z.string().max(160, { message: "Meta description should not exceed 160 characters" }).optional(),
  meta_keywords: z.string().max(200, { message: "Meta keywords should not exceed 200 characters" }).optional(),
  canonical_url: z.string().url({ message: "Please enter a valid canonical URL" }).optional().or(z.literal('')),
  og_image: z.string().url({ message: "Please enter a valid URL for the OG image" }).optional().or(z.literal('')),
});

const formSchema = z.object({
  article: articleFormSchema,
  seo: seoFormSchema,
});

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<TagType[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const contentEditorRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      article: {
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category_id: "",
        cover_image: "",
        read_time: "5 min read",
        status: "draft" as ArticleStatus,
        is_featured: false,
      },
      seo: {
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        canonical_url: "",
        og_image: "",
      },
    },
  });

  useEffect(() => {
    if (id && id !== 'new') {
      loadArticle(id);
    }
    
    if (!id || id === 'new') {
      setTimeout(() => {
        if (titleInputRef.current) {
          titleInputRef.current.focus();
        }
      }, 100);
    }
    
    fetchCategories();
    fetchTags();
  }, [id]);

  const loadArticle = async (articleId: string) => {
    try {
      setIsLoading(true);
      
      const { data: article, error: articleError } = await supabase
        .from("articles")
        .select("*")
        .eq("id", articleId)
        .single();
      
      if (articleError) throw articleError;
      if (!article) throw new Error("Article not found");
      
      const { data: articleTags, error: tagsError } = await supabase
        .from("article_tags")
        .select("tags(*)")
        .eq("article_id", articleId);
      
      if (tagsError) throw tagsError;
      
      const tags = articleTags?.map(item => item.tags) || [];
      setSelectedTags(tags);
      
      form.reset({
        article: {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          category_id: article.category_id,
          cover_image: article.cover_image,
          read_time: article.read_time,
          status: (article.status as ArticleStatus) || "draft",
          is_featured: article.is_featured || false,
        },
        seo: {
          meta_title: article.meta_title || "",
          meta_description: article.meta_description || "",
          meta_keywords: article.meta_keywords || "",
          canonical_url: article.canonical_url || "",
          og_image: article.og_image || "",
        },
      });
    } catch (error: any) {
      toast.error("Error loading article", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast.error("Error fetching categories", {
        description: error.message,
      });
    }
  };

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");
      
      if (error) throw error;
      setAvailableTags(data || []);
    } catch (error: any) {
      toast.error("Error fetching tags", {
        description: error.message,
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (title: string) => {
    form.setValue("article.title", title);
    
    const currentSlug = form.getValues("article.slug");
    const derivedSlug = generateSlug(title);
    
    if (!currentSlug || currentSlug === generateSlug(form.getValues("article.title"))) {
      form.setValue("article.slug", derivedSlug);
    }
    
    const currentMetaTitle = form.getValues("seo.meta_title");
    if (!currentMetaTitle) {
      form.setValue("seo.meta_title", title);
    }
  };

  const handleExcerptChange = (excerpt: string) => {
    form.setValue("article.excerpt", excerpt);
    
    const currentMetaDescription = form.getValues("seo.meta_description");
    if (!currentMetaDescription) {
      form.setValue("seo.meta_description", excerpt);
    }
  };

  const addTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      const existingTag = availableTags.find(
        tag => tag.name.toLowerCase() === newTagName.trim().toLowerCase()
      );
      
      if (existingTag) {
        if (!selectedTags.some(tag => tag.id === existingTag.id)) {
          setSelectedTags([...selectedTags, existingTag]);
        }
        setNewTagName("");
        return;
      }
      
      const slug = generateSlug(newTagName);
      
      const { data: newTag, error } = await supabase
        .from("tags")
        .insert({
          name: newTagName.trim(),
          slug: slug,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setAvailableTags([...availableTags, newTag]);
      setSelectedTags([...selectedTags, newTag]);
      setNewTagName("");
    } catch (error: any) {
      toast.error("Error adding tag", {
        description: error.message,
      });
    }
  };

  const toggleTag = (tag: TagType) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    
    if (isSelected) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleContentChange = (content: string) => {
    form.setValue("article.content", content);
    
    const readTime = estimateReadTime(content);
    form.setValue("article.read_time", readTime);
  };

  const saveArticle = async (data: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be logged in to save an article");
      return;
    }
    
    try {
      setIsSaving(true);
      
      const { article, seo } = data;
      
      const articleData = {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        category_id: article.category_id,
        cover_image: article.cover_image,
        read_time: article.read_time,
        status: article.status,
        is_featured: article.is_featured,
        author_id: user.id,
        meta_title: seo.meta_title || null,
        meta_description: seo.meta_description || null,
        meta_keywords: seo.meta_keywords || null,
        canonical_url: seo.canonical_url || null,
        og_image: seo.og_image || null,
      };
      
      let articleId = id && id !== 'new' ? id : undefined;
      
      if (articleId) {
        const { data, error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", articleId)
          .select()
          .single();
        
        if (error) throw error;
        articleId = data.id;
      } else {
        const { data, error } = await supabase
          .from("articles")
          .insert(articleData)
          .select()
          .single();
        
        if (error) throw error;
        articleId = data.id;
      }
      
      if (articleId) {
        const { error: deleteError } = await supabase
          .from("article_tags")
          .delete()
          .eq("article_id", articleId);
        
        if (deleteError) throw deleteError;
        
        if (selectedTags.length > 0) {
          const tagAssociations = selectedTags.map(tag => ({
            article_id: articleId,
            tag_id: tag.id,
          }));
          
          const { error: insertError } = await supabase
            .from("article_tags")
            .insert(tagAssociations);
          
          if (insertError) throw insertError;
        }
      }
      
      setIsSuccess(true);
      
      toast.success(
        id && id !== 'new' ? "Article updated successfully" : "Article created successfully",
        {
          description: article.status === "published" 
            ? "The article is now live on your site" 
            : "The article has been saved as a draft"
        }
      );
      
      setTimeout(() => {
        navigate(`/admin/articles`);
      }, 2000);
    } catch (error: any) {
      toast.error("Error saving article", {
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500";
      case "draft":
        return "bg-yellow-500";
      case "scheduled":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4" />;
      case "draft":
        return <AlertTriangle className="h-4 w-4" />;
      case "scheduled":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/admin/articles')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {id && id !== 'new' ? 'Edit Article' : 'Create New Article'}
          </h1>
          {form.watch("article.status") && (
            <Badge className={`${getStatusColor(form.watch("article.status"))} text-white ml-2`}>
              <span className="flex items-center gap-1">
                {getStatusIcon(form.watch("article.status"))}
                {form.watch("article.status").charAt(0).toUpperCase() + form.watch("article.status").slice(1)}
              </span>
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Tabs defaultValue="edit" className="mr-4">
            <TabsList>
              <TabsTrigger 
                value="edit" 
                onClick={() => setPreviewMode(false)}
                className="flex items-center"
              >
                <FileText className="h-4 w-4 mr-1" />
                Edit
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                onClick={() => setPreviewMode(true)}
                className="flex items-center"
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setShowSettings(!showSettings)}
            className={showSettings ? "bg-slate-100" : ""}
          >
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={form.handleSubmit((data) => saveArticle(data))}
            disabled={isSaving || isSuccess}
            className="flex items-center"
          >
            {isSaving ? (
              <>Saving...</>
            ) : isSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className={`lg:col-span-${showSettings ? '2' : '3'}`}>
                <Card>
                  <CardHeader>
                    <CardTitle>Article Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="article.title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter article title" 
                              className="text-xl font-bold" 
                              ref={titleInputRef}
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                handleTitleChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="article.slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <span className="text-muted-foreground text-sm mr-1">/article/</span>
                              <Input placeholder="article-slug" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            This will be used in the URL for this article. 
                            Must be unique and contain only lowercase letters, numbers, and hyphens.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="article.excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief summary of the article (max 200 characters)" 
                              className="resize-none" 
                              rows={3}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleExcerptChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            {field.value.length}/200 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="article.content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          {previewMode ? (
                            <div 
                              className="border rounded-md p-4 min-h-[300px] prose max-w-none"
                              dangerouslySetInnerHTML={{ __html: field.value }}
                            />
                          ) : (
                            <FormControl>
                              <Textarea 
                                placeholder="Write your article content here..."
                                className="min-h-[300px]"
                                ref={contentEditorRef}
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleContentChange(e.target.value);
                                }}
                              />
                            </FormControl>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {showSettings && (
                <div className="lg:col-span-1 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Article Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="article.category_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="article.cover_image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cover Image URL</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <Input placeholder="https://example.com/image.jpg" {...field} />
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="icon" className="ml-2">
                                        <Upload className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                      <DialogHeader>
                                        <DialogTitle>Upload image</DialogTitle>
                                        <DialogDescription>
                                          Upload an image for your article cover.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4 py-4">
                                        <div className="flex items-center justify-center border-2 border-dashed rounded-md py-12">
                                          <div className="text-center">
                                            <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <div className="mt-4">
                                              <Button variant="secondary">
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload Image
                                              </Button>
                                            </div>
                                            <p className="mt-2 text-xs text-muted-foreground">
                                              PNG, JPG, GIF up to 2MB
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button type="button" variant="outline">
                                          Cancel
                                        </Button>
                                        <Button type="button">Upload</Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                                {field.value && (
                                  <div className="mt-2 border rounded-md overflow-hidden">
                                    <img
                                      src={field.value}
                                      alt="Cover preview"
                                      className="w-full h-32 object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/1200x630?text=Image+Not+Found";
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="article.status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="article.read_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Read Time</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="5 min read" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Calculated automatically based on content length, but you can override it.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="article.is_featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-4">
                            <div className="space-y-0.5">
                              <FormLabel>Featured Article</FormLabel>
                              <FormDescription>
                                Display this article in the featured section on the homepage.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                      <CardDescription>
                        Add tags to help readers discover your article
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center">
                        <Input
                          placeholder="Add a tag"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="ml-2"
                          onClick={addTag}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {selectedTags.map((tag) => (
                          <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {tag.name}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                              onClick={() => removeTag(tag.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                        {selectedTags.length === 0 && (
                          <p className="text-sm text-muted-foreground">No tags selected</p>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Popular Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {availableTags
                            .filter(tag => !selectedTags.some(t => t.id === tag.id))
                            .slice(0, 10)
                            .map((tag) => (
                              <Badge 
                                key={tag.id} 
                                variant="outline" 
                                className="cursor-pointer hover:bg-secondary"
                                onClick={() => toggleTag(tag)}
                              >
                                {tag.name}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>SEO Settings</CardTitle>
                      <CardDescription>
                        Optimize your article for search engines
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="seo.meta_title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Title</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="SEO title (max 60 characters)" 
                                {...field} 
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              {field.value?.length || 0}/60 characters
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="seo.meta_description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="SEO description (max 160 characters)" 
                                rows={3}
                                {...field} 
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              {field.value?.length || 0}/160 characters
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="seo.meta_keywords"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Keywords</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="keyword1, keyword2, keyword3" 
                                {...field} 
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              Comma-separated keywords
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="seo.canonical_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Canonical URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://example.com/canonical-page" 
                                {...field} 
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              Optional: Use when this content appears on multiple URLs
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="seo.og_image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Social Media Image URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://example.com/social-image.jpg" 
                                {...field} 
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              Optional: Custom image for social media sharing (1200×630 recommended)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ArticleEditor;
