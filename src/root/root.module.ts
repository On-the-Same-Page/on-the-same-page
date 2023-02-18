import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {RootComponent} from "./root.component";
import {GenreScatterplotComponent} from "../core/components/genre-scatterplot/genre-scatterplot.component";
import {
    ExplorativeScatterplotComponent
} from "../core/components/explorative-scatterplot/explorative-scatterplot.component";
import {FormsModule} from "@angular/forms";
import {BookTooltipComponent} from "../core/components/book-tooltip/book-tooltip.component";

@NgModule({
    declarations: [
        RootComponent,
        GenreScatterplotComponent,
        ExplorativeScatterplotComponent,
        BookTooltipComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
    ],
    providers: [],
    bootstrap: [RootComponent]
})
export class RootModule {
}
