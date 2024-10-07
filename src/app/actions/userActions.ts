'use server'

import { UserModel, User } from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { getUser } from "@workos-inc/authkit-nextjs";

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
  try {
    await dbConnect();
    const workosUserId = await getWorkosId();
    
    // Find user based on the workosId in the database
    const user = await UserModel.findOne({ workosId: workosUserId });
    
    // Return whether or not the profile is isProfileComplete
    return user ? user.isProfileComplete : false;
  } catch (error) {
    console.error('Error checking profile completion:', error);
    // In case of any error, we assume the profile is not complete
    return false;
  }
}

export async function getWorkosId(): Promise<string> {
  const workosUser = await getUser();
  if (!workosUser) {
    throw new Error('WorkOS user not found');
  }
  return workosUser.user.id;
}

// Main Functions
export async function createUser(formData: FormData): Promise<CreateUserResult> {
  try {
    await dbConnect();

    // Check if profile is already complete
    if (await isProfileComplete()) {
      console.log('Cannot create user twice, profile is already complete');
      return {
        success: false,
        message: 'User profile is already complete. Cannot create or update.',
      };
    }

    const workosUser = await getUser();
    console.log('here is the workosUserId: ', workosUser.user.id);
    
    const name = formData.get('name');
    const isJobPosterString = formData.get('isJobPoster');

    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('Invalid name');
    }
    if (typeof isJobPosterString !== 'string') {
      throw new Error('Invalid value for isJobPoster');
    }

    const isJobPoster = isJobPosterString === 'true';

    let user = await UserModel.findOne({ workosId: workosUser.user.id });
    if (user) {
      // Update existing user
      user = await UserModel.findOneAndUpdate(
        { workosId: workosUser.user.id },
        {
          name,
          isJobPoster,
          isProfileComplete: true,
          email: workosUser.user.email
        },
        { new: true }
      );
    } else {
      // Create new user
      user = await UserModel.create({
        workosId: workosUser.user.id,
        name,
        isJobPoster,
        isProfileComplete: true,
        email: workosUser.user.email
      });
    }

  if (!user) {
      throw new Error('Failed to create or update user');
    }
    
    const plainUser = user.toObject();
    console.log('User created/updated:', plainUser);
    return { success: true, message: `User ${name} created/updated successfully!`, user: plainUser };
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Failed to create/update user.' };
  }
}


export async function getCustomUser(): Promise<User | null> {
  try {
    await dbConnect();
    const workosUser = await getUser();
    if (!workosUser) {
      return null;
    }
    const user = await UserModel.findOne({ workosId: workosUser.id });
    return user ? user.toObject() : null;
  } catch (error) {
    console.error('Error fetching custom user:', error);
    return null;
  }
}
