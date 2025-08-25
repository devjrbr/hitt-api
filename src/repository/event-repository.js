import { AppDataSource } from '../database/data-source.js';
import { EventDatabase } from '../database/entity/index.js';
import { errorCodes } from '../utils/error-codes.js';

const eventRepository = AppDataSource.getRepository('Event');

const createEvent = async (eventData) => {
    try {
        const event = eventRepository.create(eventData);
        return await eventRepository.save(event);
    } catch (error) {
        if (error.code === '23505' || (error.driverError && error.driverError.code === '23505')) {
            const detail = error.detail || (error.driverError && error.driverError.detail);
            if (detail && detail.includes('code')) {
                throw errorCodes.EVENT_CODE_ALREADY_EXISTS;
            }
        }
        throw error;
    }
};

const fetchAllEvents = async () => {
    return await eventRepository.find({
        where: { is_active: true },
        order: { event_date: 'ASC' }
    });
};

const findEventById = async (id) => {
    return await eventRepository.findOne({
        where: { id, is_active: true }
    });
};

const findEventByCode = async (code) => {
    return await eventRepository.findOne({
        where: { code, is_active: true }
    });
};

const updateEvent = async (id, eventData) => {
    try {
        const result = await eventRepository.update(id, eventData);
        if (result.affected === 0) {
            return null;
        }
        return await findEventById(id);
    } catch (error) {
        if (error.code === '23505') {
            if (error.detail && error.detail.includes('key (code)')) {
                throw errorCodes.EVENT_CODE_ALREADY_EXISTS;
            }
        }
        throw error;
    }
};

const deleteEvent = async (id) => {
    const result = await eventRepository.update(id, { is_active: false });
    return result.affected > 0;
};

export {
    createEvent,
    fetchAllEvents,
    findEventById,
    findEventByCode,
    updateEvent,
    deleteEvent
};
