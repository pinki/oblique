(function () {
	'use strict';

	angular
		.module('__MODULE__', [
			'ngAnimate',
			'ngCookies', // Required by $translateCookieStorage <- $translateLocalStorage <- $translate
			'ngSanitize',
			'ui.bootstrap',
			'ui.router',
			'ui.scroll',
			'tmh.dynamicLocale',
			'pascalprecht.translate',
			'satellizer',
			'angular-confirm',
			'angularjs-dropdown-multiselect',
			'checklist-model',
			'monospaced.elastic',

			'__MODULE__.app-templates',
			'__MODULE__.oblique',
			'__MODULE__.common',
			'__MODULE__.auth',
			'__MODULE__.home',
			'__MODULE__.movies',
			'__MODULE__.samples'
		])
		.constant('CONFIG', window['__MODULE__'].CONFIG)

		// Mandatory configuration
		// --------------------------------------------------------
		.config(function ($httpProvider, CONFIG) {
			if (CONFIG.dev && CONFIG.dev.sendCredentials) {
				//$httpProvider.defaults.withCredentials = CONFIG.dev.sendCredentials;
			}
			$httpProvider.interceptors.push('HttpInterceptor');
		})
		.config(function (tmhDynamicLocaleProvider) {
			tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');
		})
		.config(function (CONFIG, $translateProvider) {
			$translateProvider.preferredLanguage(CONFIG.defaults.locale);
			$translateProvider.useLocalStorage();
			$translateProvider.useSanitizeValueStrategy('escaped');
			$translateProvider.useStaticFilesLoader({
				prefix: 'app/i18n/locale-',
				suffix: '.json'
			});
		})
		.config(function (CONFIG, $authProvider) {
			$authProvider.baseUrl = (CONFIG.api.url || '') + CONFIG.api.context;
			$authProvider.signupUrl = '/auth/register';
			//$authProvider.signupRedirect = '/';
			$authProvider.loginUrl = '/auth/login';
			$authProvider.loginRedirect = '/';
			$authProvider.logoutRedirect = '/';
			$authProvider.tokenPrefix = CONFIG.module; // Local Storage name prefix
		})
		.config(function (CONFIG, $urlRouterProvider) {
			// NOTE: before any change below, see https://github.com/angular-ui/ui-router/issues/600
			$urlRouterProvider.otherwise(function($injector) {
				var $state = $injector.get("$state");
				$state.go(CONFIG.defaults.state);
			});
		})
		.config(function ($animateProvider) {
			// Let ngAnimate know which elements to *not* handle (see https://github.com/angular/angular.js/issues/3613):
			$animateProvider.classNameFilter(/^((?!(navigable)).)*$/);
		})

		// Optional configuration
		// --------------------------------------------------------
		.config(function ($logProvider) {
			$logProvider.debugEnabled(true);
		})
		.config(function (CONFIG, uibDatepickerConfig, uibDatepickerPopupConfig) {
			uibDatepickerConfig.showWeeks = false;
			uibDatepickerConfig.startingDay = 1; // Weeks start on Monday
			uibDatepickerPopupConfig.datepickerPopup = CONFIG.defaults.format && CONFIG.defaults.format.date ? CONFIG.defaults.format.date : 'd!.M!.yyyy';
			uibDatepickerPopupConfig.showButtonBar = false;

			// DatepickerPopup config extension:
			uibDatepickerPopupConfig.altInputFormats = CONFIG.defaults.format && CONFIG.defaults.format.dateAlt ? CONFIG.defaults.format.dateAlt : ['d!.M!.yy'];
			uibDatepickerPopupConfig.modelAsIsoFormat = 'yyyy-MM-dd'; // Specifies that model values should be written as ISO-based string with the provided format
		})
		.config(function (CONFIG, LoadingServiceProvider) {
			LoadingServiceProvider.setTimeout(CONFIG.defaults.http.timeout);
		})
		.config(function (schemaValidateConfig) {
			schemaValidateConfig.messageParsers.push(function(name, value, error, schema){
				return '* ' + error.message;
			});
		})

		// Run application
		// --------------------------------------------------------
		.run(function ($httpDecorator) {
			// Decorate $http with prebuilt API methods:
			$httpDecorator.decorate();
		});

	// Bootstrap angular:
	angular.element(document).ready(function () {
		angular.bootstrap(document, ['__MODULE__']);
	});
}());
