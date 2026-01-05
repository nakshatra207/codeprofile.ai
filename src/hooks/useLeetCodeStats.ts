import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const LEETCODE_API = 'https://leetcode.com/graphql';

export interface LeetCodeStats {
  username: string;
  profile: {
    realName: string;
    ranking: number;
    reputation: number;
    starRating: number;
    userAvatar: string;
  };
  submitStats: {
    acSubmissionNum: {
      difficulty: string;
      count: number;
      submissions: number;
    }[];
    totalSubmissionNum: {
      difficulty: string;
      count: number;
      submissions: number;
    }[];
  };
  problemsSolvedBeatsStats: {
    difficulty: string;
    percentage: number;
  }[];
  streak: number;
  badges: {
    id: string;
    name: string;
    icon: string;
  }[];
  contestRating: number;
  contestRanking: number;
  contestAttended: number;
  skillStats: {
    advanced: { tagName: string; problemsSolved: number }[];
    intermediate: { tagName: string; problemsSolved: number }[];
    fundamental: { tagName: string; problemsSolved: number }[];
  };
}

// GraphQL queries for LeetCode API
const userProfileQuery = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        userAvatar
        reputation
        ranking
      }
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      badges {
        id
        name
        icon
      }
      problemsSolvedBeatsStats {
        difficulty
        percentage
      }
    }
  }
`;

const contestQuery = `
  query userContestRanking($username: String!) {
    userContestRanking(username: $username) {
      rating
      globalRanking
      attendedContestsCount
    }
  }
`;

const skillStatsQuery = `
  query skillStats($username: String!) {
    matchedUser(username: $username) {
      tagProblemCounts {
        advanced {
          tagName
          problemsSolved
        }
        intermediate {
          tagName
          problemsSolved
        }
        fundamental {
          tagName
          problemsSolved
        }
      }
    }
  }
`;

const streakQuery = `
  query userCalendar($username: String!) {
    matchedUser(username: $username) {
      userCalendar {
        streak
      }
    }
  }
`;

// Direct GraphQL fetch function
async function fetchLeetCodeGraphQL(query: string, variables: Record<string, string>) {
  try {
    const response = await fetch(LEETCODE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'GraphQL error');
    }

    return data;
  } catch (err) {
    console.error('LeetCode API error:', err);
    throw err;
  }
}

export function useLeetCodeStats() {
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (username: string) => {
    setLoading(true);
    setError(null);

    try {
      // First, try to use Supabase Edge Function (if deployed)
      try {
        const { data, error: fnError } = await supabase.functions.invoke('leetcode-stats', {
          body: { username },
        });

        if (!fnError && !data?.error) {
          setStats(data);
          setLoading(false);
          return data;
        }
      } catch (edgeFunctionError) {
        console.warn('Edge Function failed, falling back to direct API:', edgeFunctionError);
        // Fall through to direct API call
      }

      // Fallback: Fetch directly from LeetCode API
      const [profileRes, contestRes, skillRes, streakRes] = await Promise.all([
        fetchLeetCodeGraphQL(userProfileQuery, { username }),
        fetchLeetCodeGraphQL(contestQuery, { username }),
        fetchLeetCodeGraphQL(skillStatsQuery, { username }),
        fetchLeetCodeGraphQL(streakQuery, { username }),
      ]);

      if (!profileRes.data?.matchedUser) {
        throw new Error(`LeetCode user "${username}" not found. Please check the username and try again.`);
      }

      const user = profileRes.data.matchedUser;
      const contest = contestRes.data?.userContestRanking;
      const skills = skillRes.data?.matchedUser?.tagProblemCounts;
      const streak = streakRes.data?.matchedUser?.userCalendar?.streak || 0;

      const statsData: LeetCodeStats = {
        username: user.username,
        profile: {
          realName: user.profile?.realName || user.username,
          userAvatar: user.profile?.userAvatar || '',
          ranking: user.profile?.ranking || 0,
          reputation: user.profile?.reputation || 0,
          starRating: 0,
        },
        submitStats: user.submitStats || {
          acSubmissionNum: [],
          totalSubmissionNum: [],
        },
        problemsSolvedBeatsStats: user.problemsSolvedBeatsStats || [],
        streak,
        badges: user.badges || [],
        contestRating: contest?.rating || 0,
        contestRanking: contest?.globalRanking || 0,
        contestAttended: contest?.attendedContestsCount || 0,
        skillStats: skills || {
          advanced: [],
          intermediate: [],
          fundamental: [],
        },
      };

      setStats(statsData);
      return statsData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch LeetCode stats';
      console.error('Error in fetchStats:', message, err);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, fetchStats };
}
