import { AfterViewInit, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Combination } from '../stats.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-combin-list',
    templateUrl: './combin-list.component.html',
    styleUrls: ['./combin-list.component.scss']
})
export class CombinListComponent implements OnInit, AfterViewInit {
    @Input() combins: Combination[] = [];

    @ViewChild(MatPaginator) paginator?: MatPaginator;

    tableData = new MatTableDataSource<Combination>(this.combins);
    displayedColumns = ["score", "driver", "body", "tire", "glider"];

    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        if (this.paginator) this.tableData.paginator = this.paginator;
        this.tableData.data = this.combins;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['combins'].currentValue && this.paginator) {
            this.tableData.data = this.combins;
        }
    }
}
