import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import Chart, { BubbleDataPoint, ChartData, ChartEvent, ChartOptions, ChartTypeRegistry, Point } from 'chart.js/auto';
import * as helper from 'chart.js/helpers';

export type ClickEvent = number | [number, number] | Point | BubbleDataPoint | null;

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, AfterViewInit {
    @Input() type: keyof ChartTypeRegistry = 'line';
    @Input() data: ChartData<keyof ChartTypeRegistry> = {labels: [], datasets: []};
    @Input() options?: ChartOptions;

    @ViewChild('canvas') canvas?: ElementRef;

    @Output() canvasClick = new EventEmitter<ClickEvent>();

    chart?: Chart;

    constructor() { }

    drawChart() {
        if (this.canvas) {
            if (this.chart) {
                this.chart.destroy();
            }
            this.chart = new Chart(this.canvas.nativeElement, {
                type: this.type,
                data: this.data,
                options: Object.assign({
                    onClick: (e: Event) => {
                        if (!this.chart) {
                            return;
                        }
                        const interaction = this.chart.getElementsAtEventForMode(e, "point", {intersect: true}, true);
                        if (!interaction.length) {
                            return;
                        }
                        const event = this.chart.data.datasets[interaction[0].datasetIndex].data[interaction[0].index];
                        this.canvasClick.emit(event);
                    },
                    intersection: {
                        mode: "nearest"
                    }
                }, (this.options || {}) as any)
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

    @HostListener('window:resize')
    onResize() {
        this.chart?.resize();
    }
}
