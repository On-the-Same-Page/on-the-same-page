import {Component, Output, EventEmitter} from "@angular/core";

@Component({
    selector: "otsp-about-modal",
    templateUrl: "./about-modal.component.html",
    styleUrls: ["./about-modal.component.scss"]
})
export class AboutModalComponent {

    @Output() closeRequested = new EventEmitter<void>();

}
