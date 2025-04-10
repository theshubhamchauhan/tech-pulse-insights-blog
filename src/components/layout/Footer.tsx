
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t py-8 md:py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-heading text-xl mb-3">Duck<span className="text-primary-500">cod</span></h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Duckcod is your source for in-depth analysis, case studies and insights on the latest technology trends and innovations.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary-500 transition-colors"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary-500 transition-colors"
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary-500 transition-colors"
              >
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading text-base mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary-500 transition-colors">Categories</Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary-500 transition-colors">About</Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary-500 transition-colors">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-primary-500 transition-colors">Register</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-base mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/categories/ai" className="text-muted-foreground hover:text-primary-500 transition-colors">AI & Machine Learning</Link>
              </li>
              <li>
                <Link to="/categories/cloud" className="text-muted-foreground hover:text-primary-500 transition-colors">Cloud Computing</Link>
              </li>
              <li>
                <Link to="/categories/development" className="text-muted-foreground hover:text-primary-500 transition-colors">Web Development</Link>
              </li>
              <li>
                <Link to="/categories/cybersecurity" className="text-muted-foreground hover:text-primary-500 transition-colors">Cybersecurity</Link>
              </li>
              <li>
                <Link to="/categories/data" className="text-muted-foreground hover:text-primary-500 transition-colors">Data Science</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Duckcod. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary-500 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary-500 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
