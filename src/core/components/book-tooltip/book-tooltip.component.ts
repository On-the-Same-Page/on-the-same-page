import {Component, HostBinding, Input} from "@angular/core";
import { variable_names } from "src/core/util/dictionaries";
import {Nullable, PositionedDataPoint} from "../../interfaces";

@Component({
    selector: "otsp-book-tooltip",
    templateUrl: "./book-tooltip.component.html",
    styleUrls: ["./book-tooltip.component.scss"]
})
export class BookTooltipComponent {
    @Input() book: Nullable<PositionedDataPoint> = null;

    @Input() xAxisVariable!: string;
    @Input() yAxisVariable!: string;

    @HostBinding("style.top.px")
    get bookPositionX(): number {
        return (this.book?.y ?? 0) + 10;
    }

    @HostBinding("style.left.px")
    get bookPositionY(): number {
        return (this.book?.x ?? 0) + 10;
    }

    format_number(value: any) {
        const number = new Intl.NumberFormat("en-US");
        return number.format(value);
    }

    readonly variableNames:any = variable_names;
}
