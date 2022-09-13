import {NgModule} from '@angular/core';
import {Vec2WidgetComponent} from './vec2-widget/vec2-widget.component';
import {JsonWidgetComponent} from './json-widget/json-widget.component';
import {BooleanWidgetComponent} from './boolean-widget/boolean-widget.component';
import {NumberWidgetComponent} from './number-widget/number-widget.component';
import {StringWidgetComponent} from './string-widget/string-widget.component';
import {MaterialModule} from '../../external-modules/material.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LevelWidgetComponent} from './level-widget/level-widget.component';
import {NPCStatesWidgetComponent} from './npc-states-widget/npc-states-widget.component';
import {NpcStatesComponent} from './npc-states-widget/npc-states/npc-states.component';
import {AngularDraggableModule} from 'angular2-draggable';
import {OverlayModule} from '@angular/cdk/overlay';
import {EventWidgetComponent} from './event-widget/event-widget.component';
import {EventRegistryService} from './event-widget/event-registry/event-registry.service';
import {SharedModule} from '../shared.module';
import {EventEditorComponent} from './event-widget/event-editor/editor/event-editor.component';
import {RowTextComponent} from './event-widget/event-editor/row-text/row-text.component';
import {EventHelperService} from './event-widget/event-editor/event-helper.service';
import {EventDetailComponent} from './event-widget/event-editor/detail/event-detail.component';
import {EventWindowComponent} from './event-widget/event-window/event-window.component';
import {CharacterWidgetComponent} from './character-widget/character-widget.component';
import {CharacterNamesService} from './character-widget/character-names.service';
import {PersonExpressionWidgetComponent} from './person-expression-widget/person-expression-widget.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {AddEventService} from './event-widget/event-editor/add/add-event.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EnemyTypeWidgetComponent } from './enemy-type-widget/enemy-type-widget.component';
import { EnemyTypeWidgetOverlayComponent } from './enemy-type-widget/enemy-type-overlay/enemy-type-overlay.component';
import {LangLabelWidgetComponent} from './langlabel-widget/langlabel-widget.component';
import {AngularResizeEventModule} from 'angular-resize-event';
import {AutocompletedTextboxComponent} from './string-widget/autocompleted-textbox/autocompleted-textbox.component';

const COMPONENTS = [
	StringWidgetComponent,
	NumberWidgetComponent,
	BooleanWidgetComponent,
	JsonWidgetComponent,
	LevelWidgetComponent,
	Vec2WidgetComponent,
	NPCStatesWidgetComponent,
	NpcStatesComponent,
	EventWidgetComponent,
	EventEditorComponent,
	CharacterWidgetComponent,
	PersonExpressionWidgetComponent,
	EnemyTypeWidgetComponent,
	LangLabelWidgetComponent,
	AutocompletedTextboxComponent,
];

const PRIVATE_COMPONENTS = [
	EventWindowComponent,
	RowTextComponent,
	EventDetailComponent,
	EnemyTypeWidgetOverlayComponent,
];

@NgModule({
	imports: [
		FormsModule,
		FlexLayoutModule,
		CommonModule,
		MaterialModule,
		OverlayModule,
		AngularDraggableModule,
		DragDropModule,
		ScrollingModule,
		SharedModule,
		AngularResizeEventModule,
	],
	providers: [
		EventRegistryService,
		EventHelperService,
		CharacterNamesService,
		AddEventService,
	],
	declarations: [COMPONENTS, PRIVATE_COMPONENTS],
	entryComponents: [COMPONENTS, PRIVATE_COMPONENTS],
	exports: COMPONENTS
})
export class WidgetModule {
}
