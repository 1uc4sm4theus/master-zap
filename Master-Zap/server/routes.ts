import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.contacts.list.path, async (req, res) => {
    const contacts = await storage.getContacts();
    res.json(contacts);
  });

  app.get(api.contacts.get.path, async (req, res) => {
    const contact = await storage.getContact(Number(req.params.id));
    if (!contact) {
      return res.status(404).json({ message: "Contato não encontrado" });
    }
    res.json(contact);
  });

  app.get(api.messages.list.path, async (req, res) => {
    const messages = await storage.getMessages(Number(req.params.contactId));
    res.json(messages);
  });

  app.get(api.citations.list.path, async (req, res) => {
    const citations = await storage.getCitations();
    res.json(citations);
  });

  return httpServer;
}
