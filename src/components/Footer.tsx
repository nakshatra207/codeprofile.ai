import { Code2, Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-blue flex items-center justify-center">
                <Code2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">CodeProfile.ai</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Turn your LeetCode grind into a verified job profile recruiters trust.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-cyan transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-cyan transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-cyan transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-cyan transition-colors">Features</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-cyan transition-colors">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-cyan transition-colors">Resume Builder</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-cyan transition-colors">API</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-cyan transition-colors">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-cyan transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-cyan transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-cyan transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-cyan transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-cyan transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-cyan transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 CodeProfile.ai. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Made with 💙 for developers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
