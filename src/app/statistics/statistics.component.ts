import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ChartData, ChartOptions, ChartTypeRegistry, Point } from 'chart.js';
import { Combination, Stat, StatsService, stats } from '../stats.service';
import { Settings, SettingsService } from '../settings.service';

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

    setScatterStats() {
        this.scatterStatX = this.filteredStats[0].key;
        this.scatterStatY = this.filteredStats[1].key;
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
        console.log(this.scatterData);
    }

    constructor(private settingsService: SettingsService, private statsService: StatsService) { }

    ngOnInit(): void {
        this.settingsService.getSubject().subscribe(settings => {
            console.log("statistics: settings changed", settings);
            this.filteredStats = stats.filter(s => typeof s.simple === "undefined" || s.simple === settings.simple);
            this.setRadar();
            this.setScatterStats();
            this.setScatter();
        });
        this.statsService.getSubject().subscribe(combins => {
            this.combins = combins;
            this.setScatter();
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['selected']?.currentValue) {
            console.log("statistics: selected changed", changes['selected'].currentValue);
            this.setRadar();
            this.setScatter();
        }
    }

}
