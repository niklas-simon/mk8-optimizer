import { AfterViewInit, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import Chart, { ChartData, ChartTypeRegistry } from 'chart.js/auto';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, AfterViewInit {
    @Input() type: keyof ChartTypeRegistry = 'line';
    @Input() data: ChartData<keyof ChartTypeRegistry> = {labels: [], datasets: []};

    @ViewChild('canvas') canvas?: ElementRef;

    chart?: Chart;

    constructor() { }

    drawChart() {
        if (this.canvas) {
            if (this.chart) {
                this.chart.destroy();
            }
            this.chart = new Chart(this.canvas.nativeElement, {
                type: this.type,
                data: this.data
            })
            this.chart.draw();
        }
    }

    ngOnInit(): void {
    }
    
    ngAfterViewInit(): void {
        this.drawChart();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data'].currentValue || changes['type'].currentValue) {
            this.drawChart();
        }
    }
}
