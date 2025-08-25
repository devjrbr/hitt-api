import { EntitySchema } from 'typeorm';

const EventDatabase = new EntitySchema({
    name: 'Event',
    tableName: 'events',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        name: {
            type: 'varchar',
            length: 100,
            nullable: false,
        },
        description: {
            type: 'text',
            nullable: true,
        },
        code: {
            type: 'varchar',
            length: 10,
            nullable: false,
            unique: true,
        },
        event_date: {
            type: 'timestamp',
            nullable: false,
        },

        max_participants: {
            type: 'int',
            nullable: true,
        },
        is_active: {
            type: 'boolean',
            default: true,
        },
        created_at: {
            type: 'timestamp',
            createDate: true,
        },
        updated_at: {
            type: 'timestamp',
            updateDate: true,
        },
    },
});

export default EventDatabase;
