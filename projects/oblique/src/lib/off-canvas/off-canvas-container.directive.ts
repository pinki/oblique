import {Directive, HostBinding, OnDestroy} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import {ObOffCanvasService} from './off-canvas.service';
import {Subject} from 'rxjs';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '.offcanvas, ob-master-layout'
})
export class ObOffCanvasContainerDirective implements OnDestroy {
	@HostBinding('class.offcanvas-in') open = false;
	private readonly unsubscribe = new Subject();

	constructor(offCanvas: ObOffCanvasService) {
		offCanvas.opened.pipe(takeUntil(this.unsubscribe)).subscribe(value => {
			this.open = value;
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
