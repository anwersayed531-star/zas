import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const FloatingChatButton = ({ onClick, isOpen }: FloatingChatButtonProps) => {
  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <div className="absolute -top-12 right-0 bg-popover text-popover-foreground px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        مساعد ZAS AI
      </div>
      <Button
        onClick={onClick}
        size="lg"
        className="h-16 w-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
      >
        <Bot className="h-8 w-8" />
      </Button>
    </div>
  );
};
