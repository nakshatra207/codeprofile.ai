/**
 * Supabase error handling utility
 * Converts Supabase errors into user-friendly messages
 */

export interface SupabaseErrorInfo {
  message: string;
  code?: string;
  suggestion?: string;
}

export function parseSupabaseError(error: unknown): SupabaseErrorInfo {
  // Handle string errors
  if (typeof error === 'string') {
    return { message: error };
  }

  // Handle error objects
  if (error && typeof error === 'object') {
    const errorObj = error as Record<string, unknown>;
    // Check for common Supabase error codes
    const message = (errorObj.message ?? errorObj.msg ?? String(error)) as string;
    const code = (errorObj.code ?? errorObj.error_code) as string | undefined;

    if (code === 'PGRST205') {
      return {
        message: 'Database table not found. Please contact support.',
        code,
        suggestion: 'The database schema may not be initialized. Run the database setup script.'
      };
    }

    if (code === 'PGRST116') {
      return {
        message: 'Record not found.',
        code
      };
    }

    if (code === 'PGRST301') {
      return {
        message: 'You do not have permission to access this resource.',
        code,
        suggestion: 'Ensure you are logged in with the correct account.'
      };
    }

    if (message.includes('Invalid API key')) {
      return {
        message: 'Invalid API credentials. Please check your Supabase configuration.',
        code,
        suggestion: 'Verify VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env file.'
      };
    }

    if (message.includes('Network error') || message.includes('fetch')) {
      return {
        message: 'Network connection error. Please check your internet and try again.',
        code,
        suggestion: 'Ensure Supabase is accessible from your location.'
      };
    }

    if (message.includes('Invalid credentials') || message.includes('Invalid login')) {
      return {
        message: 'Invalid email or password. Please check and try again.',
        code
      };
    }

    if (message.includes('User already exists')) {
      return {
        message: 'An account with this email already exists. Please log in instead.',
        code
      };
    }

    if (message.includes('Email not confirmed')) {
      return {
        message: 'Please confirm your email before logging in. Check your inbox.',
        code
      };
    }

    return {
      message: message || 'An error occurred. Please try again.',
      code
    };
  }

  return {
    message: 'An unexpected error occurred. Please try again.'
  };
}

export function getErrorSuggestion(code?: string): string {
  const suggestions: Record<string, string> = {
    'PGRST205': 'Run: npm run setup-db',
    'PGRST301': 'Log in again or check permissions',
    'PGRST116': 'The requested item was not found',
  };
  
  return suggestions[code || ''] || 'Try refreshing the page or logging out and back in.';
}
