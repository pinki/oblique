import {MatIconModule} from '@angular/material/icon';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObCollapseComponent} from './collapse.component';
import {obliqueProviders} from '../utilities';

export {
	ObCollapseComponent,
	OBLIQUE_COLLAPSE_ACTIVE,
	OBLIQUE_COLLAPSE_ICON_POSITION,
	OBLIQUE_COLLAPSE_DURATION
} from './collapse.component';

@NgModule({
	imports: [CommonModule, MatIconModule],
	declarations: [ObCollapseComponent],
	providers: obliqueProviders(),
	exports: [ObCollapseComponent]
})
export class ObCollapseModule {}
