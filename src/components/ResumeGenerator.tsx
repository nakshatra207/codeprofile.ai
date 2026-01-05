import { useState } from "react";
import { LeetCodeStats } from "@/hooks/useLeetCodeStats";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, FileText, Loader2 } from "lucide-react";
import { downloadResumeText, ResumeOptions } from "@/utils/resumeGenerator";
import { useToast } from "@/hooks/use-toast";

interface ResumeGeneratorProps {
  stats: LeetCodeStats;
}

export function ResumeGenerator({ stats }: ResumeGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<"FAANG" | "Startup" | "Service">("FAANG");
  const [options, setOptions] = useState<ResumeOptions>({
    format: "FAANG",
    includeSkills: true,
    includeContests: true,
    includeBadges: true,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDownload = () => {
    setLoading(true);
    try {
      downloadResumeText(stats, { ...options, format }, `leetcode-resume-${stats.username}-${format.toLowerCase()}.txt`);
      toast({
        title: "Resume downloaded!",
        description: "Your resume has been downloaded as a text file.",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-secondary/50">
          <FileText className="w-4 h-4 mr-2" />
          Generate Resume
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Resume</DialogTitle>
          <DialogDescription>
            Create a text-based resume from your LeetCode profile. Choose your preferred format and options.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label>Resume Format</Label>
            <RadioGroup
              value={format}
              onValueChange={(value) => {
                setFormat(value as "FAANG" | "Startup" | "Service");
                setOptions({ ...options, format: value as "FAANG" | "Startup" | "Service" });
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FAANG" id="faang" />
                <Label htmlFor="faang" className="font-normal cursor-pointer">
                  FAANG / Top Tech Companies
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Startup" id="startup" />
                <Label htmlFor="startup" className="font-normal cursor-pointer">
                  Startup / Mid-Tier Companies
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Service" id="service" />
                <Label htmlFor="service" className="font-normal cursor-pointer">
                  Service-Based Companies
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label>Include Sections</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="skills"
                  checked={options.includeSkills}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeSkills: checked === true })
                  }
                />
                <Label htmlFor="skills" className="font-normal cursor-pointer">
                  Top Skills & Topic Mastery
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contests"
                  checked={options.includeContests}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeContests: checked === true })
                  }
                />
                <Label htmlFor="contests" className="font-normal cursor-pointer">
                  Contest Performance
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="badges"
                  checked={options.includeBadges}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeBadges: checked === true })
                  }
                />
                <Label htmlFor="badges" className="font-normal cursor-pointer">
                  Achievements & Badges
                </Label>
              </div>
            </div>
          </div>

          {/* Preview Info */}
          <div className="glass-card p-4 rounded-lg bg-cyan/5 border border-cyan/20">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This will generate a text (.txt) file that you can use as a resume section or convert to PDF using a word processor.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDownload}
              disabled={loading}
              className="bg-gradient-to-r from-cyan to-blue hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

