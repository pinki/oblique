import {NotificationsDirectiveController} from './notifications-directive-controller';

export class NotificationsDirective {
	restrict = 'AE';
	templateUrl = 'oblique/ui/notifications/notifications.tpl.html';
	replace = true;
	scope = false;
	controller = NotificationsDirectiveController;
	controllerAs = 'ctrl';
}
