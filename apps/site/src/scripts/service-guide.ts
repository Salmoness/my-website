type GuideKey = 'stage' | 'presence' | 'goal';

interface GuideRecommendation {
  title: string;
  label: string;
  copy: string;
  service: string;
}

const guides = document.querySelectorAll<HTMLElement>('[data-service-guide]');

const recommendations = {
  foundation: {
    title: 'Online Foundation',
    label: 'Suggested starting point',
    copy: 'Build the dependable home first, then connect the profiles and contact path around it.',
    service: 'Online Foundation',
  },
  website: {
    title: 'A focused website',
    label: 'Suggested targeted improvement',
    copy: 'Create one clear place where people can understand the offer, trust the business, and make contact.',
    service: 'Web development',
  },
  google: {
    title: 'Google Business Profile support',
    label: 'Suggested targeted improvement',
    copy: 'Strengthen the local profile people check before they call or visit. Add Google Ads later if you want to be seen sooner.',
    service: 'Google Business Profile',
  },
  content: {
    title: 'Content + Meta ads',
    label: 'Suggested visibility move',
    copy: 'Turn your work into short videos and posts, then put a small ad budget behind the best ones to reach nearby customers.',
    service: 'Social Content',
  },
  systems: {
    title: 'CRM + follow-ups',
    label: 'Suggested systems move',
    copy: 'Put every enquiry in one place and reply fast by text, WhatsApp, or email, so the interest you already get turns into customers.',
    service: 'CRM & automations',
  },
  visibility: {
    title: 'Ongoing Visibility',
    label: 'Suggested next phase',
    copy: 'Use the existing foundation as a destination, then build a sustainable profile and content cadence.',
    service: 'Ongoing Visibility',
  },
} satisfies Record<string, GuideRecommendation>;

const chooseRecommendation = (answers: Record<GuideKey, string>): GuideRecommendation => {
  if (answers.stage === 'starting' || answers.presence === 'none')
    return recommendations.foundation;
  if (answers.goal === 'convert') return recommendations.systems;
  if (answers.goal === 'discovered') return recommendations.google;
  if (answers.goal === 'promote') return recommendations.content;
  if (answers.goal === 'active' || answers.stage === 'growing') return recommendations.visibility;
  return recommendations.website;
};

guides.forEach((guide) => {
  const result = guide.querySelector<HTMLElement>('[data-guide-result]');
  const label = guide.querySelector<HTMLElement>('[data-guide-label]');
  const title = guide.querySelector<HTMLElement>('[data-guide-title]');
  const copy = guide.querySelector<HTMLElement>('[data-guide-copy]');
  const apply = guide.querySelector<HTMLAnchorElement>('[data-guide-apply]');
  const form = guide.querySelector<HTMLFormElement>('.service-guide__form');

  if (!result || !label || !title || !copy || !apply || !form) return;

  let recommendation: GuideRecommendation | undefined;

  const readAnswers = (): Record<GuideKey, string> => ({
    stage: form.querySelector<HTMLInputElement>('input[name="guide-stage"]:checked')?.value ?? '',
    presence:
      form.querySelector<HTMLInputElement>('input[name="guide-presence"]:checked')?.value ?? '',
    goal: form.querySelector<HTMLInputElement>('input[name="guide-goal"]:checked')?.value ?? '',
  });

  const update = (): void => {
    const answers = readAnswers();
    const answered = Object.values(answers).filter(Boolean).length;
    result.dataset.answered = String(answered);

    if (answered < 3) {
      recommendation = undefined;
      label.textContent = `${answered} of 3 choices made`;
      title.textContent = answered
        ? 'Keep going—each answer changes the direction.'
        : 'Your starting point will appear here.';
      copy.textContent =
        'You can still browse every service above, or contact me directly without using this guide.';
      apply.classList.add('is-disabled');
      apply.setAttribute('aria-disabled', 'true');
      return;
    }

    recommendation = chooseRecommendation(answers);
    label.textContent = recommendation.label;
    title.textContent = recommendation.title;
    copy.textContent = recommendation.copy;
    apply.classList.remove('is-disabled');
    apply.removeAttribute('aria-disabled');
  };

  form.addEventListener('change', update);
  apply.addEventListener('click', (event) => {
    if (!recommendation) {
      event.preventDefault();
      form.querySelector<HTMLInputElement>('input:not(:checked)')?.focus();
      return;
    }

    event.preventDefault();

    const answers = readAnswers();
    const enquiryForm = document.querySelector<HTMLFormElement>('[data-enquiry-form]');
    const summary = enquiryForm?.querySelector<HTMLInputElement>('[data-guide-summary]');
    const stage = enquiryForm?.querySelector<HTMLSelectElement>('[data-enquiry-stage]');
    const goal = enquiryForm?.querySelector<HTMLSelectElement>('[data-enquiry-goal]');
    const service = enquiryForm?.querySelector<HTMLSelectElement>('[data-service-interest]');

    if (summary) {
      summary.value = `Guide: stage=${answers.stage}; presence=${answers.presence}; goal=${answers.goal}; suggestion=${recommendation.title}`;
    }
    if (stage) {
      stage.value = answers.stage;
      stage.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (service) {
      service.value = recommendation.service;
      service.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (goal) {
      const goals: Record<string, string> = {
        credible: 'Look credible',
        discovered: 'Get discovered',
        promote: 'Promote services',
        active: 'Stay active',
        convert: 'Answer every enquiry',
      };
      goal.value = goals[answers.goal] ?? '';
      goal.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const contact = document.querySelector<HTMLElement>('#contact');
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
    contact?.scrollIntoView({ behavior, block: 'start' });
    window.history.replaceState(null, '', '#contact');
  });
});
