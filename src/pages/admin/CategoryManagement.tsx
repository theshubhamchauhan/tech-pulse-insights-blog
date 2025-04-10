
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { 
  Search,
  MoreHorizontal,
  FolderPlus,
  Edit2,
  Trash2,
  Image,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Category } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';

// Form schema for category
const categoryFormSchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters" }),
  slug: z.string().min(2, { message: "Slug must be at least 2 characters" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { 
      message: "Slug must be lowercase with hyphens only (e.g. my-category)" 
    }),
  image_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
});

const CategoryManagement = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [articleCounts, setArticleCounts] = useState<Record<string, number>>({});
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  
  const addCategoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      image_url: "",
    },
  });

  const editCategoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      image_url: "",
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (currentCategory && isEditCategoryOpen) {
      editCategoryForm.reset({
        name: currentCategory.name,
        slug: currentCategory.slug,
        image_url: currentCategory.image_url || "",
      });
      
      if (currentCategory.image_url) {
        setPreviewImage(currentCategory.image_url);
      } else {
        setPreviewImage("");
      }
    }
  }, [currentCategory, isEditCategoryOpen, editCategoryForm]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      setCategories(data || []);
      
      // Fetch article counts for each category
      await fetchArticleCounts(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching categories",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchArticleCounts = async (categories: Category[]) => {
    try {
      const counts: Record<string, number> = {};
      
      for (const category of categories) {
        const { count, error } = await supabase
          .from("articles")
          .select("*", { count: "exact", head: true })
          .eq("category_id", category.id);
          
        if (error) throw error;
        counts[category.id] = count || 0;
      }
      
      setArticleCounts(counts);
    } catch (error: any) {
      console.error("Error fetching article counts:", error);
    }
  };

  const uploadCategoryImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      
      // Generate a unique path for the image
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `category-images/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded file
      const { data } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
      return "";
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, formType: 'add' | 'edit') => {
    const form = formType === 'add' ? addCategoryForm : editCategoryForm;
    
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // Convert to MB
    
    if (fileSize > 2) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }
    
    const imageUrl = await uploadCategoryImage(file);
    
    if (imageUrl) {
      form.setValue("image_url", imageUrl);
      setPreviewImage(imageUrl);
    }
  };

  const handleAddCategory = async (values: z.infer<typeof categoryFormSchema>) => {
    try {
      // Check if slug already exists
      const { data: existingSlug, error: slugCheckError } = await supabase
        .from("categories")
        .select("slug")
        .eq("slug", values.slug)
        .maybeSingle();
        
      if (slugCheckError) throw slugCheckError;
      
      if (existingSlug) {
        addCategoryForm.setError("slug", { 
          message: "This slug is already taken. Please choose another one." 
        });
        return;
      }
      
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: values.name,
          slug: values.slug,
          image_url: values.image_url || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Category created",
        description: `Category "${values.name}" was created successfully`,
      });
      
      fetchCategories();
      setIsAddCategoryOpen(false);
      addCategoryForm.reset();
      setPreviewImage("");
    } catch (error: any) {
      toast({
        title: "Error creating category",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = async (values: z.infer<typeof categoryFormSchema>) => {
    if (!currentCategory) return;
    
    try {
      // Check if slug already exists and it's not the current category's slug
      if (values.slug !== currentCategory.slug) {
        const { data: existingSlug, error: slugCheckError } = await supabase
          .from("categories")
          .select("slug")
          .eq("slug", values.slug)
          .maybeSingle();
          
        if (slugCheckError) throw slugCheckError;
        
        if (existingSlug) {
          editCategoryForm.setError("slug", { 
            message: "This slug is already taken. Please choose another one." 
          });
          return;
        }
      }
      
      const { error } = await supabase
        .from("categories")
        .update({
          name: values.name,
          slug: values.slug,
          image_url: values.image_url || null,
        })
        .eq("id", currentCategory.id);
      
      if (error) throw error;
      
      toast({
        title: "Category updated",
        description: `Category "${values.name}" was updated successfully`,
      });
      
      fetchCategories();
      setIsEditCategoryOpen(false);
      setCurrentCategory(null);
      editCategoryForm.reset();
      setPreviewImage("");
    } catch (error: any) {
      toast({
        title: "Error updating category",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    try {
      // Check if the category has articles
      const count = articleCounts[category.id] || 0;
      
      if (count > 0) {
        toast({
          title: "Cannot delete category",
          description: `This category has ${count} articles. Please remove or reassign these articles first.`,
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", category.id);
      
      if (error) throw error;
      
      toast({
        title: "Category deleted",
        description: `Category "${category.name}" was deleted successfully`,
      });
      
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/-+/g, '-');     // Replace multiple - with single -
  };

  const handleNameChange = (name: string, formType: 'add' | 'edit') => {
    const form = formType === 'add' ? addCategoryForm : editCategoryForm;
    
    form.setValue("name", name);
    
    // Only auto-generate slug if it's empty or matches the previous auto-generated value
    const currentSlug = form.getValues("slug");
    const currentName = formType === 'edit' && currentCategory 
      ? currentCategory.name 
      : "";
      
    if (!currentSlug || currentSlug === generateSlug(currentName)) {
      form.setValue("slug", generateSlug(name));
    }
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="mr-2 h-5 w-5" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...addCategoryForm}>
              <form onSubmit={addCategoryForm.handleSubmit(handleAddCategory)}>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>
                    Create a new category for organizing articles
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <FormField
                    control={addCategoryForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Technology" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              handleNameChange(e.target.value, 'add');
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addCategoryForm.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="technology" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addCategoryForm.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Image</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Input 
                                placeholder="https://example.com/image.jpg" 
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="ml-2"
                                onClick={() => document.getElementById('add-category-image-upload')?.click()}
                                disabled={uploading}
                              >
                                {uploading ? 
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /> : 
                                  <Upload className="h-4 w-4" />
                                }
                              </Button>
                              <input
                                id="add-category-image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, 'add')}
                              />
                            </div>
                            {field.value && (
                              <div className="mt-2 border rounded-md overflow-hidden">
                                <img
                                  src={field.value}
                                  alt="Category preview"
                                  className="w-full h-32 object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload an image for the category or enter an image URL
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Create Category</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search categories..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Articles</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Loading categories...</TableCell>
              </TableRow>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {category.image_url ? (
                      <img 
                        src={category.image_url} 
                        alt={category.name} 
                        className="w-12 h-12 object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/48?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                        <Image className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{articleCounts[category.id] || 0}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setCurrentCategory(category);
                          setIsEditCategoryOpen(true);
                        }}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive" 
                          onClick={() => handleDeleteCategory(category)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Edit Category Dialog */}
                    <Dialog open={isEditCategoryOpen && currentCategory?.id === category.id} onOpenChange={(open) => {
                      if (!open) {
                        setIsEditCategoryOpen(false);
                        setCurrentCategory(null);
                        setPreviewImage("");
                      }
                    }}>
                      <DialogContent className="sm:max-w-[425px]">
                        <Form {...editCategoryForm}>
                          <form onSubmit={editCategoryForm.handleSubmit(handleEditCategory)}>
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                              <DialogDescription>
                                Update the category name, slug, and image
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <FormField
                                control={editCategoryForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                      <Input 
                                        {...field} 
                                        onChange={(e) => {
                                          field.onChange(e);
                                          handleNameChange(e.target.value, 'edit');
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={editCategoryForm.control}
                                name="slug"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={editCategoryForm.control}
                                name="image_url"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Category Image</FormLabel>
                                    <FormControl>
                                      <div className="space-y-2">
                                        <div className="flex items-center">
                                          <Input 
                                            placeholder="https://example.com/image.jpg" 
                                            {...field} 
                                          />
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="ml-2"
                                            onClick={() => document.getElementById('edit-category-image-upload')?.click()}
                                            disabled={uploading}
                                          >
                                            {uploading ? 
                                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /> : 
                                              <Upload className="h-4 w-4" />
                                            }
                                          </Button>
                                          <input
                                            id="edit-category-image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, 'edit')}
                                          />
                                        </div>
                                        {field.value && (
                                          <div className="mt-2 border rounded-md overflow-hidden">
                                            <img
                                              src={field.value}
                                              alt="Category preview"
                                              className="w-full h-32 object-cover"
                                              onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
                                              }}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </FormControl>
                                    <FormDescription>
                                      Upload a new image or enter an image URL
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No categories found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategoryManagement;
