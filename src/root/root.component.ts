import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";

@Component({
    selector: "otsp-root",
    templateUrl: "./root.component.html",
    styleUrls: ["./root.component.scss"]
})
export class RootComponent implements OnInit {
    @ViewChild("vid", {static: true}) vid!: ElementRef<HTMLVideoElement>;

    displayStartButton = true;
    displayAnimation = true;
    rawDataSet: any | null = null;

    public async ngOnInit(): Promise<void> {
        const res = await fetch("assets/animation.mp4");
        const blob = await res.blob();
        this.vid.nativeElement.src = URL.createObjectURL(blob);

        const response = await fetch("assets/data.json");
        const jsonData = await response.json();
        this.rawDataSet = jsonData;
    }

    hideAnimation() {
        this.displayAnimation = false;
    }
}
