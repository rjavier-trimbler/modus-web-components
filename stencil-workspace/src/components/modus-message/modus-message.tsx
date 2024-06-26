// eslint-disable-next-line
import { Component, Prop, h } from '@stencil/core';
import { IconInfo } from '../../icons/generated-icons/IconInfo';
import { IconHelp } from '../../icons/generated-icons/IconHelp';
import { ModusIconMap } from '../../icons/ModusIconMap';

@Component({
  tag: 'modus-message',
  styleUrl: 'modus-message.scss',
  shadow: true,
})
export class ModusMessage {
  /** (optional) The message's aria-label. */
  @Prop() ariaLabel: string | null;

  /** (optional) The message's icon. */
  @Prop() icon?: string;

  /** (optional) The message's type. */
  @Prop() type?: 'info' | 'question' = 'info';

  classByType: Map<string, string> = new Map([
    ['info', 'info'],
    ['question', 'question'],
  ]);

  render(): unknown {
    const className = `modus-message ${this.classByType.get(this.type)}`;

    return (
      <div aria-label={this.ariaLabel || undefined} class={className} role="note">
        <span class="icon">
          {this.icon ? (
            <ModusIconMap icon={this.icon} size="18" />
          ) : this.type === 'info' ? (
            <IconInfo size="18" />
          ) : this.type === 'question' ? (
            <IconHelp size="18" />
          ) : null}
        </span>
        <span class="message">
          <slot />
        </span>
      </div>
    );
  }
}
