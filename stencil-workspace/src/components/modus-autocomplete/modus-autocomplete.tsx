/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line
import {
  h, // eslint-disable-line @typescript-eslint/no-unused-vars
  Component,
  EventEmitter,
  Event,
  Prop,
  State,
  Listen,
  Element,
  Watch,
} from '@stencil/core';
import { IconSearch } from '../icons/icon-search';

export interface ModusAutocompleteOption {
  id: string;
  value: string;
  isSelected?:boolean;
}

const DATA_ID = 'data-id';
const DATA_SEARCH_VALUE = 'data-search-value';

@Component({
  tag: 'modus-autocomplete',
  styleUrl: 'modus-autocomplete.scss',
  shadow: true,
})
export class ModusAutocomplete {
  @Element() el: HTMLElement;

  /** The autocomplete's aria label. */
  @Prop() ariaLabel: string | null;

  /** Whether the input has a clear button. */
  @Prop() clearable = false;

  /** Whether the input is disabled. */
  @Prop() disabled: boolean;

  /** Whether the autocomplete's options always display on select. */
  @Prop() disableCloseOnSelect: boolean;

  /** The autocomplete's dropdown's max height. */
  @Prop() dropdownMaxHeight = '300px';

  /** The autocomplete's dropdown z-index. */
  @Prop() dropdownZIndex = '1';

  /** The autocomplete's error text. */
  @Prop() errorText: string;

  /** Whether the search icon is included. */
  @Prop() includeSearchIcon = true;

  /** The autocomplete's label. */
  @Prop() label: string;

  /** The autocomplete's no results text. */
  @Prop() noResultsFoundText = 'No results found';

  /** The autocomplete's no results sub-text. */
  @Prop() noResultsFoundSubtext = 'Check spelling or try a different keyword';

  /** The autocomplete's options. */
  @Prop({ mutable: true }) options: ModusAutocompleteOption[] | string[];
  @Watch('options')
  watchOptions() {
    this.convertOptions();
    this.updateVisibleOptions(this.value);
  }

  /** The autocomplete's input placeholder. */
  @Prop() placeholder: string;

  /** Whether to show autocomplete's options when focus. */
  @Prop() showOptionsOnFocus: boolean;

  /** Whether the autocomplete is read-only. */
  @Prop() readOnly: boolean;

  /** Whether the autocomplete is required. */
  @Prop() required: boolean;

  /** Whether to show the no results found message. */
  @Prop() showNoResultsFoundMessage = true;

  /** The autocomplete's size. */
  @Prop() size: 'medium' | 'large' = 'medium';

  /** The autocomplete's search value. */
  @Prop() value: string;

  /** An event that fires when a dropdown option is selected. Emits the option id. */
  @Event() optionSelected: EventEmitter<string>;

  /** An event that fires when the input value changes. Emits the value string. */
  @Event() valueChange: EventEmitter<string>;

  @State() containsSlottedElements = false;
  @State() hasFocus = false;
  @State() visibleOptions: ModusAutocompleteOption[] = [];
  @State() customOptions: Array<any> = [];
  @State() visibleCustomOptions: Array<any> = [];

  componentWillLoad(): void {
    this.convertOptions();

    if (!this.value) {
      this.visibleOptions = this.options as ModusAutocompleteOption[];
    } else {
      this.updateVisibleOptions(this.value);
    }
  }

  componentDidLoad(): void {
    this.updateVisibleCustomOptions(this.value);
  }

  @Listen('click', { target: 'document' })
  outsideElementClickHandler(event: MouseEvent): void {
    if (this.el !== event.target || !this.el.contains(event.target as Node)) {
      this.hasFocus = false;
    }
  }

  classBySize: Map<string, string> = new Map([
    ['medium', 'medium'],
    ['large', 'large'],
  ]);

  convertOptions(): void {
    if (this.options && this.options.length > 0) {
      if (typeof this.options[0] === 'string') {
        this.options = this.options?.map((option) => ({
          id: option,
          value: option,
        }));
      }
    }
  }

  displayNoResults = () =>
    this.showNoResultsFoundMessage &&
    this.hasFocus &&
    !this.visibleOptions?.length &&
    !this.visibleCustomOptions?.length &&
    this.value?.length > 0;

  displayOptions = () => {
    const showOptions = this.showOptionsOnFocus || this.disableCloseOnSelect || this.value?.length > 0;
    return this.hasFocus && showOptions && !this.disabled;
  };

  handleCustomOptionClick = (option: any) => {
    const optionValue = option.getAttribute(DATA_SEARCH_VALUE);
    const optionId = option.getAttribute(DATA_ID);
    this.handleSearchChange(optionValue);
    this.hasFocus = false;
    this.optionSelected.emit(optionId);
    this.handleOptionSelection({
      id: optionId,
      value: optionValue,
    });
  };

  handleInputBlur = () => {
    if(!this.disableCloseOnSelect){
      return;
    }
    //this.showAllOptions();
    this.hasFocus = false;
  };

  handleOptionKeyPress = (event: any, option: any, isCustomOption = false) => {
    if (event.key !== 'Enter') {
      return;
    }
    if (isCustomOption) {
      this.handleCustomOptionClick(option);
    } else {
      this.handleOptionClick(option);
    }
  };

  handleOptionClick = (option: ModusAutocompleteOption) => {
    this.handleSearchChange(option.value);
    this.hasFocus = false;
    this.optionSelected.emit(option.id);
    this.handleOptionSelection(option);
  };

  handleSearchChange = (search: string) => {
    this.updateVisibleOptions(search);

    if(!this.disableCloseOnSelect){
      this.updateVisibleCustomOptions(search);
    }

    this.value = search;
    this.valueChange.emit(search);
  };

  handleOptionSelection = (option: ModusAutocompleteOption) => {
    console.log('visibleOptions==>',this.visibleOptions);
    if(this.disableCloseOnSelect){
      this.visibleOptions.find((el)=> el.id === option.id)['isSelected'] = true;
      this.clearable = true
      this.hasFocus = true;
    }
  }

  handleTextInputValueChange = (event: CustomEvent<string>) => {
    // Cancel the modus-text-input's value change event or else it will bubble to consumer.
    event.stopPropagation();
    this.handleSearchChange(event.detail);
  };

  updateVisibleCustomOptions = (search: string) => {
    const slotted = this.el.shadowRoot?.querySelector('slot') as HTMLSlotElement;
    if (!slotted || typeof slotted.assignedNodes !== 'function') {
      return;
    }

    this.customOptions = slotted.assignedNodes().filter((node) => node.nodeName !== '#text');

    if (!search || search.length === 0) {
      this.visibleCustomOptions = this.customOptions;
      return;
    }

    this.visibleCustomOptions = this.customOptions?.filter((o: any) => {
      return o.getAttribute(DATA_SEARCH_VALUE).toLowerCase().includes(search.toLowerCase());
    });
    this.containsSlottedElements = this.customOptions.length > 0;
    console.log('this.containsSlottedElements=>',this.containsSlottedElements)
  };

  updateVisibleOptions = (search: string) => {
    const hasOptionSearched = this.disableCloseOnSelect &&
      (this.options?.map(option=>option.value.toLowerCase()) || []).includes(search.toLowerCase());
      if (!search || search.length === 0 || hasOptionSearched) {
        console.log('HOLA')
        //this.visibleOptions = this.options as ModusAutocompleteOption[];
        this.showAllOptions();
      return;
    }

    this.handleFilterOptions(search);
  };

  // Do not display the slot for the custom options. We use this hidden slot to reference the slot's children.
  CustomOptionsSlot = () => (
    <div style={{ display: 'none' }}>
      <slot onSlotchange={() => this.updateVisibleCustomOptions(this.value)} />
    </div>
  );

  showAllOptions = () => {
    console.log('options=>',this.options)
    if(this.options && this.options.length > 0 )
    this.visibleOptions = (this.options as ModusAutocompleteOption[]).map((option)=>{
      option.isSelected=false
      return option;
    })
  
    console.log('isCustom', this.containsSlottedElements)
    console.log('visibleCustomOptions=>',this.visibleCustomOptions)
    console.log('visibleOptions=>',this.visibleOptions)
  }
 
  handleFilterOptions = (search: string) => {
    console.log('thisOptions2=>',this.options, search, this.visibleCustomOptions)
    
    // if(this.visibleCustomOptions?.length > 0){
    //   this.visibleOptions = (this.visibleCustomOptions as ModusAutocompleteOption[])?.filter((o: ModusAutocompleteOption) => {
    //     return o.value.toLowerCase().includes(search.toLowerCase());
    //   });
    // }
    if(search && search.length > 0)
    this.visibleOptions = (this.options as ModusAutocompleteOption[])?.filter((o: ModusAutocompleteOption) => {
      return o.value.toLowerCase().includes(search.toLowerCase());
    });
  }

  TextInput = () => (
    <modus-text-input
      clearable={this.clearable}
      errorText={this.hasFocus ? '' : this.errorText}
      includeSearchIcon={this.includeSearchIcon}
      label={this.label}
      onValueChange={(searchEvent: CustomEvent<string>) => { 
        if(this.disableCloseOnSelect){
          this.value = searchEvent.detail;
          return;
        }
        this.handleTextInputValueChange(searchEvent)
      }}
      placeholder={this.placeholder}
      required={this.required}
      size={this.size}
      value={this.value}
      onInput={
        ()=>this.handleFilterOptions(this.value)
      }
      onFocus={()=>{
        this.hasFocus = true;
        if(this.disableCloseOnSelect && this.visibleOptions?.length > 0){
          if(this.visibleOptions?.length > 0){
            const optionVisible = (this.visibleOptions.find((op)=> op.id === this.value))
            if(optionVisible){
              optionVisible.isSelected = true
            }
          }
        }
      }}
      onBlur={this.handleInputBlur}
    />
  );

  render(): unknown {
    const classes = `autocomplete ${this.classBySize.get(this.size)}`;
    return (
      <div
        aria-disabled={this.disabled ? 'true' : undefined}
        aria-invalid={!!this.errorText}
        aria-label={this.ariaLabel}
        aria-readonly={this.readOnly}
        aria-required={this.required}
        class={classes}
        onFocusin={() => {
          this.hasFocus = true;
          if(this.disableCloseOnSelect){
            const optionSelected = document.getElementById('isSelected');
            if(optionSelected){
              optionSelected.focus();
            }
          }
        }}>
        {this.TextInput()}
        <div
          class="options-container"
          style={{ maxHeight: this.dropdownMaxHeight, zIndex: this.dropdownZIndex, overflowY: 'auto' }}>
          <ul>
            {this.displayOptions() &&
              this.visibleOptions?.map((option) => {
                return (
                  <li
                    {...(this.disableCloseOnSelect&&{
                      id:`${option.isSelected?'selected':''}`
                    })}
                    class="text-option"
                    tabindex="0"
                    onClick={() => this.handleOptionClick(option)}
                    onKeyPress={(ev) => this.handleOptionKeyPress(ev, option)}
                    onBlur={this.handleInputBlur}>
                    {option.value}
                  </li>
                );
              })}
            {this.displayOptions() &&
              this.visibleCustomOptions?.map((option) => {
                return(
                <li
                  {...(this.disableCloseOnSelect&&{
                    id:`${option.isSelected?'selected':''}`
                  })}
                  class="custom-option"
                  tabindex="0"
                  onClick={() => this.handleCustomOptionClick(option)}
                  onKeyPress={(ev) => this.handleOptionKeyPress(ev, option, true)}
                  innerHTML={option.outerHTML}
                  onBlur={this.handleInputBlur}
                />
              )})}
          </ul>
          {this.displayNoResults() && <NoResultsFound text={this.noResultsFoundText} subtext={this.noResultsFoundSubtext} />}
        </div>
        {this.CustomOptionsSlot()}
      </div>
    );
  }
}

const NoResultsFound = (props: { text: string; subtext: string }) => (
  <div class="no-results">
    <div style={{ display: 'flex' }}>
      <IconSearch size="28px" />
      <div class="message">{props.text}</div>
    </div>
    <div class="subtext">{props.subtext}</div>
  </div>
);
