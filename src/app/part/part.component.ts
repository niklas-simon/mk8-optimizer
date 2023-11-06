import { Component, Input, OnInit } from '@angular/core';
import { Part } from '../stats.service';

@Component({
    selector: 'app-part',
    templateUrl: './part.component.html',
    styleUrls: ['./part.component.scss']
})
export class PartComponent implements OnInit {
    @Input() part?: Part;

    constructor() { }

    ngOnInit(): void {
    }

}
