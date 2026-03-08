import { useState } from "react";
import clsx from "clsx";
import { Sidebar } from "@/components/chat/sidebar";
import { ChatArea } from "@/components/chat/chat-area";
import { GraphModal } from "@/components/modals/graph-modal";
import { CitationsModal } from "@/components/modals/citations-modal";

export default function Home() {
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [isCitationsOpen, setIsCitationsOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[hsl(var(--wa-body-bg))] overflow-hidden items-center justify-center">
      {/* Top green strip background native to classic WhatsApp Web */}
      <div className="absolute top-0 left-0 w-full h-[127px] bg-[hsl(var(--secondary))] z-0"></div>

      {/* Main Application Container */}
      <div className="flex flex-col md:flex-row w-full max-w-[1600px] h-full md:h-[calc(100vh-40px)] rounded md:shadow-2xl bg-white z-10 overflow-hidden md:m-5 wa-shadow border-gray-300">

        <div className={clsx(
          "h-full transition-all duration-300",
          selectedContactId ? "hidden md:block md:w-[30%]" : "w-full"
        )}>
          <Sidebar 
            selectedContactId={selectedContactId} 
            onSelectContact={setSelectedContactId}
            onOpenGraph={() => setIsGraphOpen(true)}
            onOpenCitations={() => setIsCitationsOpen(true)}
          />
        </div>

        <div className={clsx(
          "h-full flex-1 transition-all duration-300",
          !selectedContactId ? "hidden md:flex" : "flex"
        )}>
          <ChatArea 
            contactId={selectedContactId} 
            onBack={() => setSelectedContactId(null)}
          />
        </div>
      </div>

      <GraphModal open={isGraphOpen} onOpenChange={setIsGraphOpen} />
      <CitationsModal open={isCitationsOpen} onOpenChange={setIsCitationsOpen} />
    </div>
  );
}