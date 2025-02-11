import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {delay, filter, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ObSpinnerService} from './spinner.service';
import {ObISpinnerEvent} from './spinner.model';

@Component({
	selector: 'ob-spinner',
	exportAs: 'obSpinner',
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.scss'],
	encapsulation: ViewEncapsulation.None,
	animations: [
		trigger('inOut', [
			state('in', style({opacity: 1, display: 'block'})),
			transition('out => in', [
				style({display: 'block'}), // As we can not animate the `display` property, we modify it before starting the next animation.
				animate('250ms ease-in-out', keyframes([style({offset: 0, opacity: 0}), style({offset: 1, opacity: 1})]))
			]),
			state('out', style({opacity: 0, display: 'none'})),
			transition('in => out', [animate('250ms ease-in-out', keyframes([style({offset: 0, opacity: 1}), style({offset: 1, opacity: 0})]))])
		])
	],
	host: {class: 'ob-spinner'}
})
export class ObSpinnerComponent implements OnInit, OnDestroy {
	@Input() channel: string = ObSpinnerService.CHANNEL;
	@Input() fixed = false;
	@ViewChild('spinnerContainer') spinnerContainer: ElementRef;
	$state = 'out';
	private readonly unsubscribe = new Subject<void>();

	constructor(private readonly spinnerService: ObSpinnerService, private readonly element: ElementRef) {}

	ngOnInit(): void {
		this.element.nativeElement.parentElement.classList.add('ob-has-overlay');
		this.spinnerService.events$
			.pipe(
				takeUntil(this.unsubscribe),
				filter(event => event.channel === this.channel),
				delay(0) // avoid ExpressionChangedAfterItHasBeenCheckedError when the spinner is activated during a component's initialisation process
			)
			.subscribe((event: ObISpinnerEvent) => (this.$state = event.active ? 'in' : 'out'));
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
