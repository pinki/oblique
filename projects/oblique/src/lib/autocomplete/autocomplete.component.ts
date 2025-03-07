import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewEncapsulation} from '@angular/core';
import {ObIAutocompleteInputOption, ObIAutocompleteInputOptionGroup, OptionLabelIconPosition} from '../autocomplete/autocomplete.model';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Observable, Subject, debounceTime} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';

@Component({
	selector: 'ob-autocomplete',
	templateUrl: './autocomplete.component.html',
	styleUrls: ['./autocomplete.component.scss'],
	host: {class: 'ob-autocomplete'},
	encapsulation: ViewEncapsulation.None,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: ObAutocompleteComponent,
			multi: true
		}
	]
})
export class ObAutocompleteComponent implements OnChanges, ControlValueAccessor, OnDestroy {
	@Input() inputLabelKey = 'i18n.oblique.search.title';
	@Input() noResultKey = 'i18n.oblique.search.no-results';
	@Input() autocompleteOptions: (ObIAutocompleteInputOption | ObIAutocompleteInputOptionGroup)[] = [];
	@Input() filterRegexPattern = 'textToFind';
	@Input() filterRegexFlag = 'gi';
	@Input() highlightCssClass = 'ob-highlight-text';
	@Input() optionIconPosition: OptionLabelIconPosition = 'end';

	@Output() readonly selectedOptionChange: EventEmitter<ObIAutocompleteInputOption> = new EventEmitter<ObIAutocompleteInputOption>();
	autocompleteInputControl = new FormControl('', {updateOn: 'change'});
	filteredOptions$: Observable<(ObIAutocompleteInputOption | ObIAutocompleteInputOptionGroup)[]>;
	hasGroupOptions = false;
	private readonly unsubscribe = new Subject<void>();

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	ngOnChanges(): void {
		this.setupOptionsFilter();
	}

	setDisabledState(isDisabled: boolean): void {
		if (isDisabled) {
			this.autocompleteInputControl.disable();
		} else {
			this.autocompleteInputControl.enable();
		}
	}

	/**
	 * @remarks
	 * This method must be overwritten by ControlValueAccessor, this is why an error is thrown by default.
	 */
	onModelTouched: () => void = () => {
		throw Error('Method onModelTouched has not been overwritten by the ControlValueAccessor.');
	};

	/**
	 * Write a new value to the element.
	 */
	writeValue(value: string): void {
		this.autocompleteInputControl.setValue(value);
	}

	/**
	 * Set the function to be called
	 * when the control receives a change event.
	 */
	registerOnChange(fn: (v: any) => void): void {
		this.autocompleteInputControl.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(value => fn(value));
	}

	/**
	 * Set the function to be called
	 * when the control receives a touch event.
	 */
	registerOnTouched(fn: () => unknown): void {
		this.onModelTouched = fn;
		this.autocompleteInputControl.valueChanges
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(() => this.autocompleteInputControl.markAllAsTouched());
	}

	private setupOptionsFilter(): void {
		this.filteredOptions$ = this.autocompleteInputControl.valueChanges.pipe(
			startWith(''),
			debounceTime(200),
			map((searchValue: string) => {
				if (this.autocompleteOptions.length > 0) {
					const toFilter = JSON.parse(JSON.stringify(this.autocompleteOptions));
					return this.filterAutocomplete(searchValue || '', toFilter);
				}
				return [];
			})
		);
	}

	private filterAutocomplete(
		filterValue: string,
		optionsToFilter: (ObIAutocompleteInputOption | ObIAutocompleteInputOptionGroup)[]
	): (ObIAutocompleteInputOptionGroup | ObIAutocompleteInputOption)[] {
		this.hasGroupOptions = this.isGroupOption(optionsToFilter[0]);
		const searchText = filterValue.toLowerCase();
		if (this.autocompleteInputControl.value === '') {
			return this.autocompleteOptions;
		}
		return this.hasGroupOptions
			? this.filterGroups(optionsToFilter as ObIAutocompleteInputOptionGroup[], searchText)
			: this.filterOptions(optionsToFilter as ObIAutocompleteInputOption[], searchText);
	}

	private filterGroups(groups: ObIAutocompleteInputOptionGroup[], searchText: string): ObIAutocompleteInputOptionGroup[] {
		return groups
			.map(group => ({...group, groupOptions: this.filterOptions(group.groupOptions, searchText)}))
			.filter(group => group.groupOptions.length > 0);
	}

	private filterOptions(options: ObIAutocompleteInputOption[], searchText: string): ObIAutocompleteInputOption[] {
		const regex = new RegExp(searchText, this.filterRegexFlag);
		return options.filter((option: ObIAutocompleteInputOption) => regex.test(option.label));
	}

	private isGroupOption(option: ObIAutocompleteInputOptionGroup | ObIAutocompleteInputOption): boolean {
		return !!(option as ObIAutocompleteInputOptionGroup).groupOptions;
	}
}
