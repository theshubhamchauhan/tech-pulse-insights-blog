
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SimpleProfile, ensureAuthor } from "@/lib/types";

interface AuthorBioProps {
  author: SimpleProfile;
}

const AuthorBio = ({ author }: AuthorBioProps) => {
  // Convert SimpleProfile to Author to ensure avatar is not null
  const authorWithAvatar = ensureAuthor(author);

  return (
    <div className="max-w-4xl mx-auto mb-16">
      <div className="bg-muted p-8 rounded-lg">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={authorWithAvatar.avatar} />
            <AvatarFallback>{authorWithAvatar.name?.charAt(0) || 'A'}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{authorWithAvatar.name}</h3>
            {authorWithAvatar.role && <p className="text-muted-foreground">{authorWithAvatar.role}</p>}
          </div>
        </div>
        <p className="text-muted-foreground">
          {authorWithAvatar.bio || "An experienced writer and researcher with expertise in technology trends and their impact on business and society."}
        </p>
      </div>
    </div>
  );
};

export default AuthorBio;
