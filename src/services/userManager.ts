import { UserProfile } from '../types';

const PREF_AUTH = 'foss_user_auth';
const KEY_PROFILE = 'foss_active_profile';

export const userManager = {
  getCurrentUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(KEY_PROFILE) || localStorage.getItem(PREF_AUTH);
      if (!raw) return null;
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  },

  saveUser(profile: UserProfile): void {
    try {
      const serialized = JSON.stringify(profile);
      localStorage.setItem(KEY_PROFILE, serialized);
      localStorage.setItem(PREF_AUTH, serialized);
    } catch (err) {
      console.error('Failed to save user profile:', err);
    }
  },

  updateUser(updates: Partial<UserProfile>): UserProfile | null {
    const current = this.getCurrentUser();
    if (!current) return null;
    const updated = { ...current, ...updates };
    this.saveUser(updated);
    return updated;
  },

  signOut(): void {
    try {
      localStorage.removeItem(KEY_PROFILE);
      localStorage.removeItem(PREF_AUTH);
    } catch (err) {
      console.error('Failed to sign out user:', err);
    }
  },
};
