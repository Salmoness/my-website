/**
 * Framework-neutral UI visual contracts, component prop types, and validation constants.
 * Does not require a browser runtime and can be safely consumed by Astro, React, and server modules.
 */

export const ACTION_VARIANTS = ['primary', 'secondary', 'quiet'] as const;
export type ActionVariant = (typeof ACTION_VARIANTS)[number];

export const STATUS_STATES = ['verified', 'in-development', 'research', 'placeholder'] as const;
export type StatusState = (typeof STATUS_STATES)[number];

export const SHELL_WIDTHS = ['standard', 'reading', 'evidence'] as const;
export type ShellWidth = (typeof SHELL_WIDTHS)[number];

export const MEDIA_ASPECT_RATIOS = ['16/9', '4/3', '1/1', 'auto'] as const;
export type MediaAspectRatio = (typeof MEDIA_ASPECT_RATIOS)[number];

export const AUDIENCE_TYPES = ['employer', 'client', 'both'] as const;
export type AudienceType = (typeof AUDIENCE_TYPES)[number];

export interface BaseComponentProps {
  class?: string;
  id?: string;
}

export interface ActionContractProps extends BaseComponentProps {
  href?: string;
  variant?: ActionVariant;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  target?: string;
  rel?: string;
}

export interface StatusLabelContractProps extends BaseComponentProps {
  status: StatusState;
  label?: string;
}

export interface MediaFrameContractProps extends BaseComponentProps {
  src?: string;
  alt: string;
  aspectRatio?: MediaAspectRatio;
  caption?: string;
  isDecorative?: boolean;
  placeholderLabel?: string;
}

export interface DisclosureContractProps extends BaseComponentProps {
  id: string;
  heading: string;
  summary?: string;
  initiallyOpen?: boolean;
}

export interface SectionContractProps extends BaseComponentProps {
  width?: ShellWidth;
  title?: string;
  tag?: string;
}
