'use client';

import { useEffect, useState, useMemo } from 'react';

import { useMainStore } from '@/stores';

interface SectionProps {
  cityId: string;
}

export const NotesSection = ({ cityId }: SectionProps) => {
  const { deleteNote, saveNote, notes } = useMainStore();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');

  const existingNote = useMemo(() => {
    return notes.find((item) => item.cityId === cityId);
  }, [cityId, notes]);

  useEffect(() => {
    if (existingNote !== undefined) {
      setContent(existingNote.content);
    }
  }, [existingNote]);

  const handleSaveData = () => {
    if (content.trim() !== '') {
      saveNote({ lastEdited: new Date().toISOString(), content, cityId });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setIsEditing(false);
      deleteNote(cityId);
      setContent('');
    }
  };

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-rich-lavender/30 bg-dark-purple/60 p-4 backdrop-blur-sm">
      <section className="flex items-center justify-between">
        <h3 className="font-trap text-lg text-white">Notes</h3>
        {existingNote !== undefined && !isEditing && (
          <article className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md bg-ocean-blue/50 px-3 py-1 text-sm text-white transition-colors hover:bg-ocean-blue/70"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="rounded-md bg-red-500/50 px-3 py-1 text-sm text-white transition-colors hover:bg-red-500/70"
            >
              Delete
            </button>
          </article>
        )}
        {isEditing && (
          <article className="flex gap-2">
            <button
              onClick={handleSaveData}
              className="rounded-md bg-green-500/50 px-3 py-1 text-sm text-white transition-colors hover:bg-green-500/70"
            >
              Save
            </button>
            <button
              className="rounded-md bg-red-500/50 px-3 py-1 text-sm text-white transition-colors hover:bg-red-500/70"
              onClick={() => {
                setIsEditing(false);
                if (existingNote) {
                  setContent(existingNote.content);
                } else {
                  setContent('');
                }
              }}
            >
              Cancel
            </button>
          </article>
        )}
        {!existingNote && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md bg-ocean-blue/50 px-3 py-1 text-sm text-white transition-colors hover:bg-ocean-blue/70"
          >
            Add Note
          </button>
        )}
      </section>
      {isEditing ? (
        <textarea
          style={{ scrollbarWidth: 'none' }}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your notes here..."
          className="min-h-[144px] w-full resize-y rounded-md border border-rich-lavender/30 bg-vampire-black/60 p-4 text-white placeholder:text-rich-lavender/50 focus:outline-none focus:ring-2 focus:ring-rich-lavender/50"
          value={content}
        />
      ) : existingNote !== undefined ? (
        <article className="flex flex-col gap-2">
          <p className="whitespace-pre-wrap text-white">
            {existingNote.content}
          </p>
          <p className="text-right text-xs text-rich-lavender/60">
            <span>Last edited on</span>&nbsp;
            {new Date(existingNote.lastEdited).toLocaleString('en-US', {
              minute: '2-digit',
              weekday: 'long',
              hour: '2-digit',
              day: 'numeric',
              month: 'long'
            })}
          </p>
        </article>
      ) : (
        <p className="italic text-rich-lavender/60">
          No notes yet. Click on the &quot;Add Note&quot; button to create one.
        </p>
      )}
    </section>
  );
};
