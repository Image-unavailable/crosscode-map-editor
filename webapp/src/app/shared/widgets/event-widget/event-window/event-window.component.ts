import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { EventEditorComponent } from '../event-editor/editor/event-editor.component';
import { EventHelperService } from '../event-editor/event-helper.service';
import { EventArray } from '../../../../models/events';

@Component({
	selector: 'app-event-window',
	templateUrl: './event-window.component.html',
	styleUrls: ['./event-window.component.scss', '../../widget.scss'],
})
export class EventWindowComponent {

	@ViewChild('eventEditor', { static: false }) eventEditor!: EventEditorComponent;

	@Input() event: EventArray | unknown = [];
	@Input() actionStep = false;
	@Output() exit = new EventEmitter<EventArray>();

	constructor(
		private helper: EventHelperService
	) {
	}

	save() {
		this.exit.emit(this.eventEditor.export());
		this.helper.selectedEvent.next(null);
	}

	cancel() {
		this.exit.error('cancel');
		this.helper.selectedEvent.next(null);
	}
}
