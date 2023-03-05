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
import {RangeSliderComponent} from "src/core/components/range-slider/range-slider.component";
import {GenreButtonComponent} from "../core/components/genre-button/genre-button.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
    declarations: [
        RootComponent,
        ExplorativeScatterplotComponent,
        BookTooltipComponent,
        BookTooltipDetailedComponent,
        RangeSliderComponent,
        GenreButtonComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        MatSliderModule,
        MatTooltipModule,
        MatIconModule,
    ],
    providers: [],
    bootstrap: [RootComponent]
})
export class RootModule {
}
