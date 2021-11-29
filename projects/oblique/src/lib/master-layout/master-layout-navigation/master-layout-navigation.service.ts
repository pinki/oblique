import {Inject, Injectable} from '@angular/core';
import {merge, Observable, Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {delay} from 'rxjs/operators';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObEMasterLayoutEventValues, ObEScrollMode, ObIMasterLayoutEvent} from '../master-layout.model';
import {WINDOW} from '../../utilities';
import {ObOffCanvasService} from '../../off-canvas/off-canvas.service';

@Injectable({
	providedIn: 'root'
})
export class ObMasterLayoutNavigationService {
	readonly configEvents$: Observable<ObIMasterLayoutEvent>;
	private readonly _events = new Subject<ObIMasterLayoutEvent>();
	private readonly _scrolled: Subject<number> = new Subject<number>();
	private readonly scrolled$ = this._scrolled.asObservable();
	private readonly _refreshed: Subject<void> = new Subject<void>();
	private readonly refreshed$ = this._refreshed.asObservable();

	constructor(
		private readonly config: ObMasterLayoutConfig,
		offCanvas: ObOffCanvasService,
		translate: TranslateService,
		@Inject(WINDOW) private readonly window: Window
	) {
		merge(
			translate.onLangChange,
			offCanvas.opened.pipe(delay(600)) // delay for the animation duration
		).subscribe(() => this.refresh());
		this.configEvents$ = this._events.asObservable();
	}

	private _isFullWidth = this.config.navigation.isFullWidth;

	get isFullWidth() {
		return this._isFullWidth;
	}

	set isFullWidth(value: boolean) {
		this._isFullWidth = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.NAVIGATION_IS_FULL_WIDTH,
			value: value
		});
	}

	private _scrollMode = this.config.navigation.scrollMode;

	get scrollMode() {
		return this._scrollMode;
	}

	set scrollMode(value: ObEScrollMode) {
		this._scrollMode = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.NAVIGATION_SCROLL_MODE,
			mode: value
		});
	}

	get scrolled(): Observable<number> {
		return this.scrolled$;
	}

	get refreshed(): Observable<void> {
		return this.refreshed$;
	}

	refresh() {
		// postpone the event emission so that Angular has time to apply changes to the DOM
		this.window.setTimeout(() => this._refreshed.next());
	}

	scrollLeft(offset?: number): void {
		// postpone the event emission so that Angular has time to apply changes to the DOM
		this.window.setTimeout(() => this._scrolled.next(-(offset || this.config.navigation.scrollDelta)));
	}

	scrollRight(offset?: number): void {
		// postpone the event emission so that Angular has time to apply changes to the DOM
		this.window.setTimeout(() => this._scrolled.next(offset || this.config.navigation.scrollDelta));
	}
}
