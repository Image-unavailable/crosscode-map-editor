import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {EditorView} from '../models/editor-view';
import {CCEntity} from './phaser/entities/cc-entity';
import {MapEntity, Point} from '../models/cross-code-map';

@Injectable()
export class GlobalEventsService {

	currentView = new BehaviorSubject<EditorView | undefined>(undefined);
	selectedEntity = new BehaviorSubject<CCEntity | undefined>(undefined);
	updateEntitySettings = new Subject<CCEntity>();
	generateNewEntity = new Subject<MapEntity>();
	filterEntity = new Subject<string>();
	loadComplete = new Subject<void>();
	generateHeights = new Subject<boolean>();
	offsetMap = new Subject<Point>();
	toggleVisibility = new Subject<void>();
	toggleLayerVisibility = new BehaviorSubject<void>(undefined);
	showAddEntityMenu = new Subject<Point>();
	
	babylonLoading = new BehaviorSubject<boolean>(false);
	is3D = new BehaviorSubject<boolean>(false);

	constructor() {
	}

}
