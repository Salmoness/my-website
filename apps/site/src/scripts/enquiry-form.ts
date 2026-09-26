const enquiryForms = document.querySelectorAll<HTMLFormElement>('[data-enquiry-form]');

enquiryForms.forEach((form) => {
  const interest = form.querySelector<HTMLSelectElement>('[data-service-interest]');
  const contentNeeds = form.querySelector<HTMLElement>('[data-content-needs]');
  const status = form.querySelector<HTMLElement>('[data-form-status]');

  const syncContentNeeds = (): void => {
    if (!interest || !contentNeeds) return;
    const relevant = interest.value === 'Social Content' || interest.value === 'Ongoing Visibility';
    contentNeeds.hidden = !relevant;
    const input = contentNeeds.querySelector<HTMLInputElement>('input');
    if (input) input.disabled = !relevant;
  };

  interest?.addEventListener('change', syncContentNeeds);

  /** Pre-select the service a visitor came for: `?interest=` from another page, or a
   *  `data-interest` link on this page. Unknown values are ignored. */
  const chooseInterest = (value: string | null | undefined): void => {
    if (!interest || !value) return;
    if (!Array.from(interest.options).some((option) => option.value === value)) return;
    interest.value = value;
    interest.dispatchEvent(new Event('change', { bubbles: true }));
  };

  chooseInterest(new URLSearchParams(window.location.search).get('interest'));
  document.querySelectorAll<HTMLAnchorElement>('a[data-interest]').forEach((link) => {
    link.addEventListener('click', () => chooseInterest(link.dataset.interest));
  });
  syncContentNeeds();

  form.addEventListener('submit', async (event) => {
    const endpoint = form.dataset.endpoint;
    const email = form.dataset.email;
    if (!status) return;

    if (!endpoint) {
      event.preventDefault();
      const data = new FormData(form);
      const subject = `Azul project enquiry — ${String(data.get('business') ?? 'New project')}`;
      const fields = [
        ['Name', data.get('name')],
        ['Email', data.get('email')],
        ['Business', data.get('business')],
        ['Current presence', data.get('current_presence')],
        ['Stage', data.get('business_stage')],
        ['Service', data.get('service_interest')],
        ['Goal', data.get('primary_goal')],
        ['Timeline', data.get('timeline')],
        ['Budget', data.get('budget')],
        ['Content needs', data.get('content_needs')],
        ['Guide', data.get('guide_summary')],
        ['Message', data.get('message')],
      ];
      const body = fields
        .filter(([, value]) => String(value ?? '').trim())
        .map(([label, value]) => `${label}: ${String(value)}`)
        .join('\n\n');

      status.textContent = 'Your email app is opening with these details. Nothing has been erased.';
      status.dataset.state = 'success';
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    event.preventDefault();
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    submit?.setAttribute('disabled', 'true');
    status.textContent = 'Sending your project context…';
    status.dataset.state = 'loading';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('The form provider did not accept the request.');
      form.reset();
      syncContentNeeds();
      status.textContent = 'Thanks—your context is in. I’ll respond within two business days.';
      status.dataset.state = 'success';
    } catch {
      status.innerHTML = `The form could not send. Your entries are still here—please try again or email <a href="mailto:${email}">${email}</a>.`;
      status.dataset.state = 'error';
    } finally {
      submit?.removeAttribute('disabled');
    }
  });
});
