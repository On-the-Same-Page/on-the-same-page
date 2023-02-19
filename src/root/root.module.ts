import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {RootComponent} from "./root.component";
import {
    ExplorativeScatterplotComponent
} from "../core/components/explorative-scatterplot/explorative-scatterplot.component";
import {FormsModule} from "@angular/forms";
import {BookTooltipComponent} from "../core/components/book-tooltip/book-tooltip.component";
import {BookTooltipDetailedComponent} from "src/core/components/book-tooltip-detailed/book-tooltip-detailed.component";
import {MatSliderModule} from "@angular/material/slider";

@NgModule({
    declarations: [
        RootComponent,
        ExplorativeScatterplotComponent,
        BookTooltipComponent,
        BookTooltipDetailedComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        MatSliderModule,
    ],
    providers: [],
    bootstrap: [RootComponent]
})
export class RootModule {
}
