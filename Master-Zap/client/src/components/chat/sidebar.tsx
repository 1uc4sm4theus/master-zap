import { useState } from "react";
import { useContacts } from "@/hooks/use-contacts";
import { Search, Network, BookMarked, Info, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clsx } from "clsx";

interface SidebarProps {
  selectedContactId: number | null;
  onSelectContact: (id: number) => void;
  onOpenGraph: () => void;
  onOpenCitations: () => void;
}

export function Sidebar({ selectedContactId, onSelectContact, onOpenGraph, onOpenCitations }: SidebarProps) {
  const { data: contacts, isLoading } = useContacts();
  const [search, setSearch] = useState("");

  const filteredContacts = contacts?.filter((c: any) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full md:w-[30%] md:min-w-[300px] md:max-w-[420px] flex flex-col bg-white border-r h-full z-10">
      {/* Header */}
      <div className="h-[59px] bg-[hsl(var(--wa-header-bg))] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-gray-200">
            <AvatarImage src="https://ui-avatars.com/api/?name=Master+Zap&background=075E54&color=fff" />
            <AvatarFallback>MZ</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-foreground text-sm truncate max-w-[120px]" title="MasterZap - Caso Vorcaro">
            MasterZap
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600 hover:bg-gray-200 rounded-full" onClick={onOpenCitations} title="Citações">
            <BookMarked className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600 hover:bg-gray-200 rounded-full" onClick={onOpenGraph} title="Modo Grafo">
            <Network className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Informational Banner */}
      <div className="bg-amber-100 text-amber-800 px-4 py-2 text-[11px] flex items-center gap-2 border-b border-amber-200 shrink-0">
        <Info className="h-3.5 w-3.5 shrink-0" />
        <span className="leading-tight">Dados baseados em divulgações públicas do caso Daniel Vorcaro.</span>
      </div>

      {/* Search */}
      <div className="h-[49px] p-2 bg-white border-b flex items-center shrink-0">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar ou começar uma nova conversa" 
            className="w-full pl-10 bg-[hsl(var(--wa-header-bg))] border-none h-[35px] rounded-lg focus-visible:ring-0 placeholder:text-muted-foreground text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredContacts?.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground text-sm">
            Nenhum contato encontrado.
          </div>
        ) : (
          filteredContacts?.map((contact: any) => (
            <div 
              key={contact.id}
              onClick={() => onSelectContact(contact.id)}
              className={clsx(
                "flex items-center px-3 py-2 cursor-pointer transition-colors hover:bg-[hsl(var(--wa-header-bg))]",
                selectedContactId === contact.id ? "bg-[hsl(var(--wa-header-bg))]" : ""
              )}
            >
              <Avatar className="h-12 w-12 mr-3 shrink-0">
                <AvatarImage src={contact.avatar} />
                <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 border-b border-gray-100 pb-3 pt-1">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="text-[16px] text-foreground truncate">{contact.name}</h3>
                  <span className="text-xs text-[hsl(var(--wa-text-muted))] shrink-0 ml-2">{contact.lastMessageTime}</span>
                </div>
                <div className="flex items-center">
                  <p className="text-[13px] text-[hsl(var(--wa-text-muted))] truncate w-full">
                    {contact.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
