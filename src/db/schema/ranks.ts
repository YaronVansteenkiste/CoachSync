import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

const ranks = pgTable('ranks', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    level: integer('level').notNull(),
    requiredXp: integer('required_xp').notNull(),
    image: text("image").notNull().default("/images/ranks/beginner-iron.png"),
});

export { ranks };