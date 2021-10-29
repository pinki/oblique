import {TestBed} from '@angular/core/testing';
import {ObMockNotificationService} from '../../notification/_mocks/mock-notification.service';
import {ObNotificationService} from '../../notification/notification.service';
import {ObValidationService} from './validation.service';

describe('ObValidationService', () => {
	let service: ObValidationService;
	let notification: ObNotificationService;
	const files = [new File(['text'], 'sample.txt', {type: 'text/plain'}), new File(['image'], 'sample.jpg', {type: 'text/plain'})];

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ObValidationService, {provide: ObNotificationService, useClass: ObMockNotificationService}]
		});
		service = TestBed.inject(ObValidationService);
		notification = TestBed.inject(ObNotificationService);
	});

	it('should create instance', () => {
		expect(service).toBeTruthy();
	});

	describe('filterInvalidFiles', () => {
		it('should return current file list if all valid', () => {
			expect(service.filterInvalidFiles(files, undefined, 50, true)).toEqual(files);
		});

		describe('overflowing', () => {
			let filteredFiles;
			beforeEach(() => {
				jest.spyOn(notification, 'error');
				filteredFiles = service.filterInvalidFiles(files, ['*'], 50, false);
			});

			it('should return 1st file', () => {
				expect(filteredFiles.length).toBe(1);
			});

			it('should display error', () => {
				expect(notification.error).toHaveBeenCalledWith({
					message: 'i18n.oblique.file-upload.error.single',
					messageParams: {errors: 'sample.jpg'},
					title: 'i18n.oblique.file-upload.error.title'
				});
			});
		});

		describe('invalid extension', () => {
			let filteredFiles;
			beforeEach(() => {
				jest.spyOn(notification, 'error');
				filteredFiles = service.filterInvalidFiles(files, ['.txt'], 50, true);
			});

			it('should return first file', () => {
				expect(filteredFiles.length).toBe(1);
			});

			it('should display error', () => {
				expect(notification.error).toHaveBeenCalledWith({
					message: 'i18n.oblique.file-upload.error.type',
					messageParams: {errors: 'sample.jpg', parameter: '.txt'},
					title: 'i18n.oblique.file-upload.error.title'
				});
			});
		});

		describe('invalid mime', () => {
			beforeEach(() => {
				jest.spyOn(notification, 'error');
			});

			it('should return first file', () => {
				const filteredFiles = service.filterInvalidFiles(files, ['text/plain'], 50, true);
				expect(filteredFiles.length).toBe(1);
			});

			it('should display mime error', () => {
				service.filterInvalidFiles(files, ['text/plain'], 50, true);
				expect(notification.error).toHaveBeenCalledWith({
					message: 'i18n.oblique.file-upload.error.type',
					messageParams: {errors: 'sample.jpg', parameter: 'text/plain'},
					title: 'i18n.oblique.file-upload.error.title'
				});
			});

			it('should display generic mime error', () => {
				service.filterInvalidFiles(files, ['text/*'], 50, true);
				expect(notification.error).toHaveBeenCalledWith({
					message: 'i18n.oblique.file-upload.error.type',
					messageParams: {errors: 'sample.jpg', parameter: 'text/*'},
					title: 'i18n.oblique.file-upload.error.title'
				});
			});

			it('should display unknown mime error', () => {
				service.filterInvalidFiles(files, ['text/unknown'], 50, true);
				expect(notification.error).toHaveBeenCalledWith({
					message: 'i18n.oblique.file-upload.error.type',
					messageParams: {errors: 'sample.txt, sample.jpg', parameter: 'text/unknown'},
					title: 'i18n.oblique.file-upload.error.title'
				});
			});

			it('should display unknown generic mime error', () => {
				service.filterInvalidFiles(files, ['unknown/*'], 50, true);
				expect(notification.error).toHaveBeenCalledWith({
					message: 'i18n.oblique.file-upload.error.type',
					messageParams: {errors: 'sample.txt, sample.jpg', parameter: 'unknown/*'},
					title: 'i18n.oblique.file-upload.error.title'
				});
			});
		});

		describe('tooLarge', () => {
			let filteredFiles;
			beforeEach(() => {
				jest.spyOn(notification, 'error');
				filteredFiles = service.filterInvalidFiles(files, ['*'], 0.000004, true);
			});

			it('should return first file', () => {
				expect(filteredFiles.length).toBe(1);
			});

			it('should display error', () => {
				expect(notification.error).toHaveBeenCalledWith({
					message: 'i18n.oblique.file-upload.error.size',
					messageParams: {errors: 'sample.jpg (0.00 MB)', parameter: 0.000004},
					title: 'i18n.oblique.file-upload.error.title'
				});
			});
		});
	});
});
