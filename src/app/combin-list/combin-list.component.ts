import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Combination, StatsService } from '../stats.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SettingsService } from '../settings.service';

// blue red cyan orange purple yellow teal deep_orange light_green pink light_blue lime indigo amber deep_purple green
const colors = ["#2196F3", "#F44336", "#00BCD4", "#FF9800", "#9C27B0", "#FFEB3B", "#009688", "#FF5722", "#8BC34A", "#E91E63", "#03A9F4", "#CDDC39", "#3F51B5", "#FFC107", "#673AB7", "#4CAF50"]

@Component({
    selector: 'app-combin-list',
    templateUrl: './combin-list.component.html',
    styleUrls: ['./combin-list.component.scss']
})
export class CombinListComponent implements OnInit, AfterViewInit {
    combins: Combination[] = [];

    @ViewChild(MatPaginator) paginator?: MatPaginator;

    @Output() onSelection = new EventEmitter<Combination[]>();

    tableData = new MatTableDataSource<Combination>([]);
    displayedColumns = ["selected", "score", "driver", "body", "tire", "glider"];

    constructor(private statsService: StatsService, private settingsService: SettingsService) { }

    ngOnInit(): void {
        this.statsService.getSubject().subscribe(combins => {
            this.combins = combins;
            this.changeSelection(this.combins[0]);
            if (this.paginator) {
                this.tableData.data = this.combins;
            }
        });
    }

    ngAfterViewInit(): void {
        if (this.paginator) this.tableData.paginator = this.paginator;
        this.tableData.data = this.combins;
    }

    changeSelection(e: Combination) {
        if (e.color) {
            e.color = undefined;
            this.onSelection.emit(this.combins.filter(c => c.color));
        } else {
            const selected = this.combins.filter(c => c.color);
            e.color = colors[selected.length % colors.length];
            selected.push(e);
            this.onSelection.emit(selected);
        }
    }
}
