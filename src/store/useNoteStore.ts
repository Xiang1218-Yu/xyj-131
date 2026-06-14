import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note, NoteState } from '@/types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: [],
      addNote: (banknoteId: string, noteData) => {
        const now = new Date().toISOString();
        const newNote: Note = {
          id: generateId(),
          banknoteId,
          title: noteData.title,
          content: noteData.content,
          tags: noteData.tags,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ notes: [...state.notes, newNote] }));
        return newNote;
      },
      updateNote: (noteId: string, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? { ...note, ...updates, updatedAt: new Date().toISOString() }
              : note
          ),
        }));
      },
      deleteNote: (noteId: string) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== noteId),
        }));
      },
      getNotesByBanknoteId: (banknoteId: string) => {
        return get().notes.filter((note) => note.banknoteId === banknoteId);
      },
      getAllNotes: () => {
        return get().notes;
      },
    }),
    {
      name: 'banknote-notes',
    }
  )
);
