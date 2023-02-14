import {Component, OnInit} from "@angular/core";

@Component({
    selector: "otsp-root",
    templateUrl: "./root.component.html",
    styleUrls: ["./root.component.scss"]
})
export class RootComponent implements OnInit {
    rawDataSet: any | null = null;

    public async ngOnInit(): Promise<void> {
        const response = await fetch("assets/data.json");
        const jsonData = await response.json();
        this.rawDataSet = jsonData;
    }
}
