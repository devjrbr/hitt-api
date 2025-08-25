import { AppDataSource } from '../database/data-source.js';
import { UserDatabase } from '../database/entity/index.js';
import { generateUserJWT } from '../utils/jwt.js';

export async function fetchAllUsers() {
  const userRepository = AppDataSource.getRepository(UserDatabase);
  return await userRepository.find({
    where: {
      role: 'USER'
    }
  });
}

export async function createUser(userData) {
  const userRepository = AppDataSource.getRepository(UserDatabase);
  
  try {
    const user = userRepository.create(userData);
    const savedUser = await userRepository.save(user);
    
    const token = generateUserJWT(savedUser);
    
    await userRepository.update(savedUser.id, { token });
    
    return { ...savedUser, token };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
      const errorMessage = error.message?.toLowerCase() || '';
      const errorDetail = error.detail?.toLowerCase() || '';
      
      if (errorDetail.includes('key (email)') || errorMessage.includes('email')) {
        const duplicateError = new Error('Email already exists');
        duplicateError.code = 'EMAIL_DUPLICATE';
        throw duplicateError;
      }
      if (errorDetail.includes('key (cpf)') || errorMessage.includes('cpf')) {
        const duplicateError = new Error('CPF already exists');
        duplicateError.code = 'CPF_DUPLICATE';
        throw duplicateError;
      }
      
      const duplicateError = new Error('Duplicate entry detected');
      duplicateError.code = 'DUPLICATE_ENTRY';
      throw duplicateError;
    }
    throw error;
  }
}

export async function findUserById(id) {
  const userRepository = AppDataSource.getRepository(UserDatabase);
  return await userRepository.findOne({ where: { id } });
}

export async function updateUser(id, userData) {
  const userRepository = AppDataSource.getRepository(UserDatabase);
  
  try {
    await userRepository.update(id, userData);
    return await userRepository.findOne({ where: { id } });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
      const errorMessage = error.message?.toLowerCase() || '';
      const errorDetail = error.detail?.toLowerCase() || '';
      
      if (errorDetail.includes('key (email)') || errorMessage.includes('email')) {
        const duplicateError = new Error('Email already exists');
        duplicateError.code = 'EMAIL_DUPLICATE';
        throw duplicateError;
      }
      if (errorDetail.includes('key (cpf)') || errorMessage.includes('cpf')) {
        const duplicateError = new Error('CPF already exists');
        duplicateError.code = 'CPF_DUPLICATE';
        throw duplicateError;
      }
      
      const duplicateError = new Error('Duplicate entry detected');
      duplicateError.code = 'DUPLICATE_ENTRY';
      throw duplicateError;
    }
    throw error;
  }
}

export async function deleteUser(id) {
  const userRepository = AppDataSource.getRepository(UserDatabase);
  const result = await userRepository.delete(id);
  return result.affected > 0;
}

export async function findUserByEmail(email) {
  const userRepository = AppDataSource.getRepository(UserDatabase);
  return await userRepository.findOne({ where: { email } });
}

export async function updateUserLoginCode(id, code) {
  const userRepository = AppDataSource.getRepository(UserDatabase);
  
  if (code === null) {
    await userRepository.update(id, { 
      login_code: null,
      login_code_expires_at: null
    });
    return await userRepository.findOne({ where: { id } });
  }
  
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await userRepository.update(id, { 
    login_code: code,
    login_code_expires_at: expiresAt
  });
  
  return await userRepository.findOne({ where: { id } });
}
