import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {NavTreeComponent} from './nav-tree.component';

@NgModule({
	imports: [
		CommonModule,
		NgbModule,
		RouterModule,
		TranslateModule,
	],
	declarations: [NavTreeComponent],
	exports: [NavTreeComponent]
})
export class NavTreeModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: NavTreeModule
		};
	}
}