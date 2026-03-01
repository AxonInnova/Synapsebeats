import { supabase } from './supabaseClient';

export async function signInWithDiscord() {
  // this kicks to Discord OAuth and bounces back to your app
  return supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: `${window.location.origin}`
    }
  });
}

export async function signInWithEmail(email) {
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}`
    }
  });
}

export async function signOut() {
  // ▫️ call this from profile/logout button in ui
  return supabase.auth.signOut();
}

export async function getUser() {
  return supabase.auth.getUser();
}
