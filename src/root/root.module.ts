import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {RootComponent} from "./root.component";
import {GenreScatterplotComponent} from "../core/components/genre-scatterplot/genre-scatterplot.component";

@NgModule({
    declarations: [
        RootComponent,
        GenreScatterplotComponent,
    ],
    imports: [
        BrowserModule,
    ],
    providers: [],
    bootstrap: [RootComponent]
})
export class RootModule {
}
