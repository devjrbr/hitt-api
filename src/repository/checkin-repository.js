import { AppDataSource } from '../database/data-source.js';
import { CheckinDatabase } from '../database/entity/index.js';
import { errorCodes } from '../utils/error-codes.js';

const checkinRepository = AppDataSource.getRepository('Checkin');

const createCheckin = async (userId, eventId) => {
    try {
        const checkin = checkinRepository.create({
            user_id: userId,
            event_id: eventId
        });
        return await checkinRepository.save(checkin);
    } catch (error) {
        if (error.code === '23505') {
            if (error.constraint === 'IDX_USER_EVENT_UNIQUE') {
                throw errorCodes.USER_ALREADY_CHECKED_IN;
            }
        }
        throw error;
    }
};

const findCheckinByUserAndEvent = async (userId, eventId) => {
    return await checkinRepository.findOne({
        where: { user_id: userId, event_id: eventId },
        relations: ['user', 'event']
    });
};



const getEventCheckins = async (eventId) => {
    return await checkinRepository.find({
        where: { event_id: eventId },
        relations: ['user'],
        order: { checkin_at: 'DESC' }
    });
};

const getUserCheckins = async (userId) => {
    return await checkinRepository.find({
        where: { user_id: userId },
        relations: ['event'],
        order: { checkin_at: 'DESC' }
    });
};

const getCheckinStats = async (eventId) => {
    const total = await checkinRepository.count({
        where: { event_id: eventId }
    });

    return {
        total_checkins: total
    };
};

export {
    createCheckin,
    findCheckinByUserAndEvent,
    getEventCheckins,
    getUserCheckins,
    getCheckinStats
};
