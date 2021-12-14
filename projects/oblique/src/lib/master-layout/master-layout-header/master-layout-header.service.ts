import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from '../master-layout.model';

@Injectable({providedIn: 'root'})
export class ObMasterLayoutHeaderService {
	readonly configEvents$: Observable<ObIMasterLayoutEvent>;
	private readonly _events = new Subject<ObIMasterLayoutEvent>();
	private _isCustom = this.config.header.isCustom;
	private _isSmall = this.config.header.isSmall;
	private _isSticky = this.config.header.isSticky;
	private _reduceOnScroll = this.config.header.reduceOnScroll;

	constructor(private readonly config: ObMasterLayoutConfig) {
		this.configEvents$ = this._events.asObservable();
	}

	get isCustom() {
		return this._isCustom;
	}

	set isCustom(value: boolean) {
		this._isCustom = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.HEADER_IS_CUSTOM,
			value
		});
	}

	get isSmall(): boolean {
		return this._isSmall;
	}

	set isSmall(value: boolean) {
		this._isSmall = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.HEADER_IS_SMALL,
			value
		});
	}

	get isSticky(): boolean {
		return this._isSticky;
	}

	set isSticky(value: boolean) {
		this._isSticky = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.HEADER_IS_STICKY,
			value
		});
	}

	get reduceOnScroll(): boolean {
		return this._reduceOnScroll;
	}

	set reduceOnScroll(value: boolean) {
		this._reduceOnScroll = value;
		this._events.next({
			name: ObEMasterLayoutEventValues.HEADER_REDUCE_ON_SCROLL,
			value
		});
	}
}
