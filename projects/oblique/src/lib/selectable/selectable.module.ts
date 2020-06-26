import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObSelectableDirective} from './selectable.directive';
import {ObSelectableGroupDirective} from './selectable-group.directive';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObSelectableDirective} from './selectable.directive';
export {ObSelectableGroupDirective} from './selectable-group.directive';

@NgModule({
	imports: [CommonModule],
	declarations: [ObSelectableDirective, ObSelectableGroupDirective],
	providers: obliqueProviders(),
	exports: [ObSelectableDirective, ObSelectableGroupDirective]
})
export class ObSelectableModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObSelectableModule);
	}
}
