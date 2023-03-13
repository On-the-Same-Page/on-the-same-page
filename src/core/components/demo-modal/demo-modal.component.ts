import {Component, Output, EventEmitter} from "@angular/core";

@Component({
    selector: "otsp-demo-modal",
    templateUrl: "./demo-modal.component.html",
    styleUrls: ["./demo-modal.component.scss"]
})
export class DemoModalComponent {

    @Output() closeRequested = new EventEmitter<void>();
    
}
