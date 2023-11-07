import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ChartData, ChartOptions, ChartTypeRegistry, Point } from 'chart.js';
import { Combination, Stat, StatsService, stats } from '../stats.service';
import { Settings, SettingsService } from '../settings.service';
import { ClickEvent } from '../chart/chart.component';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
    @Input() selected: Combination[] = [];

    combins: Combination[] = [];
    filteredStats: Stat[] = [];
    radarData: ChartData<'radar'> = { labels: [], datasets: [] }
    scatterData: ChartData<'scatter'> = { labels: [], datasets: [] }
    scatterStatX = "mt";
    scatterStatY = "sl";
    radarOptions: ChartOptions = {
        scales: {
            r: {
                beginAtZero: true,
                ticks: {
                    display: false
                }
            }
        }
    }
    settings = this.settingsService.get();

    setRadar() {
        this.radarData = {
            labels: this.filteredStats.map(s => s.name),
            datasets: this.selected.map(c => {
                return {
                    label: "",
                    data: this.filteredStats.map(s => (c as any)[s.key]),
                    backgroundColor: c.color + "40",
                    borderColor: c.color
                }
            })
        }
    }

    setScatter() {
        this.scatterData = {
            datasets: [
                ...this.selected.map(c => {
                    return {
                        label: "",
                        data: [{
                            x: (c as any)[this.scatterStatX],
                            y: (c as any)[this.scatterStatY]
                        }],
                        pointBackgroundColor: c.color + "40",
                        pointBorderColor: c.color
                    };
                }),
                {
                    label: "",
                    data: this.combins.filter(c => !c.color).reduce((array, c) => {
                        const point = {
                            x: (c as any)[this.scatterStatX],
                            y: (c as any)[this.scatterStatY]
                        };
                        if (!array.find(p => p.x === point.x && p.y === point.y)) {
                            array.push(point);
                        }
                        return array;
                    }, [] as Point[]),
                    pointBackgroundColor: "#a0a0a040",
                    pointBorderColor: "#a0a0a0"
                }
            ]
        }
    }

    constructor(private settingsService: SettingsService, private statsService: StatsService) { }

    ngOnInit(): void {
        this.settingsService.getSubject().subscribe(settings => {
            this.filteredStats = stats.filter(s => typeof s.simple === "undefined" || s.simple === settings.simple).sort((a, b) => a.key < b.key ? -1 : 1);
            this.settings = settings;
            this.setRadar();
            this.setScatter();
        });
        this.statsService.getSubject().subscribe(combins => {
            this.combins = combins;
            this.setScatter();
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['selected']?.currentValue) {
            this.setRadar();
            this.setScatter();
        }
    }

    onChartClick(e: ClickEvent) {
        const point = e as Point;
        if (!this.settings.stats.find(s => s.key === this.scatterStatX && s.value === point.x)) {
            this.settings.stats.push({
                key: this.scatterStatX,
                value: point.x
            })
        }
        if (!this.settings.stats.find(s => s.key === this.scatterStatY && s.value === point.y)) {
            this.settings.stats.push({
                key: this.scatterStatY,
                value: point.y
            })
        }
        this.settingsService.set(this.settings);
    }

    resetFilter() {
        this.settings.stats = [];
        this.settingsService.set(this.settings);
    }

}
