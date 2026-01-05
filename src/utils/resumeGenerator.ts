import { LeetCodeStats } from "@/hooks/useLeetCodeStats";

export interface ResumeOptions {
  format: "FAANG" | "Startup" | "Service";
  includeSkills: boolean;
  includeContests: boolean;
  includeBadges: boolean;
}

export function generateResumeText(stats: LeetCodeStats, options: ResumeOptions): string {
  const easy = stats.submitStats.acSubmissionNum.find(s => s.difficulty === "Easy")?.count || 0;
  const medium = stats.submitStats.acSubmissionNum.find(s => s.difficulty === "Medium")?.count || 0;
  const hard = stats.submitStats.acSubmissionNum.find(s => s.difficulty === "Hard")?.count || 0;
  const total = easy + medium + hard;

  // Enhanced scoring algorithm
  const problemScore = Math.min(100, (easy * 1 + medium * 2 + hard * 4) / 20);
  const allSkills = [
    ...stats.skillStats.advanced,
    ...stats.skillStats.intermediate,
    ...stats.skillStats.fundamental,
  ];
  const topicScore = Math.min(100, (allSkills.length * 5));
  const dsaStrength = Math.round((problemScore + topicScore) / 2);
  
  const streakScore = Math.min(100, stats.streak * 3);
  const contestBonus = stats.contestAttended > 0 ? Math.min(20, stats.contestAttended * 2) : 0;
  const consistency = Math.round(streakScore + contestBonus);
  
  const difficultyBalance = (hard * 4 + medium * 2 + easy * 1) / (total || 1);
  const contestPerformance = stats.contestRating > 0 ? Math.min(30, stats.contestRating / 30) : 0;
  const totalProblemsScore = Math.min(30, total / 20);
  const interviewReadiness = Math.round(
    (dsaStrength * 0.4 + consistency * 0.3 + difficultyBalance * 0.2 + contestPerformance + totalProblemsScore)
  );

  let resumeText = "";

  // Header
  resumeText += `PROFESSIONAL CODING PROFILE\n`;
  resumeText += `==========================\n\n`;
  resumeText += `Username: ${stats.username}\n`;
  if (stats.profile.realName) {
    resumeText += `Name: ${stats.profile.realName}\n`;
  }
  resumeText += `Global Ranking: #${stats.profile.ranking?.toLocaleString() || "N/A"}\n\n`;

  // Professional Summary - Enhanced with specific bullet points
  resumeText += `PROFESSIONAL SUMMARY\n`;
  resumeText += `-------------------\n`;
  
  // Generate professional bullet points based on performance
  const bulletPoints = [];
  
  if (total >= 500) {
    bulletPoints.push(`• Solved ${total}+ DSA problems with exceptional mastery of Data Structures & Algorithms`);
  } else if (total >= 300) {
    bulletPoints.push(`• Solved ${total}+ DSA problems with strong proficiency in problem-solving`);
  } else if (total >= 100) {
    bulletPoints.push(`• Solved ${total}+ DSA problems demonstrating solid algorithmic thinking`);
  } else {
    bulletPoints.push(`• Solved ${total}+ DSA problems building foundational programming skills`);
  }

  // Add skill-specific bullet points
  const topSkills = allSkills.sort((a, b) => b.problemsSolved - a.problemsSolved).slice(0, 3);
  if (topSkills.length >= 2) {
    const skillNames = topSkills.map(s => s.tagName).slice(0, 2).join(" and ");
    bulletPoints.push(`• Specialized expertise in ${skillNames} with advanced problem-solving techniques`);
  }

  // Add consistency bullet point
  if (stats.streak >= 100) {
    bulletPoints.push(`• Maintained exceptional consistency with ${stats.streak}-day problem-solving streak`);
  } else if (stats.streak >= 30) {
    bulletPoints.push(`• Demonstrated strong consistency with ${stats.streak}-day continuous practice`);
  } else if (stats.streak >= 7) {
    bulletPoints.push(`• Showed consistent dedication with ${stats.streak}-day practice streak`);
  }

  // Add contest performance
  if (stats.contestRating >= 2000) {
    bulletPoints.push(`• Achieved elite contest rating of ${Math.round(stats.contestRating)} placing in top performers globally`);
  } else if (stats.contestRating >= 1500) {
    bulletPoints.push(`• Competitive programming rating of ${Math.round(stats.contestRating)} with strong contest performance`);
  } else if (stats.contestRating > 0) {
    bulletPoints.push(`• Active competitive programmer with ${Math.round(stats.contestRating)} rating`);
  }

  // Add difficulty balance
  if (hard >= 50) {
    bulletPoints.push(`• Advanced problem-solving capability with ${hard}+ complex algorithmic challenges solved`);
  } else if (hard >= 20) {
    bulletPoints.push(`• Strong analytical skills demonstrated through ${hard}+ advanced problem solutions`);
  }

  bulletPoints.forEach(bullet => resumeText += `${bullet}\n`);
  resumeText += `\n`;

  // Technical Skills Section
  resumeText += `TECHNICAL SKILLS\n`;
  resumeText += `---------------\n`;
  resumeText += `DSA Strength: ${dsaStrength}/100\n`;
  resumeText += `Consistency Score: ${consistency}/100\n`;
  resumeText += `Interview Readiness: ${interviewReadiness}/100\n\n`;

  // Problem Solving Breakdown
  resumeText += `PROBLEM SOLVING BREAKDOWN\n`;
  resumeText += `------------------------\n`;
  resumeText += `Total Problems Solved: ${total}\n`;
  resumeText += `  • Easy: ${easy} | Medium: ${medium} | Hard: ${hard}\n`;
  resumeText += `  • Success Rate: ${Math.round((total / (total + 100)) * 100)}% (estimated)\n\n`;

  // Top Skills
  if (options.includeSkills) {
    resumeText += `SPECIALIZED SKILLS\n`;
    resumeText += `-----------------\n`;
    const topSkillsList = allSkills.sort((a, b) => b.problemsSolved - a.problemsSolved).slice(0, 8);
    topSkillsList.forEach((skill, index) => {
      const level = skill.problemsSolved >= 20 ? "Advanced" : skill.problemsSolved >= 10 ? "Intermediate" : "Fundamental";
      resumeText += `• ${skill.tagName} - ${level} (${skill.problemsSolved} problems)\n`;
    });
    resumeText += `\n`;
  }

  // Contest Performance
  if (options.includeContests && stats.contestRating > 0) {
    resumeText += `COMPETITIVE PROGRAMMING\n`;
    resumeText += `----------------------\n`;
    resumeText += `Rating: ${Math.round(stats.contestRating)} | Global Rank: #${stats.contestRanking?.toLocaleString() || "N/A"}\n`;
    resumeText += `Contests: ${stats.contestAttended} | Best Rank: ${Math.round(stats.contestRating / 50)}th percentile\n\n`;
  }

  // Interview Readiness Assessment
  resumeText += `INTERVIEW READINESS ASSESSMENT\n`;
  resumeText += `-------------------------------\n`;
  resumeText += `Overall Score: ${interviewReadiness}/100\n`;
  
  if (interviewReadiness >= 80) {
    resumeText += `Status: FAANG READY - Elite candidate for top-tier product companies\n`;
    resumeText += `Recommendation: Apply to Google, Meta, Amazon, Netflix, Apple, Microsoft\n`;
  } else if (interviewReadiness >= 60) {
    resumeText += `Status: PRODUCT COMPANY READY - Strong candidate for established tech companies\n`;
    resumeText += `Recommendation: Target mid-tier to large product companies\n`;
  } else if (interviewReadiness >= 40) {
    resumeText += `Status: STARTUP READY - Good fit for fast-paced environments\n`;
    resumeText += `Recommendation: Focus on startups and growth-stage companies\n`;
  } else {
    resumeText += `Status: BUILDING FOUNDATION - Continue practicing and improving consistency\n`;
    resumeText += `Recommendation: Focus on medium/hard problems and daily practice\n`;
  }
  resumeText += `\n`;

  // Company-specific guidance
  if (options.format === "FAANG") {
    resumeText += `FAANG APPLICATION STRATEGY\n`;
    resumeText += `-------------------------\n`;
    resumeText += `• System Design: Study distributed systems, scalability patterns\n`;
    resumeText += `• Behavioral: Prepare STAR method responses for leadership principles\n`;
    resumeText += `• Coding Focus: Master trees, graphs, DP, and optimization techniques\n`;
    resumeText += `• Target Companies: Google, Meta, Amazon, Apple, Netflix, Microsoft\n\n`;
  } else if (options.format === "Startup") {
    resumeText += `STARTUP APPLICATION STRATEGY\n`;
    resumeText += `---------------------------\n`;
    resumeText += `• Speed: Emphasize quick problem-solving and adaptability\n`;
    resumeText += `• Impact: Highlight end-to-end project experience\n`;
    resumeText += `• Culture: Demonstrate learning ability and team collaboration\n`;
    resumeText += `• Target: Series A-C startups, unicorns, tech-first companies\n\n`;
  } else {
    resumeText += `SERVICE COMPANY STRATEGY\n`;
    resumeText += `-----------------------\n`;
    resumeText += `• Fundamentals: Strong DSA basics and reliability\n`;
    resumeText += `• Process: Focus on methodical problem-solving approach\n`;
    resumeText += `• Learning: Emphasize continuous improvement mindset\n`;
    resumeText += `• Target: Accenture, TCS, Infosys, Wipro, Capgemini\n\n`;
  }

  // Achievements
  if (options.includeBadges && stats.badges.length > 0) {
    resumeText += `ACHIEVEMENTS\n`;
    resumeText += `------------\n`;
    stats.badges.slice(0, 8).forEach(badge => {
      resumeText += `• ${badge.name}\n`;
    });
    resumeText += `\n`;
  }

  resumeText += `\nGenerated by CodeProfile.ai\n`;
  resumeText += `Last Updated: ${new Date().toLocaleDateString()}\n`;
  resumeText += `Profile URL: https://codeprofile.ai/u/${stats.username}\n`;

  return resumeText;
}

// Export as downloadable text file
export function downloadResumeText(stats: LeetCodeStats, options: ResumeOptions, filename?: string) {
  const text = generateResumeText(stats, options);
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `leetcode-profile-${stats.username}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

