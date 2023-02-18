import {Component, HostBinding, Input} from "@angular/core";
import {Nullable, PositionedDataPoint} from "../../interfaces";

@Component({
    selector: "otsp-book-tooltip",
    templateUrl: "./book-tooltip.component.html",
    styleUrls: ["./book-tooltip.component.scss"]
})
export class BookTooltipComponent {
    @Input() book: Nullable<PositionedDataPoint> = null;

    @HostBinding("style.top.px")
    get bookPositionX(): number {
        return (this.book?.y ?? 0) + 10;
    }

    @HostBinding("style.left.px")
    get bookPositionY(): number {
        return (this.book?.x ?? 0) + 10;
    }
}
