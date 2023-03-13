import {Component, HostBinding, Input, Output, EventEmitter} from "@angular/core";
import { variable_names } from "src/core/util/dictionaries";
import {Nullable, PositionedDataPoint} from "../../interfaces";

@Component({
    selector: "otsp-book-tooltip-detailed",
    templateUrl: "./book-tooltip-detailed.component.html",
    styleUrls: ["./book-tooltip-detailed.component.scss"]
})
export class BookTooltipDetailedComponent {
    @Input() book: Nullable<PositionedDataPoint> = null;

    @Input() xAxisVariable!: string;
    @Input() yAxisVariable!: string;

    @Output() closeRequested = new EventEmitter<void>();

    /*
    @HostBinding("style.top.px")
    get bookPositionX(): number {
        return (this.book?.y ?? 0) + 10;
    }

    @HostBinding("style.left.px")
    get bookPositionY(): number {
        return (this.book?.x ?? 0) + 10;
    }*/

    readonly variableNames:any = variable_names;
}