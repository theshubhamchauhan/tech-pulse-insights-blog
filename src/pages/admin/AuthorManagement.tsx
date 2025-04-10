
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search,
  MoreHorizontal,
  UserPlus,
  Edit2,
  Trash2,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Profile } from "@/lib/types";

// Define the form schemas for adding/editing authors
const authorFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  role: z.string().min(2, { message: "Role must be at least 2 characters" }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  avatar: z.string().url({ message: "Avatar must be a valid URL" }).optional(),
});

const AuthorManagement = () => {
  const { toast } = useToast();
  const [authors, setAuthors] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddAuthorOpen, setIsAddAuthorOpen] = useState(false);
  const [isEditAuthorOpen, setIsEditAuthorOpen] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState<Profile | null>(null);
  
  const addAuthorForm = useForm<z.infer<typeof authorFormSchema>>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: {
      name: "",
      role: "",
      bio: "",
      avatar: "",
    },
  });

  const editAuthorForm = useForm<z.infer<typeof authorFormSchema>>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: {
      name: "",
      role: "",
      bio: "",
      avatar: "",
    },
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  useEffect(() => {
    if (currentAuthor && isEditAuthorOpen) {
      editAuthorForm.reset({
        name: currentAuthor.name,
        role: currentAuthor.role || "",
        bio: currentAuthor.bio || "",
        avatar: currentAuthor.avatar || "",
      });
    }
  }, [currentAuthor, isEditAuthorOpen, editAuthorForm]);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "author");
      
      if (error) throw error;
      setAuthors(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching authors",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAuthor = async (values: z.infer<typeof authorFormSchema>) => {
    try {
      // Create auth user with random password and author role
      const randomPassword = Math.random().toString(36).slice(-8);
      const email = `author_${Date.now()}@duckcod.com`;
      
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: randomPassword,
        email_confirm: true,
        user_metadata: {
          name: values.name,
          role: "author",
        },
      });

      if (authError) throw authError;

      // Update profile with author details
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name: values.name,
          role: "author",
          bio: values.bio,
          avatar: values.avatar || null,
        })
        .eq("id", authData.user.id);

      if (profileError) throw profileError;

      toast({
        title: "Author created",
        description: `Author ${values.name} was created successfully`,
      });
      
      fetchAuthors();
      setIsAddAuthorOpen(false);
      addAuthorForm.reset();
    } catch (error: any) {
      toast({
        title: "Error creating author",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditAuthor = async (values: z.infer<typeof authorFormSchema>) => {
    if (!currentAuthor) return;
    
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name: values.name,
          role: "author",
          bio: values.bio,
          avatar: values.avatar || null,
        })
        .eq("id", currentAuthor.id);

      if (profileError) throw profileError;

      toast({
        title: "Author updated",
        description: `Author ${values.name} was updated successfully`,
      });
      
      fetchAuthors();
      setIsEditAuthorOpen(false);
      setCurrentAuthor(null);
      editAuthorForm.reset();
    } catch (error: any) {
      toast({
        title: "Error updating author",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteAuthor = async (authorId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(authorId);
      
      if (error) throw error;
      
      toast({
        title: "Author deleted",
        description: "The author has been deleted successfully",
      });
      
      fetchAuthors();
    } catch (error: any) {
      toast({
        title: "Error deleting author",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredAuthors = authors.filter(author => 
    author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Authors</h2>
        <Dialog open={isAddAuthorOpen} onOpenChange={setIsAddAuthorOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-5 w-5" />
              Add Author
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...addAuthorForm}>
              <form onSubmit={addAuthorForm.handleSubmit(handleAddAuthor)}>
                <DialogHeader>
                  <DialogTitle>Add New Author</DialogTitle>
                  <DialogDescription>
                    Create a new author for your publication
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <FormField
                    control={addAuthorForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addAuthorForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role/Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Senior Tech Writer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addAuthorForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Author's biographical information"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addAuthorForm.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/avatar.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter a URL for the author's profile picture
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
                  <Button type="submit">Create Author</Button>
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
            placeholder="Search authors..."
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
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Bio</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Loading authors...</TableCell>
              </TableRow>
            ) : filteredAuthors.length > 0 ? (
              filteredAuthors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <img 
                        src={author.avatar || "https://via.placeholder.com/40"} 
                        alt={author.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {author.name}
                    </div>
                  </TableCell>
                  <TableCell>{author.role || "Author"}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="truncate max-w-md">
                      {author.bio || "No bio provided"}
                    </p>
                  </TableCell>
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
                          setCurrentAuthor(author);
                          setIsEditAuthorOpen(true);
                        }}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteAuthor(author.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Edit Author Dialog */}
                    <Dialog open={isEditAuthorOpen && currentAuthor?.id === author.id} onOpenChange={(open) => {
                      if (!open) {
                        setIsEditAuthorOpen(false);
                        setCurrentAuthor(null);
                      }
                    }}>
                      <DialogContent className="sm:max-w-[425px]">
                        <Form {...editAuthorForm}>
                          <form onSubmit={editAuthorForm.handleSubmit(handleEditAuthor)}>
                            <DialogHeader>
                              <DialogTitle>Edit Author</DialogTitle>
                              <DialogDescription>
                                Update author information
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <FormField
                                control={editAuthorForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={editAuthorForm.control}
                                name="role"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Role/Title</FormLabel>
                                    <FormControl>
                                      <Input {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={editAuthorForm.control}
                                name="bio"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        className="min-h-[100px]"
                                        {...field}
                                        value={field.value || ""}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={editAuthorForm.control}
                                name="avatar"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Avatar URL</FormLabel>
                                    <FormControl>
                                      <Input {...field} value={field.value || ""} />
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
                <TableCell colSpan={4} className="text-center">No authors found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AuthorManagement;
