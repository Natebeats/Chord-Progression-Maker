import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Music theory types
export const chordProgressions = pgTable("chord_progressions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  key: text("key").notNull(), // e.g., "C", "Am"
  chords: json("chords").notNull(), // Array of chord objects
  tempo: integer("tempo").default(120),
  timeSignature: text("time_signature").default("4/4"),
  style: text("style").default("pop"), // pop, jazz, blues, lofi
});

export const insertChordProgressionSchema = createInsertSchema(chordProgressions).omit({
  id: true,
});

export type InsertChordProgression = z.infer<typeof insertChordProgressionSchema>;
export type ChordProgression = typeof chordProgressions.$inferSelect;

// Frontend-only types for music theory
export interface Note {
  name: string;
  octave: number;
  frequency: number;
}

export interface Chord {
  symbol: string;
  root: string;
  quality: 'major' | 'minor' | 'diminished' | 'augmented';
  extension?: '7' | 'maj7' | 'm7' | 'dim7' | 'hdim7';
  inversion: 0 | 1 | 2 | 3;
  notes: Note[];
  romanNumeral: string;
}

export interface Scale {
  key: string;
  mode: 'major' | 'minor';
  notes: string[];
  chords: Chord[];
}

export type RhythmPattern = 'block' | 'arpeggio' | 'waltz' | 'strum';
export type ProgressionStyle = 'random' | 'pop' | 'jazz' | 'blues' | 'lofi';

// Keep existing user types for potential future auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
