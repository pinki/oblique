import {Directive, ElementRef, HostBinding} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap, takeUntil} from 'rxjs/operators';

import {MasterLayoutApplicationService} from './master-layout-application.service';
import {Unsubscribable} from '../unsubscribe';

/**
 * @deprecated since version 2.1.0. Will be deleted in version 3.0.0. Use MasterLayoutComponent & MasterLayoutService instead
 */
@Directive({
	selector: '[orMasterLayoutApplication]',
	exportAs: 'orMasterLayoutApplication'
})
export class MasterLayoutApplicationDirective extends Unsubscribable {

	@HostBinding('class.has-cover') hasCover;
	@HostBinding('class.no-navigation') noNavigation;
	@HostBinding('class.application-fixed') applicationFixed;

	private readonly defaultHasCover;
	private readonly defaultNoNavigation;
	private readonly defaultApplicationFixed;
	private readonly defaultOffcanvas;

	constructor(private readonly layoutApplicationService: MasterLayoutApplicationService,
				private readonly elementRef: ElementRef,
				private readonly router: Router,
				private readonly activatedRoute: ActivatedRoute) {
		super();
		layoutApplicationService.applicationDirective = this; // FIXME: refactor this to avoid circular coupling
		console.warn('MasterLayoutApplicationDirective is deprecated since version 2.1.0 and will be deleted in version 3.0.0. ' +
			'Use MasterLayoutComponent & MasterLayoutService instead');

		this.hasCover = this.defaultHasCover = this.elementRef.nativeElement.classList.contains('has-cover');
		this.noNavigation = this.defaultNoNavigation = this.elementRef.nativeElement.classList.contains('no-navigation');
		this.applicationFixed = this.defaultApplicationFixed = this.elementRef.nativeElement.classList.contains('application-fixed');
		this.defaultOffcanvas = this.elementRef.nativeElement.classList.contains('offcanvas');

		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			map(() => this.activatedRoute),
			map(route => {
				while (route.firstChild) {
					route = route.firstChild;
				}
				return route;
			}),
			filter(route => route.outlet === 'primary'),
			mergeMap(route => route.data),
			takeUntil(this.unsubscribe)
		).subscribe((data) => {
			const masterLayout = data.masterLayout || {};

			this.hasCover = masterLayout.hasCover !== undefined ? masterLayout.hasCover : this.defaultHasCover;
			this.noNavigation = masterLayout.noNavigation !== undefined ? masterLayout.noNavigation : this.defaultNoNavigation;
			this.applicationFixed = masterLayout.applicationFixed !== undefined ? masterLayout.applicationFixed : this.defaultApplicationFixed;
		});
	}
}