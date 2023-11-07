import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Combination, StatsService } from '../stats.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SettingsService } from '../settings.service';

@Component({
    selector: 'app-combin-list',
    templateUrl: './combin-list.component.html',
    styleUrls: ['./combin-list.component.scss']
})
export class CombinListComponent implements OnInit, AfterViewInit {
    combins: Combination[] = this.statsService.get();

    @ViewChild(MatPaginator) paginator?: MatPaginator;

    @Output() onSelection = new EventEmitter<Combination[]>();

    tableData = new MatTableDataSource<Combination>([]);
    displayedColumns = ["selected", "score", "driver", "body", "tire", "glider"];

    constructor(private statsService: StatsService, private settingsService: SettingsService) { }

    ngOnInit(): void {
        this.settingsService.getSubject().subscribe(s => {
            this.combins = this.statsService.get();
            this.combins[0].selected = true;
            this.tableData.data = this.combins;
            this.changeSelection();
        });
        this.combins[0].selected = true;
        this.changeSelection();
    }

    ngAfterViewInit(): void {
        if (this.paginator) this.tableData.paginator = this.paginator;
        this.tableData.data = this.combins;
    }

    changeSelection() {
        this.onSelection.emit(this.combins.filter(c => c.selected));
    }
}
