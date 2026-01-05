import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "*";
const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

interface LeetCodeStats {
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

const userProfileQuery = `
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      realName
      ranking
      reputation
      starRating
      userAvatar
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
    problemsSolvedBeatsStats {
      difficulty
      percentage
    }
    badges {
      id
      name
      icon
    }
  }
}
`;

const userContestQuery = `
query userContestRankingInfo($username: String!) {
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
query userProfileCalendar($username: String!) {
  matchedUser(username: $username) {
    userCalendar {
      streak
    }
  }
}
`;

async function fetchGraphQL(query: string, variables: Record<string, string>) {
  // Simple retry with exponential backoff
  const maxRetries = 3;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(LEETCODE_GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new Error(`LeetCode API error: ${response.status}`);
      }

      return response.json();
    } catch (err) {
      attempt++;
      if (attempt > maxRetries) throw err;
      const backoff = 200 * Math.pow(2, attempt);
      await new Promise((res) => setTimeout(res, backoff));
    }
  }

  throw new Error('Failed to fetch from LeetCode');
}

// Simple in-memory cache and rate limiter (note: ephemeral in serverless environments)
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes
// deno-lint-ignore no-explicit-any
if (!(globalThis as any).__LEETCODE_CACHE) (globalThis as any).__LEETCODE_CACHE = new Map<string, { expiry: number; data: any }>();
// deno-lint-ignore no-explicit-any
if (!(globalThis as any).__LEETCODE_RATE) (globalThis as any).__LEETCODE_RATE = new Map<string, { tokens: number; last: number }>();

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Basic rate limiting per IP (token bucket)
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip') || 'unknown';
    // deno-lint-ignore no-explicit-any
    const rateMap = (globalThis as any).__LEETCODE_RATE as Map<string, { tokens: number; last: number }>; 
    const now = Date.now();
    const bucket = rateMap.get(ip) || { tokens: 5, last: now };
    // refill tokens (5 tokens per minute)
    const refill = Math.floor((now - bucket.last) / 60000) * 5;
    bucket.tokens = Math.min(10, bucket.tokens + refill);
    bucket.last = now;
    if (bucket.tokens <= 0) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    bucket.tokens -= 1;
    rateMap.set(ip, bucket);
  } catch (e) {
    // if rate limiting fails for any reason, continue (fail-open)
    console.error('Rate limiter error', e);
  }

    try {
    const { username } = await req.json();

    if (!username) {
      return new Response(
        JSON.stringify({ error: 'Username is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check cache first
    const cacheKey = `leetcode:${username}`;
    // deno-lint-ignore no-explicit-any
    const cacheMap = (globalThis as any).__LEETCODE_CACHE as Map<string, { expiry: number; data: any }>;
    const cached = cacheMap.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      console.log(`Cache hit for: ${username}`);
      return new Response(JSON.stringify(cached.data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    console.log(`Fetching LeetCode stats for user: ${username}`);

    // Fetch all data in parallel
    const [profileData, contestData, skillData, streakData] = await Promise.all([
      fetchGraphQL(userProfileQuery, { username }),
      fetchGraphQL(userContestQuery, { username }),
      fetchGraphQL(skillStatsQuery, { username }),
      fetchGraphQL(streakQuery, { username }),
    ]);

    if (!profileData.data?.matchedUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const user = profileData.data.matchedUser;
    const contest = contestData.data?.userContestRanking;
    const skills = skillData.data?.matchedUser?.tagProblemCounts;
    const streak = streakData.data?.matchedUser?.userCalendar?.streak || 0;

    const stats: LeetCodeStats = {
      username: user.username,
      profile: user.profile,
      submitStats: user.submitStats,
      problemsSolvedBeatsStats: user.problemsSolvedBeatsStats || [],
      streak,
      badges: user.badges || [],
      contestRating: contest?.rating || 0,
      contestRanking: contest?.globalRanking || 0,
      contestAttended: contest?.attendedContestsCount || 0,
      skillStats: skills || { advanced: [], intermediate: [], fundamental: [] },
    };

    // Cache the response
    try {
      cacheMap.set(cacheKey, { expiry: Date.now() + CACHE_TTL_MS, data: stats });
    } catch (e) {
      console.warn('Failed to cache result', e);
    }

    console.log(`Successfully fetched stats for: ${username}`);

    return new Response(
      JSON.stringify(stats),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Failed to fetch LeetCode stats', details: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
