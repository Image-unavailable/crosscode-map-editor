import {Directive, HostListener, Input, OnInit, DoCheck} from '@angular/core';
import * as Phaser from 'phaser';
import {GlobalEventsService} from './global-events.service';
import {MapLoaderService} from './map-loader.service';

//TODO: forward updates from app-sidenav
@Directive({
	selector: '[appPhaserSleepWhileInactive]',
})
export class PhaserSleepWhileInactiveDirective implements OnInit, DoCheck {
	@Input() attachedGame: Phaser.Game | undefined;
	@Input() log = false;
	@Input() activeOverride?: boolean;
	private mouseOver = false;
	private loadingMap = false;
	private windowResized = false;
	
	constructor(
		private globalEvents: GlobalEventsService,
		private mapLoader: MapLoaderService,
	) {
	}
	
	public get defaultActive() {
		return this.loadingMap || this.mouseOver || this.windowResized;
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
			this.attachedGame?.loop.step();
		});
	}
	
	ngDoCheck() {
		this.updatePhaserSleep();
		this.windowResized = false;
	}
	
	//This is where the actual sleep control is, the rest of the code is for monitoring events and applying changes
	updatePhaserSleep(stepOnStop = true) {
		const appliedRunningStatus = this.setPhaserRunning(this.activeOverride ?? this.defaultActive);
		if (stepOnStop && appliedRunningStatus === false) {
			this.attachedGame?.loop.step();
			if (this.log) {
				console.info('Stepped phaser!');
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
					console.info('Phaser running!');
				}
				return true;
			}
		} else {
			if (this.attachedGame.loop.running) {
				this.attachedGame.loop.stop();
				if (this.log) {
					console.info('Phaser stopped!');
				}
				return false;
			}
		}
		return undefined;
	}
}
