import {AbstractEvent, EventType} from './abstract-event';
import {Label, Person} from '../../../../models/events';

interface ShowSideMsgData extends EventType {
	message: Label;
	person: Person;
}

export class ShowSideMsg extends AbstractEvent<ShowSideMsgData> {
	private attributes = {
		person: {
			type: 'PersonExpression',
			description: 'Person + Exporession of message'
		},
		message: {
			type: 'LangLabel',
			large: true,
			description: 'Message to display'
		}
	};
	
	getAttributes() {
		return this.attributes;
	}
	
	update() {
		this.info = this.combineStrings(
			this.getColoredString(this.data.person.person + '>&#8203;' + this.data.person.expression, '#bfa24c'),
			this.data.message.en_US
		);
	}
	
	protected generateNewDataInternal() {
		return {
			person: {},
			message: {}
		};
	}
}
