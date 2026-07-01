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
    description: "Custom chatbots and conversational AI for your business.",
    href: "/search?service=chatbot-agent-development",
    icon: Bot,
  },
  {
    name: "Microsoft Copilot",
    description: "Copilot rollout, integration, and workplace AI adoption.",
    href: "/search?q=Microsoft+Copilot",
    icon: Sparkles,
  },
  {
    name: "AI Automation",
    description: "Automate workflows and integrate AI into existing systems.",
    href: "/search?service=ai-integration",
    icon: Workflow,
  },
  {
    name: "AI Training",
    description: "Workshops and upskilling for teams adopting AI.",
    href: "/search?service=ai-training-workshops",
    icon: GraduationCap,
  },
  {
    name: "Machine Learning",
    description: "ML engineers for models, data, and production systems.",
    href: "/search?skill=machine-learning",
    icon: Brain,
  },
  {
    name: "AI Strategy",
    description: "Consulting on AI roadmaps, ROI, and implementation plans.",
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
      "Hire experienced AI consultants and freelancers across the UK for remote or on-site work.",
    icon: Users,
    iconBg: "border-primary/20 bg-primary/5",
    iconColor: "text-primary",
  },
  {
    title: "Direct Contact",
    description:
      "Speak directly with AI experts without recruiters or unnecessary intermediaries.",
    icon: MessageSquare,
    iconBg: "border-accent/30 bg-accent-muted",
    iconColor: "text-accent",
  },
  {
    title: "No Platform Commission",
    description:
      "We don't take a percentage of your project. Agree pricing directly with the expert.",
    icon: Percent,
    iconBg: "border-primary/20 bg-surface-container",
    iconColor: "text-primary-light",
  },
  {
    title: "Compare Before You Hire",
    description:
      "Review profiles, skills and experience before deciding who to work with.",
    icon: Scale,
    iconBg: "border-accent/30 bg-accent-muted",
    iconColor: "text-accent",
  },
  {
    title: "AI Specialists",
    description:
      "Experts in LLMs, AI Agents, RAG, Computer Vision, MLOps, NLP and more.",
    icon: Brain,
    iconBg: "border-primary/20 bg-primary/5",
    iconColor: "text-primary",
  },
  {
    title: "Fast Hiring",
    description:
      "Find, compare and contact AI professionals within minutes.",
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
