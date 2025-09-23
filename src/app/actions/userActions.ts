'use server'
import { UserModel, User } from '@/models/User';
import dbConnect from '@/lib/dbConnect';

// Types
type CreateUserResult = {
  success: boolean;
  message: string;
  user?: User;
};

// Helper Functions - Authentication removed, these functions are no longer needed
export async function isProfileComplete(): Promise<boolean> {
  // No authentication - always return true or handle differently based on your needs
  return true;
}

// Main Functions - Simplified without authentication
export async function createUser(formData: FormData): Promise<CreateUserResult> {
  try {
    await dbConnect();
    
    const name = formData.get('name');
    const email = formData.get('email');
    const isJobPosterString = formData.get('isJobPoster');
    
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('Invalid name');
    }
    if (typeof email !== 'string' || email.length === 0) {
      throw new Error('Invalid email');
    }
    if (typeof isJobPosterString !== 'string') {
      throw new Error('Invalid value for isJobPoster');
    }
    
    const isJobPoster = isJobPosterString === 'true';
    
    // Create new user without authentication
    const user = await UserModel.create({
      name,
      email,
      isJobPoster,
      isProfileComplete: true
    });
    
    if (!user) {
      throw new Error('Failed to create user');
    }
    
    const plainUser = user.toObject();
    console.log('User created:', plainUser);
    return { success: true, message: `User ${name} created successfully!`, user: plainUser };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Failed to create user.' };
  }
}

export async function getCustomUser(): Promise<User | null> {
  // No authentication - return null or handle differently based on your needs
  return null;
}
