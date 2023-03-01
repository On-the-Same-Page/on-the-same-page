import {
    Component,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from "@angular/core";
import {Genre} from "../../interfaces";

/**
 * This component represents a toggleable image button for genre filters.
 */
@Component({
    selector: "otsp-genre-button",
    templateUrl: "./genre-button.component.html",
    styleUrls: ["./genre-button.component.scss"]
})
export class GenreButtonComponent implements OnChanges {
    // ### Data flow and styling. ###

    // Defines the genre that this button represents.
    // Used to calculate the image URL.
    // Furthermore, as a side-effect, this adds an aria-label to improve accessibility.
    @Input()
    @HostBinding("attr.aria-label")
    genre!: Genre;

    // Offers an input that has two side effects:
    // 1) It re-styles the component in selected state.
    // 2) It adds the aria-selected attribute to improve accessibility.
    @Input()
    @HostBinding("class.selected")
    @HostBinding("attr.aria-selected")
    selected!: boolean;

    // Outputs whenever the button is interacted with by the user.
    @Output() genreSelected = new EventEmitter<Genre>();

    // ### Accessibility attributes. ###

    // Force every instance to be keyboard-interactive. This improves accessibility.
    @HostBinding("tabindex")
    readonly tabindex = 0;

    // Force every instance to have the "button" role. This improves accessibility.
    @HostBinding("role")
    readonly ariaRole = "button";

    // ### Internal state. ###

    // Pre-calculated file-name for the icon (saving regex replace on change detection cycle).
    genreFileName: string = "";

    // Merges the relevant events for interaction into one stream of events.
    @HostListener("keydown.enter")
    @HostListener("keydown.space")
    @HostListener("click")
    onInteract() {
        this.genreSelected.emit(this.genre);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["genre"]) {
            // Update the file name based on the changed genre.
            this.genreFileName = (this.genre ?? "").toLowerCase().replace(/\s/g, "_");
        }
    }
}
