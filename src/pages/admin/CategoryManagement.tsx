
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
} from "@/components/ui/form";
import { 
  Search,
  MoreHorizontal,
  FolderPlus,
  Edit2,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Category } from "@/lib/types";

// Form schema for category
const categoryFormSchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters" }),
  slug: z.string().min(2, { message: "Slug must be at least 2 characters" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { 
      message: "Slug must be lowercase with hyphens only (e.g. my-category)" 
    }),
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
  
  const addCategoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const editCategoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
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
      });
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
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Articles</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Loading categories...</TableCell>
              </TableRow>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
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
                      }
                    }}>
                      <DialogContent className="sm:max-w-[425px]">
                        <Form {...editCategoryForm}>
                          <form onSubmit={editCategoryForm.handleSubmit(handleEditCategory)}>
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                              <DialogDescription>
                                Update the category name and slug
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
                <TableCell colSpan={4} className="text-center">No categories found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategoryManagement;
