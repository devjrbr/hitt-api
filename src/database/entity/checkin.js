import { EntitySchema } from 'typeorm';

const CheckinDatabase = new EntitySchema({
    name: 'Checkin',
    tableName: 'checkins',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        user_id: {
            type: 'int',
            nullable: false,
        },
        event_id: {
            type: 'int',
            nullable: false,
        },
        checkin_at: {
            type: 'timestamp',
            createDate: true,
        },
    },
    relations: {
        user: {
            target: 'User',
            type: 'many-to-one',
            joinColumn: { name: 'user_id' },
        },
        event: {
            target: 'Event',
            type: 'many-to-one',
            joinColumn: { name: 'event_id' },
        },
    },
    indices: [
        {
            name: 'IDX_USER_EVENT_UNIQUE',
            unique: true,
            columns: ['user_id', 'event_id'],
        },
    ],
});

export default CheckinDatabase;
