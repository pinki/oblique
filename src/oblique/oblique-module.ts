import {DateDirective} from './formatters/date-directive';
import {NumberFormatDirective} from './formatters/number-format-directive';
import {exceptionHandlerDecorator} from './infrastructure/exception-handler-decorator';
import {httpDecorator} from './infrastructure/http-decorator';
import {HttpInterceptor} from './infrastructure/http-interceptor';
import {logDecorator, LogDecorator} from './infrastructure/log-decorator';
import {NavigatorDirective} from './navigator/navigator-directive';
import {NavigatorService} from './navigator/navigator-service';
import {LoadingServiceProvider} from './status/loading-service-provider';
import {DatePickerDirective} from './ui/date-picker/date-picker-directive';
import {NotificationsDirective} from './ui/notifications/notifications-directive';
import {DelayedChangeDirective} from './ui/delayed-change-directive';
import {DropdownClosableDirective} from './ui/dropdown-closable-directive';
import {EnterDirective} from './ui/enter-directive';
import {GiveMeFocusDirective} from './ui/give-me-focus-directive';
import {MultiselectDirective} from './ui/multiselect/multiselect-directive';
import {MultiselectConfig} from './ui/multiselect/multiselect-config';
import {NavigableDirective} from './ui/navigable-directive';
import {UibTypeaheadDirective} from './ui/typeahead-directive';
import {NotificationServiceProvider} from './ui/notifications/notification-service-provider';
import {DatePickerPopupDirective} from './ui/date-picker/date-picker-popup-directive';
import {UibTypeaheadPopupDirective} from './ui/typeahead-popup-directive';
import {BackToTopDirective} from './ui/back-to-top/back-to-top-directive';
import {HasErrorDirective} from './validation/has-error-directive';
import {SchemaValidateDirective} from './validation/schema/schema-validate-directive';
import {SchemaValidationConfig} from './validation/schema/schema-validation-config';
import {SchemaValidationDirective} from './validation/schema/schema-validation-directive';
import {SchemaValidatorService} from './validation/schema/schema-validator-service';
import {UnsavedChangesService} from './validation/unsaved-changes-service';
import {UnsavedChangesDirective} from './validation/unsaved-changes-directive';

// Make sure that required templates for oblique-reactive will be loaded (and bundled):
import '../oblique-reactive-templates';

// Export module's name so that it can be imported in the app-module of the business application:
export const ObliqueModule = 'oblique-reactive';

angular.module(ObliqueModule, ['oblique-reactive.app-templates'])
	.directive('date', () => new DateDirective())
	.directive('numberFormat', ($filter:ng.IFilterService, $parse:ng.IParseService) => new NumberFormatDirective($filter, $parse))
	.decorator('$exceptionHandler', exceptionHandlerDecorator)
	.decorator('$http', httpDecorator)
	.service('HttpInterceptor', HttpInterceptor)
	.decorator('$log', logDecorator)
	.directive('navigator', ($document:ng.IDocumentService) => new NavigatorDirective($document))
	.service('$navigator', NavigatorService)
	.provider('loadingService', () => new LoadingServiceProvider())
	.directive('datePicker', () => new DatePickerDirective())
	.directive('uibDatepickerPopup', (dateFilter, uibDateParser, uibDatepickerPopupConfig) => new DatePickerPopupDirective(
		dateFilter,
		uibDateParser,
		uibDatepickerPopupConfig
	))
	.provider('notificationService', () => new NotificationServiceProvider())
	.directive('notifications', () => new NotificationsDirective())
	.directive('delayedChange', () => new DelayedChangeDirective())
	.directive('dropdownClosable', ($timeout:ng.ITimeoutService) => new DropdownClosableDirective($timeout))
	.directive('enter', () => new EnterDirective())
	.directive('giveMeFocus', () => new GiveMeFocusDirective())
	.constant('multiselectConfig', new MultiselectConfig())
	.directive('multiselect', () => new MultiselectDirective())
	.directive('navigable', ($timeout:ng.ITimeoutService) => new NavigableDirective($timeout))
	.directive('uibTypeahead', () => new UibTypeaheadDirective())
	.directive('uibTypeaheadPopup', () => new UibTypeaheadPopupDirective())
	.directive('hasError', () => new HasErrorDirective())
	.service('schemaValidator', SchemaValidatorService)
	.constant('schemaValidationConfig', new SchemaValidationConfig())
	.directive('schemaValidation', ()=> new SchemaValidationDirective())
	.directive('schemaValidate', ($log:LogDecorator,
	                              $timeout:ng.ITimeoutService,
	                              schemaValidator:SchemaValidatorService) => new SchemaValidateDirective($log, $timeout, schemaValidator))
	.service('unsavedChangesService', UnsavedChangesService)
	.directive('unsavedChanges', (unsavedChangesService:UnsavedChangesService) => new UnsavedChangesDirective(unsavedChangesService))
	.directive('backToTop', () => new BackToTopDirective);
