import {Component} from "@angular/core";

@Component({
    selector: "otsp-authors-modal",
    templateUrl: "./authors-modal.component.html",
    styleUrls: ["./authors-modal.component.scss"]
})
export class AuthorsModalComponent {
    readonly AUTHORS_DATA = [{
        name: "Maria Zelenika",
        email: "zelenika@kth.se",
        work: ["Art", "UI / UX design", "User test"],
        book: "Storm and Silence"
    }, {
        name: "Markus Wagner",
        email: "wagn@kth.se",
        work: ["Data handling & processing", "Frontend development", "UI / UX design"],
        book: "What if?"
    }, {
        name: "Tiago M B Pereira",
        email: "tiagombp@kth.se",
        work: ["Data handling & processing", "Frontend development", "User test"],
        book: "Jonathan Strange & Mr. Norrell"
    }, {
        name: "Rurik Högberg",
        email: "rurikho@kth.se",
        work: ["Data handling & processing", "UI / UX design", "User test"],
        book: "Confessions of an Heiress"
    }, {
        name: "Wanqing Zhou",
        email: "wanqingz@kth.se",
        work: ["Data handling & processing", "Art", "UI / UX design"],
        book: "The Romance of the Three Kingdoms"
    }];
}
