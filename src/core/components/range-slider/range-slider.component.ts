import {Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges} from "@angular/core";

@Component({
    selector: "otsp-range-slider",
    templateUrl: "./range-slider.component.html",
    styleUrls: ["./range-slider.component.scss"]
})
export class RangeSliderComponent implements OnChanges {
    @Input()
    lowerBound: number = 0;
    @Input()
    upperBound: number = 300;
    @Input()
    step: number = 1;
    @Input()
    @HostBinding("style.--otsp-range-slider-color")
    color: string = "#A2D2FF";
    @Output()
    maxChanged = new EventEmitter<number>();
    @Output()
    minChanged = new EventEmitter<number>();
    numberMax: number = 150;
    numberMin: number = 3;

    handleMaxChanged(max: number) {
        if (max < this.numberMin) {
            max = this.numberMin;
        }

        this.numberMax = max ?? 0;

        this.maxChanged.emit(max ?? 0);
    }

    handleMinChanged(min: number) {
        if (min > this.numberMax) {
            min = this.numberMax;
        }
        this.numberMin = min ?? 0;
        this.minChanged.emit(min ?? 0);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["lowerBound"]) {
            this.handleMinChanged(this.lowerBound);

            if (this.numberMax < this.lowerBound) {
                this.handleMaxChanged(this.lowerBound);
            }
        }

        if (changes["upperBound"]) {
            this.handleMaxChanged(this.upperBound);

            if (this.numberMin > this.upperBound) {
                this.handleMinChanged(this.upperBound);
            }
        }
    }
}






