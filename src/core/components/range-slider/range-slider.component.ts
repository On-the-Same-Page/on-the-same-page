import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "otsp-range-slider",
    templateUrl: "./range-slider.component.html",
    styleUrls: ["./range-slider.component.scss"]

})
export class RangeSliderComponent{
    @Input()
    lowerBound: number = 0; 
    @Input()
    upperBound: number = 300;
    @Output()
    maxChanged = new EventEmitter <number>();
    @Output()
    minChanged = new EventEmitter <number>();
    numberMax: number = 150;
    numberMin: number = 3;   
    handleMaxChanged(max:number){
        this.numberMax = max ?? 0;
        this.maxChanged.emit(max ?? 0);
    }
    handleMinChanged(min:number){
        this.numberMin = min ?? 0;
        this.minChanged.emit(min ?? 0);
    }
    
}






