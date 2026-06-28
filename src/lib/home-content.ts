import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Brain,
  GraduationCap,
  Layers,
  Sparkles,
  Workflow,
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
};

export const HOME_BENEFITS: HomeBenefit[] = [
  {
    title: "UK-focused AI experts",
    description:
      "Consultants and specialists based across the United Kingdom, with remote options.",
  },
  {
    title: "Direct contact",
    description:
      "Reach experts directly through their profile — no middlemen in the conversation.",
  },
  {
    title: "No marketplace commissions",
    description:
      "We don't take a cut of your project. You agree terms directly with the expert.",
  },
  {
    title: "You choose who to work with",
    description:
      "Browse profiles, compare skills, and decide who is the right fit for your needs.",
  },
  {
    title: "Specialists across AI disciplines",
    description:
      "From LLMs and chatbots to MLOps, strategy, and computer vision.",
  },
];

/** Minimum counts before showing live platform statistics (future use). */
export const HOME_STATS_THRESHOLDS = {
  experts: 25,
  requirements: 10,
  jobs: 50,
} as const;
