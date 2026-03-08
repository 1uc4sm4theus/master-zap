import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import { useContacts } from "@/hooks/use-contacts";
import { Loader2 } from "lucide-react";

interface GraphModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GraphModal({ open, onOpenChange }: GraphModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const { data: contacts, isLoading } = useContacts();

  useEffect(() => {
    if (!open || !containerRef.current || !contacts) return;

    // Build Graph Data
    const nodes = new DataSet([
      { id: 0, label: "Daniel Vorcaro", shape: "circularImage", image: "https://api.dicebear.com/7.x/bottts/svg?seed=vorcaro", size: 40, font: { bold: true } },
      ...contacts.map((c: any) => ({
        id: c.id,
        label: c.name,
        shape: "circularImage",
        image: c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}`,
        size: 25,
      }))
    ]);

    const edges = new DataSet([
      { from: 0, to: 1, label: "Principal Interlocutora", font: { size: 10 }, color: "#075E54" },
      { from: 0, to: 2, label: "Encontros/Prisão", font: { size: 10 }, color: "#075E54" },
      { from: 0, to: 22, label: "Café/Apoio", font: { size: 10 }, color: "#075E54" },
      { from: 0, to: 9, label: "Aeroporto/Jantar", font: { size: 10 }, color: "#075E54" },
      { from: 0, to: 11, label: "Grande Amigo/Emenda", font: { size: 10 }, color: "#075E54" },
      { from: 0, to: 8, label: "Reunião Casa Oficial", font: { size: 10 }, color: "#075E54" },
      ...contacts.filter(c => ![1, 2, 22, 9, 11, 8].includes(c.id)).map((c: any) => ({
        from: 0,
        to: c.id,
        label: "Citado/Agenda",
        font: { align: "middle", size: 8, color: "#999" },
        color: { color: "#ddd" },
        length: 250,
      }))
    ]);

    const data = { nodes, edges };
    const options = {
      nodes: {
        borderWidth: 2,
        color: {
          border: "#fff",
          background: "#fff",
          highlight: { border: "#075E54", background: "#fff" }
        },
        font: { color: "#333", size: 14 }
      },
      edges: {
        width: 1.5,
        smooth: { type: "continuous" }
      },
      physics: {
        barnesHut: { gravitationalConstant: -4000, springLength: 150, springConstant: 0.04 },
        stabilization: { iterations: 150 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200
      }
    };

    networkRef.current = new Network(containerRef.current, data, options);

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [open, contacts]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[1000px] h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0 bg-white">
          <DialogTitle className="text-2xl font-bold text-primary">Grafo de Conexões</DialogTitle>
          <DialogDescription>
            Visualização de rede das conexões e citações públicas relacionadas ao caso.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 bg-gray-50 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          )}
          
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-md border text-xs text-muted-foreground pointer-events-none">
            <p className="font-semibold text-foreground mb-1">Legenda:</p>
            <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-primary block" /> Nó Central</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-300 block border border-gray-400" /> Contatos Citados</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
