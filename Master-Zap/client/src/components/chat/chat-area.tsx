import { useEffect, useRef } from "react";
import { useContact } from "@/hooks/use-contacts";
import { useMessages } from "@/hooks/use-messages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Mic, Paperclip, Smile, Send, Loader2, Network, Search } from "lucide-react";
import { clsx } from "clsx";

interface ChatAreaProps {
  contactId: number | null;
  onBack?: () => void;
}

export function ChatArea({ contactId, onBack }: ChatAreaProps) {
  const { data: contact, isLoading: isLoadingContact } = useContact(contactId);
  const { data: messages, isLoading: isLoadingMessages } = useMessages(contactId);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages load
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Empty state when no contact is selected
  if (!contactId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[hsl(var(--wa-header-bg))] border-b-[6px] border-primary">
        <div className="w-[320px] h-[200px] mb-8 opacity-20 bg-primary/20 rounded-full flex items-center justify-center">
          <NetworkIcon className="h-32 w-32 text-primary" />
        </div>
        <h1 className="text-3xl font-light text-[#41525d] mb-4">MasterZap - Caso Vorcaro</h1>
        <p className="text-[#667781] text-sm text-center max-w-md mb-8">
          Envie e receba mensagens sem precisar manter seu celular conectado.<br/>
          Use o WhatsApp em até 4 aparelhos vinculados e 1 celular ao mesmo tempo.
        </p>
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#8696a0]">
          <Lock className="h-3 w-3" />
          <span>Simulação baseada em dados públicos de março de 2026.</span>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoadingContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[hsl(var(--wa-chat-bg))] bg-chat-pattern relative">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Active Chat
  return (
    <div className="flex-1 flex flex-col bg-[hsl(var(--wa-chat-bg))] relative h-full">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-chat-pattern opacity-40 z-0"></div>

      {/* Chat Header */}
      <div className="h-[59px] bg-[hsl(var(--wa-header-bg))] flex items-center px-3 sm:px-4 shrink-0 z-10 border-l border-gray-200/50">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 cursor-pointer min-w-0">
          {onBack && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden h-8 w-8 text-gray-600 mr-1 flex-shrink-0" 
              onClick={onBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={contact?.avatar} />
            <AvatarFallback>{contact?.name?.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="font-medium text-[14px] sm:text-[16px] text-foreground leading-tight truncate">{contact?.name}</h2>
            <p className="text-[12px] sm:text-[13px] text-[hsl(var(--wa-text-muted))] leading-tight truncate">
              {contact?.isOnline ? "online" : "visto por último recentemente"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 text-gray-500 flex-shrink-0">
          <SearchIcon className="h-4 sm:h-5 w-4 sm:w-5 cursor-pointer" />
          <MoreVerticalIcon className="h-4 sm:h-5 w-4 sm:w-5 cursor-pointer" />
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-[9%] py-3 sm:py-4 z-10"
      >
        {/* End-to-end encryption notice */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#ffeecd] text-center text-[#54656f] text-xs py-1.5 px-3 rounded-md shadow-sm max-w-sm flex items-center gap-1">
            <Lock className="h-3 w-3 shrink-0" />
            <span>As mensagens são baseadas em transcrições públicas. Esta é uma simulação educacional.</span>
          </div>
        </div>

        {isLoadingMessages ? (
          <div className="flex justify-center my-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 pb-2">
            {messages?.map((msg: any, index: number) => {
              const showDateGroup = index === 0 || messages[index - 1].dateGroup !== msg.dateGroup;
              const isMe = msg.sender === "me";

              return (
                <div key={msg.id} className="flex flex-col w-full">
                  {showDateGroup && (
                    <div className="flex justify-center my-4">
                      <div className="bg-white text-[#54656f] text-xs py-1 px-3 rounded-lg shadow-sm font-medium">
                        {msg.dateGroup}
                      </div>
                    </div>
                  )}
                  
                  <div className={clsx(
                    "flex w-full mb-1",
                    isMe ? "justify-end" : "justify-start"
                  )}>
                    <div className={clsx(
                      "relative max-w-[90%] sm:max-w-[80%] md:max-w-[65%] rounded-lg px-3 py-2 shadow-sm text-[13px] sm:text-[14.2px] leading-[18px] sm:leading-[19px]",
                      isMe ? "bg-[hsl(var(--wa-bubble-me))] rounded-tr-none text-[#111b21]" : "bg-[hsl(var(--wa-bubble-other))] rounded-tl-none text-[#111b21]"
                    )} style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                      {/* Message text with proper wrapping */}
                      <div className="whitespace-pre-wrap break-words pb-5">
                        {msg.text}
                      </div>
                      <div className="absolute right-2 bottom-0.5 flex items-center gap-0.5 text-[10px] sm:text-[11px] text-[#667781] flex-shrink-0">
                        <span>{msg.time}</span>
                        {isMe && <CheckChecksIcon className="h-[12px] w-[12px] sm:h-[14px] sm:w-[14px] text-[#53bdeb] flex-shrink-0" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Input Area (Read-only simulation) */}
      <div className="min-h-[62px] bg-[hsl(var(--wa-header-bg))] flex items-center px-2 sm:px-4 py-2 gap-2 sm:gap-3 z-10 shrink-0">
        <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-200 rounded-full h-9 sm:h-10 w-9 sm:w-10 shrink-0 disabled:opacity-50 flex-shrink-0">
          <Smile className="h-5 sm:h-6 w-5 sm:w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-200 rounded-full h-9 sm:h-10 w-9 sm:w-10 shrink-0 disabled:opacity-50 flex-shrink-0">
          <Paperclip className="h-5 sm:h-6 w-5 sm:w-6" />
        </Button>
        
        <div className="flex-1 bg-white rounded-lg flex items-center px-3 h-9 sm:h-10 border border-transparent focus-within:border-primary/20 min-w-0">
          <Input 
            className="border-none shadow-none focus-visible:ring-0 px-0 h-full placeholder:text-muted-foreground/70 text-sm"
            placeholder="Modo de leitura apenas. Esta é uma simulação."
            disabled
          />
        </div>
        
        <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-200 rounded-full h-9 sm:h-10 w-9 sm:w-10 shrink-0 disabled:opacity-50 flex-shrink-0">
          <Mic className="h-5 sm:h-6 w-5 sm:w-6" />
        </Button>
      </div>
    </div>
  );
}

// Helper icons for WhatsApp style
function NetworkIcon(props: any) {
  return <Network {...props} />;
}
function SearchIcon(props: any) {
  return <Search {...props} />;
}
function MoreVerticalIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
      <path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"></path>
    </svg>
  );
}
function CheckChecksIcon(props: any) {
  return (
    <svg viewBox="0 0 16 15" width="16" height="15" fill="currentColor" {...props}>
      <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.32.32 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.365 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.365 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
    </svg>
  );
}
