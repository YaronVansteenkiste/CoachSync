import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

const ranks = pgTable('ranks', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    level: integer('level').notNull(),
    requiredXp: integer('required_xp').notNull()
});

const challenges = pgTable('challenges', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    xp: integer('xp').notNull(),
    rankId: integer('rank_id').references(() => ranks.id).notNull(),
    exercises: text('exercises').array()
});

export { ranks, challenges };