import {Directive, HostListener, Input, OnInit, DoCheck} from '@angular/core';
import * as Phaser from 'phaser';
import {GlobalEventsService} from './global-events.service';
import {MapLoaderService} from './map-loader.service';

//TODO: update when an entity is created
@Directive({
	selector: '[appPhaserSleepWhileInactive]',
})
export class PhaserSleepWhileInactiveDirective implements OnInit, DoCheck {
	@Input() attachedGame: Phaser.Game | undefined;
	@Input() log = false; //Logging is on level 4 of the console, which is hidden by default
	@Input() activeOverride?: boolean;
	private mouseOver = false;
	private loadingMap = false;
	private windowResized = false;
	private redrawRequested = false;
	
	constructor(
		private globalEvents: GlobalEventsService,
		private mapLoader: MapLoaderService,
	) {
	}
	
	public get defaultActive() {
		return this.loadingMap || this.mouseOver || this.windowResized || this.redrawRequested;
	}
	
	public requestRedraw() {
		//Calling this.stepUnlessOverridden() here doesn't update the tile selector properly probably due to the async operations in it,
		//using this allows the override by the tile selector component to take effect (At least that's why I think it works, not too sure about it).
		//Either way it does not seem to be affected by how long the tile selector takes to load the tilemap (1000ms times are fine).
		this.redrawRequested = true;
	}
	
	ngOnInit() {
		//Started loading a map
		this.mapLoader.map.subscribe(() => {
			this.loadingMap = true;
			this.updatePhaserSleep();
		});
		//Finished loading a map (also called after initial editor loading)
		this.globalEvents.currentView.subscribe(() => {
			this.loadingMap = false;
			//Always step after scene load is completed, even if phaser was stopped before finishing the loading
			this.updatePhaserSleep(false);
			this.stepUnlessOverridden();
		});
		//Tile updates
		this.mapLoader.selectedLayer.subscribe(() => this.requestRedraw());
		this.globalEvents.toggleLayerVisibility.subscribe(() => this.requestRedraw());
	}
	
	ngDoCheck() {
		this.updatePhaserSleep();
		this.windowResized = false;
		this.redrawRequested = false;
	}
	
	updatePhaserSleep(stepOnStop = true) {
		const appliedRunningStatus = this.setPhaserRunning(this.activeOverride ?? this.defaultActive);
		if (stepOnStop && appliedRunningStatus === false) {
			this.attachedGame?.loop.tick();
			if (this.log) {
				console.debug('Stepped phaser after sleep update.');
			}
		}
	}
	
	@HostListener('mouseenter')
	mouseEnter() {
		this.mouseOver = true;
	}
	
	@HostListener('mouseleave')
	mouseLeave() {
		this.mouseOver = false;
	}
	
	@HostListener('window:resize')
	windowResize() {
		this.windowResized = true;
	}
	
	private setPhaserRunning(runPhaser: boolean): boolean | undefined {
		if (this.attachedGame === undefined) {
			return undefined;
		}
		
		if (runPhaser) {
			if (!this.attachedGame.loop.running) {
				this.attachedGame.loop.wake();
				if (this.log) {
					console.debug('Phaser running.');
				}
				return true;
			}
		} else {
			if (this.attachedGame.loop.running) {
				this.attachedGame.loop.stop();
				if (this.log) {
					console.debug('Phaser stopped.');
				}
				return false;
			}
		}
		return undefined;
	}
	
	private stepUnlessOverridden() {
		if (this.activeOverride !== false) {
			this.attachedGame?.loop.tick();
			if (this.log) {
				console.debug('Stepped phaser once.');
			}
		}
	}
}
