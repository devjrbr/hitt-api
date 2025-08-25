import { fetchAllUsers, createUser, findUserById, updateUser, deleteUser } from '../repository/index.js';

export async function getAllUsers() {
    const users = await fetchAllUsers();
    return users;
}

export async function createNewUser(userData) {
    const user = await createUser(userData);
    return {
        id: user.id,
        type: user.type,
        registration_code: user.registration_code,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        cpf: user.cpf,
        birth_date: user.birth_date,
        gender: user.gender,
        how_did_you_know: user.how_did_you_know,
        newsletter: user.newsletter,
        token: user.token,
        created_at: user.created_at
    };
}

export async function getUserById(id) {
    const user = await findUserById(id);
    if (!user) {
        return null;
    }
    return user;
}

export async function updateUserById(id, userData) {
    const user = await updateUser(id, userData);
    return user;
}

export async function deleteUserById(id) {
    return await deleteUser(id);
}
