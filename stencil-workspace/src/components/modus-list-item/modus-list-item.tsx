// eslint-disable-next-line
import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { IconCheck } from '../icons/icon-check';

@Component({
  tag: 'modus-list-item',
  styleUrl: 'modus-list-item.scss',
  shadow: true,
})
export class ModusListItem {
  /** (optional) Whether the list item has a border or not */
  @Prop() borderless: boolean;

  /** (optional) Disables the list item */
  @Prop() disabled: boolean;

  /** (optional) The selected state of the list item */
  @Prop() selected: boolean;

  /** (optional) The size of list item */
  @Prop() size: 'condensed' | 'large' | 'standard' = 'standard';

  /** (optional) The type of list item */
  @Prop() type = 'standard'; // Future support for 'checkbox' | 'icon' | 'menu' | 'standard' | 'switchLeft' | 'switchRight'

  /** An event that fires on list item click */
  @Event() itemClick: EventEmitter;

  classBySize: Map<string, string> = new Map([
    ['condensed', 'small'],
    ['standard', 'standard'],
    ['large', 'large'],
  ]);

  render(): unknown {
    const containerClass = `${this.classBySize.get(this.size)} ${this.disabled ? 'disabled' : ''} ${
      this.selected ? 'selected' : ''
    } ${this.borderless ? 'borderless' : ''}`;
    const iconCheckSize = this.size === 'condensed' ? '16' : '24';

    return (
      <li class={containerClass} onClick={() => (!this.disabled ? this.itemClick.emit() : null)}>
        <span class="slot">
          <slot />
        </span>
        {this.selected && <IconCheck size={iconCheckSize} />}
      </li>
    );
  }
}
