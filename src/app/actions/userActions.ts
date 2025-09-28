'use server'
import { UserModel, User } from '@/models/User';
import dbConnect from '@/lib/dbConnect';

// Types
type WorkOSUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  // Add other properties as needed
};

type CreateUserResult = {
  success: boolean;
  message: string;
  user?: User;
};



// Helper Functions
export async function isProfileComplete(): Promise<boolean> {
  // Authentication removed - always return false
  return false;
}



// Main Functions
export async function createUser(formData: FormData): Promise<CreateUserResult> {
  try {
    await dbConnect();
    // Authentication removed - simplified user creation
    const name = formData.get('name');
    const isJobPosterString = formData.get('isJobPoster');
    const email = formData.get('email');
    
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('Invalid name');
    }
    if (typeof isJobPosterString !== 'string') {
      throw new Error('Invalid value for isJobPoster');
    }
    if (typeof email !== 'string' || !email.includes('@')) {
      throw new Error('Invalid email');
    }
    
    const isJobPoster = isJobPosterString === 'true';
    
    // Create new user without WorkOS ID
    const user = await UserModel.create({
      name,
      isJobPoster,
      isProfileComplete: true,
      email
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
  try {
    await dbConnect();
    // Authentication removed - return null (no user)
    return null;
  } catch (error) {
    console.error('Error fetching custom user:', error);
    return null;
  }
}
