import { WorkerEntrypoint } from 'cloudflare:workers';
import { ProxyToSelf } from 'workers-mcp';

// Board member personas
const BOARD_MEMBERS = {
  "tim-cook": {
    name: "Tim Cook",
    role: "Chief Executive Officer",
    expertise: ["Operational Excellence", "Supply Chain Management", "Sustainable Innovation", "Privacy Leadership"],
    philosophy: "Focus on operational excellence, user privacy, environmental responsibility, and long-term value creation.",
    approach: "Questions first, then systematic problem-solving"
  },
  "warren-buffett": {
    name: "Warren Buffett",
    role: "Investment Philosophy Advisor", 
    expertise: ["Value Investing", "Business Analysis", "Long-term Strategy", "Risk Assessment"],
    philosophy: "Invest in businesses you understand, with strong moats, run by good people, at reasonable prices.",
    approach: "Teaching through stories and examples"
  },
  "maya-angelou": {
    name: "Maya Angelou",
    role: "Leadership Wisdom & Human Connection Advisor",
    expertise: ["Authentic Leadership", "Communication Excellence", "Resilience Building", "Human Dignity"],
    philosophy: "Lead with courage, authenticity, and deep respect for human dignity.",
    approach: "Deep listening first, then guidance"
  },
  "jamie-dimon": {
    name: "Jamie Dimon", 
    role: "Financial Strategy & Risk Management Advisor",
    expertise: ["Banking Excellence", "Risk Management", "Crisis Leadership", "Regulatory Navigation"],
    philosophy: "Disciplined risk management, strong capital position, and long-term relationship building.",
    approach: "Challenge assumptions, demand details"
  },
  "charlie-munger": {
    name: "Charlie Munger",
    role: "Mental Models & Critical Thinking Advisor", 
    expertise: ["Multidisciplinary Thinking", "Cognitive Bias Recognition", "Decision Science", "Contrarian Analysis"],
    philosophy: "Use mental models from multiple disciplines to avoid cognitive biases and make better decisions.",
    approach: "Devil's advocate who challenges everything"
  },
  "art-gensler": {
    name: "Art Gensler",
    role: "Design Strategy & Client Experience Advisor",
    expertise: ["Design Excellence", "Client Relationship Building", "Brand Environment Creation", "Human-Centered Design"],
    philosophy: "Design should serve people and create meaningful experiences that enhance human potential.",
    approach: "Understand the user experience first"
  }
};

export default class AdvisoryBoardMCP extends WorkerEntrypoint {
  
  /**
   * Get individual advice from a specific board member.
   * @param member The name of the board member (e.g., "tim-cook", "warren-buffett")
   * @param situation Description of the business situation
   * @param specific_question Optional specific question to ask
   * @return Detailed advisory prompt for the AI to respond as that board member
   */
  async getAdvisorInput(member: string, situation: string, specific_question?: string): Promise<string> {
    const advisor = BOARD_MEMBERS[member.toLowerCase().replace(/[\s-]/g, '-')];
    
    if (!advisor) {
      return `Board member "${member}" not found. Available advisors: ${Object.keys(BOARD_MEMBERS).join(', ')}`;
    }

    return `PERSONA: ${advisor.name} - ${advisor.role}

EXPERTISE: ${advisor.expertise.join(', ')}
PHILOSOPHY: ${advisor.philosophy}
APPROACH: ${advisor.approach}

SITUATION: ${situation}
${specific_question ? `SPECIFIC QUESTION: ${specific_question}` : ''}

Respond as ${advisor.name} would, providing specific, actionable advice based on your expertise and decision-making approach. Stay completely in character with your communication style.`;
  }

  /**
   * Convene a full board meeting on a topic.
   * @param topic The main topic for discussion
   * @param context Background context for the meeting
   * @param urgency The urgency level (low, medium, high)
   * @return Meeting facilitation prompt
   */
  async conveneBoardMeeting(topic: string, context: string, urgency: string = 'medium'): Promise<string> {
    return `VIRTUAL BOARD MEETING - ${topic.toUpperCase()}

CONTEXT: ${context}
URGENCY: ${urgency}

Board Members Present:
${Object.entries(BOARD_MEMBERS).map(([key, advisor]) => 
  `• ${advisor.name} (${advisor.role}) - ${advisor.expertise.slice(0, 2).join(', ')}`
).join('\n')}

MEETING STRUCTURE:
1. SITUATION ANALYSIS
2. INDIVIDUAL PERSPECTIVES from each board member
3. RISK & OPPORTUNITY ASSESSMENT
4. ACTIONABLE RECOMMENDATIONS
5. NEXT STEPS

Each advisor should provide their unique perspective, ask clarifying questions, and give specific advice based on their expertise. Format as a structured board meeting with clear sections for each advisor's input.`;
  }

  /**
   * Get advice for crisis management situations.
   * @param crisis_description What crisis is happening
   * @param immediate_concerns Most pressing concerns
   * @return Crisis management advisory prompt
   */
  async crisisManagement(crisis_description: string, immediate_concerns: string): Promise<string> {
    return `EMERGENCY BOARD MEETING - CRISIS RESPONSE

CRISIS: ${crisis_description}
IMMEDIATE CONCERNS: ${immediate_concerns}

Your board is convening an emergency session. Each advisor should provide:
1. Immediate actions (next 24 hours)
2. Week 1 priorities 
3. Key messages for stakeholders
4. Long-term strategic adjustments

Focus on practical, executable recommendations for both immediate stabilization and long-term recovery.`;
  }

  async fetch(request: Request): Promise<Response> {
    return new ProxyToSelf(this).fetch(request);
  }
}
