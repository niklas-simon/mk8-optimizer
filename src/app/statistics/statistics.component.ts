import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ChartData, ChartTypeRegistry } from 'chart.js';
import { Combination, stats } from '../stats.service';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
    @Input() combins: Combination[] = [];

    data: ChartData<keyof ChartTypeRegistry> = { labels: [], datasets: [] }

    constructor() { }

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes);
        if (changes['combins'].currentValue) {
            this.data = {
                labels: stats.map(s => s.name),
                datasets: this.combins.map(c => {
                    return {
                        label: c.driver.names[0],
                        data: stats.map(s => (c as any)[s.key])
                    }
                })
            }
        }
    }

}
