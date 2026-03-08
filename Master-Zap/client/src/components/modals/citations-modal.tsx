import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCitations } from "@/hooks/use-citations";
import { Loader2, Quote, BookOpen, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CitationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CitationsModal({ open, onOpenChange }: CitationsModalProps) {
  const { data: citations, isLoading } = useCitations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b bg-white shrink-0">
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <Quote className="h-6 w-6" />
            Citações Relevantes
          </DialogTitle>
          <DialogDescription>
            Documentação de menções e contextos baseados em dados públicos.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 bg-slate-50/50 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : citations?.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              Nenhuma citação encontrada.
            </div>
          ) : (
            <div className="grid gap-4">
              {citations?.map((citation: any) => (
                <div 
                  key={citation.id} 
                  className="bg-white p-5 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      {citation.name}
                    </h3>
                  </div>
                  
                  <div className="pl-6 border-l-2 border-primary/30 mb-4 py-1">
                    <p className="text-base text-foreground/90 italic">
                      "{citation.context}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-muted/50 w-fit px-2.5 py-1 rounded-md">
                    <BookOpen className="h-3 w-3" />
                    <span>Fonte: {citation.source}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
