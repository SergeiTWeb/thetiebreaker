import React from 'react';

export interface StarterTemplate {
  icon: string;
  title: string;
  dilemma: string;
  options: string[];
  context: string;
}

const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    icon: '💼',
    title: 'Career Choice',
    dilemma: 'Should I pursue a new role or focus on growing in my current role?',
    options: ['Explore a new role', 'Grow in my current role'],
    context: 'Consider learning opportunities, day-to-day work, team fit, and personal goals.',
  },
  {
    icon: '🚀',
    title: 'Product Strategy',
    dilemma: 'Should our team launch a focused product version now or run a limited pilot first?',
    options: ['Launch the focused version', 'Run a limited pilot'],
    context: 'Weigh customer feedback, readiness, team capacity, and what we need to learn.',
  },
  {
    icon: '🎨',
    title: 'Creative Decision',
    dilemma: 'Should I develop my story as a short film or as a serialized podcast?',
    options: ['Create a short film', 'Create a serialized podcast'],
    context: 'Consider the story format, creative process, available collaborators, and audience.',
  },
];

const IDEA_TEMPLATES: StarterTemplate[] = [
  {
    icon: '💡',
    title: 'Give Me an Idea',
    dilemma: 'Should I learn a new language or take up a musical instrument this season?',
    options: ['Learn a new language', 'Learn a musical instrument'],
    context: 'A low-stakes personal project. Consider your curiosity, available time, and what sounds fun.',
  },
  {
    icon: '💡',
    title: 'Give Me an Idea',
    dilemma: 'Should our community group host a creative workshop or a small showcase event?',
    options: ['Host a creative workshop', 'Host a small showcase'],
    context: 'A low-stakes community project. Consider participation, preparation, and the experience you want to create.',
  },
  {
    icon: '💡',
    title: 'Give Me an Idea',
    dilemma: 'Should I turn my sketches into a short comic or build a small online portfolio?',
    options: ['Make a short comic', 'Build a small portfolio'],
    context: 'A low-stakes creative project. Consider what you want to practice and what you would enjoy finishing.',
  },
  {
    icon: '💡',
    title: 'Give Me an Idea',
    dilemma: 'Should our club start a monthly newsletter or a short podcast?',
    options: ['Start a monthly newsletter', 'Start a short podcast'],
    context: 'A low-stakes club project. Consider your members, the format, and the time you can comfortably spend.',
  },
];

interface StarterCardsProps {
  onSelect: (template: StarterTemplate) => void;
}

export const StarterCards: React.FC<StarterCardsProps> = ({ onSelect }) => {
  const handleIdeaClick = () => {
    const index = Math.floor(Math.random() * IDEA_TEMPLATES.length);
    onSelect(IDEA_TEMPLATES[index]);
  };

  return (
    <section className="mt-8 w-full max-w-3xl">
      <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
        Or start with a template:
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {STARTER_TEMPLATES.map((template) => (
          <button
            key={template.title}
            type="button"
            onClick={() => onSelect(template)}
            aria-label={`Start a ${template.title} decision`}
            className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
          >
            <span className="text-2xl" aria-hidden="true">{template.icon}</span>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {template.title}
            </span>
          </button>
        ))}
        <button
          type="button"
          onClick={handleIdeaClick}
          aria-label="Generate a random decision idea"
          className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
        >
          <span className="text-2xl" aria-hidden="true">💡</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
            Give Me an Idea
          </span>
        </button>
      </div>
    </section>
  );
};
