import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Brain,
  GraduationCap,
  Layers,
  MessageSquare,
  Percent,
  Scale,
  Sparkles,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

export type HomeCategory = {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

/** Static homepage categories — link to filtered expert search. */
export const HOME_CATEGORIES: HomeCategory[] = [
  {
    name: "AI Chatbots",
    description: "Custom chatbots and conversational AI expertise.",
    href: "/search?service=chatbot-agent-development",
    icon: Bot,
  },
  {
    name: "Microsoft Copilot",
    description: "Copilot rollout, integration and workplace AI adoption expertise.",
    href: "/search?q=Microsoft+Copilot",
    icon: Sparkles,
  },
  {
    name: "AI Automation",
    description: "Workflow automation and AI integration expertise.",
    href: "/search?service=ai-integration",
    icon: Workflow,
  },
  {
    name: "AI Training",
    description: "Workshops and upskilling expertise for teams adopting AI.",
    href: "/search?service=ai-training-workshops",
    icon: GraduationCap,
  },
  {
    name: "Machine Learning",
    description: "Machine learning expertise for models, data and production systems.",
    href: "/search?skill=machine-learning",
    icon: Brain,
  },
  {
    name: "AI Strategy",
    description: "AI strategy, roadmaps, ROI and implementation planning expertise.",
    href: "/search?service=ai-strategy-consulting",
    icon: Layers,
  },
];

export type HomeBenefit = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

export const HOME_BENEFITS: HomeBenefit[] = [
  {
    title: "UK AI Professionals",
    description:
      "Find independent AI consultants, specialists and companies across the UK for remote or on-site work.",
    icon: Users,
    iconBg: "border-primary/20 bg-primary/5",
    iconColor: "text-primary",
  },
  {
    title: "Direct introductions",
    description:
      "We introduce you to AI professionals and companies. You agree how to work together — no recruiters in between.",
    icon: MessageSquare,
    iconBg: "border-accent/30 bg-accent-muted",
    iconColor: "text-accent",
  },
  {
    title: "No commission on the relationship",
    description:
      "We don't take a cut of what you agree. Pricing and terms stay between you and the expert.",
    icon: Percent,
    iconBg: "border-primary/20 bg-surface-container",
    iconColor: "text-primary-light",
  },
  {
    title: "Compare before you connect",
    description:
      "Review profiles, skills and experience before deciding who to speak with.",
    icon: Scale,
    iconBg: "border-accent/30 bg-accent-muted",
    iconColor: "text-accent",
  },
  {
    title: "AI Specialists",
    description:
      "Professionals and companies in LLMs, AI Agents, RAG, Computer Vision, MLOps, NLP and more.",
    icon: Brain,
    iconBg: "border-primary/20 bg-primary/5",
    iconColor: "text-primary",
  },
  {
    title: "Find expertise quickly",
    description:
      "Search, compare and contact AI professionals and companies directly.",
    icon: Zap,
    iconBg: "border-accent/30 bg-accent-muted",
    iconColor: "text-accent",
  },
];

/** Minimum counts before showing live platform statistics (future use). */
export const HOME_STATS_THRESHOLDS = {
  experts: 25,
  requirements: 10,
  jobs: 50,
} as const;
