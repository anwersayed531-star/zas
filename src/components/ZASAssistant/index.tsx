import { useState } from "react";
import { FloatingChatButton } from "./FloatingChatButton";
import { ChatWindow } from "./ChatWindow";
import { useCode } from "@/contexts/CodeContext";

export const ZASAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { sourceCode, translatedCode } = useCode();

  return (
    <>
      <FloatingChatButton
        onClick={() => setIsOpen(true)}
        isOpen={isOpen}
      />
      <ChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        sourceCode={sourceCode}
        translatedCode={translatedCode}
      />
    </>
  );
};
