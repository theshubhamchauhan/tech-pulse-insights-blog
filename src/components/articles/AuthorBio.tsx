
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Author {
  name: string;
  avatar: string;
  role?: string;
  bio?: string;
}

interface AuthorBioProps {
  author: Author;
}

const AuthorBio = ({ author }: AuthorBioProps) => {
  return (
    <div className="max-w-4xl mx-auto mb-16">
      <div className="bg-muted p-8 rounded-lg">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={author.avatar} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{author.name}</h3>
            {author.role && <p className="text-muted-foreground">{author.role}</p>}
          </div>
        </div>
        <p className="text-muted-foreground">
          {author.bio || "An experienced writer and researcher with expertise in technology trends and their impact on business and society."}
        </p>
      </div>
    </div>
  );
};

export default AuthorBio;
