import {Component, OnDestroy} from '@angular/core';
import {LayoutManagerService} from '../../../../src/layout-manager/layout-manager.service';

@Component({
	selector: 'layout-manager-sample',
	templateUrl: './layout-manager-sample.component.html'
})
export class LayoutManagerSampleComponent implements OnDestroy {

	constructor(private layoutManager: LayoutManagerService) {

	}

	get cover(): boolean {
		return this.layoutManager.cover;
	}

	set cover(value: boolean) {
		this.layoutManager.cover = value;
	}

	set navigation(value: boolean) {
		this.layoutManager.navigation = value;
	}

	ngOnDestroy() {
		// Ensure navigation is restored:
		this.navigation = true;
	}
}
