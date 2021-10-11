import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MapLoaderService } from '../../shared/map-loader.service';
import { GlobalEventsService } from '../../shared/global-events.service';
import { Globals } from '../../shared/globals';
import { HttpClientService } from '../../services/http-client.service';
import { StateHistoryService } from '../../shared/history/state-history.service';
import { PhaserEventsService } from '../../shared/phaser/phaser-events.service';
import * as Phaser from 'phaser';
import { MainScene } from '../../shared/phaser/main-scene';
import { HeightMapService } from '../../services/height-map/height-map.service';
import { AutotileService } from '../../services/autotile/autotile.service';
import { EntityRegistryService } from '../../shared/phaser/entities/registry/entity-registry.service';

@Component({
	selector: 'app-phaser',
	templateUrl: './phaser.component.html',
	styleUrls: ['./phaser.component.scss']
})
export class PhaserComponent implements OnInit {
	
	@ViewChild('content', {static: true}) content!: ElementRef<HTMLElement>;
	private mouseOverPhaser = false;
	private loadingMap = false;
	
	constructor(
		private element: ElementRef,
		private mapLoader: MapLoaderService,
		private globalEvents: GlobalEventsService,
		private stateHistory: StateHistoryService,
		private phaserEventsService: PhaserEventsService,
		private heightMap: HeightMapService,
		private http: HttpClientService,
		registry: EntityRegistryService,
		autotile: AutotileService
	) {
		Globals.stateHistoryService = stateHistory;
		Globals.mapLoaderService = mapLoader;
		Globals.phaserEventsService = phaserEventsService;
		Globals.globalEventsService = globalEvents;
		Globals.autotileService = autotile;
		Globals.entityRegistry = registry;
		Globals.httpService = http;
	}
	
	
	ngOnInit() {
		this.heightMap.init();
		const scene = new MainScene();
		const scale = this.getScale();
		Globals.game = new Phaser.Game({
			width: scale.width,
			height: scale.height,
			type: Phaser.AUTO,
			parent: 'content',
			scale: {
				mode: Phaser.Scale.ScaleModes.NONE,
				zoom: 1 / window.devicePixelRatio
			},
			render: {
				antialiasGL: false,
				pixelArt: true
			},
			zoom: 1,
			scene: [scene]
		});
		Globals.scene = scene;
		
		//Started loading a map
		this.mapLoader.map.subscribe(() => {
			console.info('Map loading started!');
			this.loadingMap = true;
			this.updatePhaserSleep();
		});
		//Finished loading a map (also called after initial editor loading)
		this.globalEvents.currentView.subscribe(() => {
			console.info('Map loading complete!');
			this.loadingMap = false;
			this.updatePhaserSleep();
			Globals.game.loop.step(); //Draw a final "complete" version of the scene before toggling phaser off
		});
	}
	
	@HostListener('window:resize', ['$event'])
	onResize() {
		if (!Globals.game) {
			return;
		}
		const scale = this.getScale();
		Globals.game.scale.resize(
			scale.width,
			scale.height
		);
	}
	
	@HostListener('mouseenter')
	mouseEnter() {
		this.mouseOverPhaser = true;
		this.updatePhaserSleep();
	}
	
	@HostListener('mouseleave')
	mouseLeave() {
		this.mouseOverPhaser = false;
		this.updatePhaserSleep();
	}
	
	private setPhaserRunning(runPhaser: boolean) {
		if (runPhaser) {
			if (!Globals.game.loop.running) {
				Globals.game.loop.wake();
				console.info('Phaser running.');
			}
		} else {
			if (Globals.game.loop.running) {
				Globals.game.loop.stop();
				console.info('Phaser sleeping.');
			}
		}
	}
	
	private updatePhaserSleep() {
		this.setPhaserRunning(this.loadingMap || this.mouseOverPhaser);
	}
	
	private getScale() {
		const rect = this.content.nativeElement.getBoundingClientRect();
		return {
			width: (rect.width + 5) * window.devicePixelRatio,
			height: (rect.height + 5) * window.devicePixelRatio
		};
	}
}
