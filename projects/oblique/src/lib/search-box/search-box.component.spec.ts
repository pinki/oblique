import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {NO_ERRORS_SCHEMA, QueryList} from '@angular/core';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {ObPopoverDirective} from '../popover/popover.directive';
import {ObSearchBoxComponent} from './search-box.component';

describe('SearchBoxComponent', () => {
	let component: ObSearchBoxComponent;
	let fixture: ComponentFixture<ObSearchBoxComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ObSearchBoxComponent, ObMockTranslatePipe, ObPopoverDirective],
			imports: [RouterTestingModule],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: ObGlobalEventsService, useValue: {}}
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObSearchBoxComponent);
		component = fixture.componentInstance;
		component.items = [
			{id: 'a', label: 'a', routes: []},
			{id: 'b', label: 'b', routes: []},
			{id: 'c', label: 'c', routes: []},
			{id: 't1', label: 't1', routes: []},
			{id: 't2', label: 't2', routes: []},
			{id: 't3', label: 't3', routes: []}
		];
		fixture.detectChanges();
	});

	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('open', () => {
		it('should have the isOpened property to true', () => {
			component.open();
			expect(component.isOpened).toBe(true);
		});

		it('should set the isOpened property to true', () => {
			component.isOpened = false;
			component.open();
			expect(component.isOpened).toBe(true);
		});
	});

	describe('close', () => {
		it('should set the isOpened property to false', () => {
			component.isOpened = true;
			component.close();
			expect(component.isOpened).toBe(false);
		});
	});

	describe('pattern', () => {
		it('should get what has be set', () => {
			component.pattern = 'test1';
			expect(component.pattern).toBe('test1');
		});
		it('should filter items', () => {
			component.minPatternLength = 1;
			component.pattern = 't';
			expect(component.filteredItems.length).toBe(3);
		});
		it('should open if pattern is long enough', () => {
			component.isOpened = false;
			component.minPatternLength = 1;
			component.pattern = 'test3';
			expect(component.isOpened).toBe(true);
		});
		it('should close if pattern is not long enough', () => {
			component.isOpened = true;
			component.minPatternLength = 6;
			component.pattern = 'test4';
			expect(component.isOpened).toBe(false);
		});
	});

	describe('navigationDown', () => {
		beforeEach(() => {
			// @ts-expect-error
			component.links = new QueryList();
			// @ts-expect-error
			component.links.reset([
				{nativeElement: {focus: jest.fn()}},
				{nativeElement: {focus: jest.fn()}},
				{nativeElement: {focus: jest.fn()}}
			]);
			component.pattern = 't';
			// @ts-expect-error
			jest.spyOn(component, 'filterOutUnboundedElements').mockReturnValue(true);
		});

		it('should prevent default event action', () => {
			const mock = {preventDefault: jest.fn()} as unknown as KeyboardEvent;
			component.navigateDown(mock);
			expect(mock.preventDefault).toHaveBeenCalled();
		});
		it('should activate the first item when no item was active', () => {
			// @ts-expect-error
			component.active = undefined;
			component.navigateDown(undefined);
			// @ts-expect-error
			expect(component.active).toBe(0);
		});
		it('should activate the next item', () => {
			// @ts-expect-error
			component.active = 0;
			component.navigateDown(undefined);
			// @ts-expect-error
			expect(component.active).toBe(1);
		});
		it('should activate the first item when the last item was active', () => {
			// @ts-expect-error
			component.active = 2;
			component.navigateDown(undefined);
			// @ts-expect-error
			expect(component.active).toBe(0);
		});
	});

	describe('navigationUp', () => {
		beforeEach(() => {
			// @ts-expect-error
			component.links = new QueryList();
			// @ts-expect-error
			component.links.reset([
				{nativeElement: {focus: jest.fn()}},
				{nativeElement: {focus: jest.fn()}},
				{nativeElement: {focus: jest.fn()}}
			]);
			component.pattern = 't';
			// @ts-expect-error
			jest.spyOn(component, 'filterOutUnboundedElements').mockReturnValue(true);
		});

		it('should prevent default event action', () => {
			const mock = {preventDefault: jest.fn()} as unknown as KeyboardEvent;
			component.navigateUp(mock);
			expect(mock.preventDefault).toHaveBeenCalled();
		});
		it('should activate the last item when no item was active', () => {
			// @ts-expect-error
			component.active = undefined;
			component.navigateUp(undefined);
			// @ts-expect-error
			expect(component.active).toBe(2);
		});
		it('should activate the next item', () => {
			// @ts-expect-error
			component.active = 2;
			component.navigateUp(undefined);
			// @ts-expect-error
			expect(component.active).toBe(1);
		});
		it('should activate the last item when the first item was active', () => {
			// @ts-expect-error
			component.active = 0;
			component.navigateUp(undefined);
			// @ts-expect-error
			expect(component.active).toBe(2);
		});
	});

	describe('exit', () => {
		it('should empty the pattern', () => {
			component.isOpened = true;
			component.exit();
			expect(component.pattern).toBe('');
		});
		it('should empty the filtered items', () => {
			component.isOpened = true;
			component.exit();
			expect(component.filteredItems.length).toBe(0);
		});
		it('should reset active property', () => {
			component.isOpened = true;
			component.exit();
			// @ts-expect-error
			expect(component.active).toBeUndefined();
		});
	});

	describe('formatter', () => {
		it('should not change the label if the pattern is empty', () => {
			expect(component.formatter('test', '')).toBe('test');
		});
		it('should not change the label if the pattern do not match', () => {
			expect(component.formatter('test', 'x')).toBe('test');
		});
		it('should inject html in the label where the pattern match', () => {
			expect(component.formatter('test', 't')).toBe('<span class="ob-highlight">t</span>es<span class="ob-highlight">t</span>');
		});
	});

	describe('focus', () => {
		it('should open the dropdown if the pattern is long enough', () => {
			component.minPatternLength = 1;
			component.pattern = 't';
			component.isOpened = false;
			component.focus();
			expect(component.isOpened).toBe(true);
		});
		it('should not open the dropdown if the pattern is too short', () => {
			component.minPatternLength = 2;
			component.pattern = 't';
			component.isOpened = false;
			component.focus();
			expect(component.isOpened).toBe(false);
		});
	});

	describe('blur', () => {
		beforeEach(() => {
			component.minPatternLength = 1;
			component.pattern = 't';
			component.isOpened = false;
			component.focus();
		});

		it('the dropdown should remain opened if nothing is done', () => {
			expect(component.isOpened).toBe(true);
		});

		it('should close the dropdown when blur is called', () => {
			component.blur({target: undefined} as PointerEvent);
			expect(component.isOpened).toBe(false);
		});
	});
});
