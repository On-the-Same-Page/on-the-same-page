import {Component, Output, EventEmitter} from "@angular/core";

@Component({
    selector: "otsp-authors-modal",
    templateUrl: "./authors-modal.component.html",
    styleUrls: ["./authors-modal.component.scss"]
})
export class AuthorsModalComponent {

    @Output() closeRequested = new EventEmitter<void>();
    
    readonly AUTHORS_DATA = [{
        name: "Maria Zelenika",
        email: "zelenika@kth.se",
        work: ["Art", "UI / UX design", "User test"],
        book: "Storm and Silence",
        url: "https://www.goodreads.com/book/show/24035804-storm-and-silence"
    }, {
        name: "Markus Wagner",
        email: "wagn@kth.se",
        work: ["Data handling & processing", "Frontend development", "UI / UX design"],
        book: "What if?",
        url: "https://www.goodreads.com/book/show/21413662-what-if-serious-scientific-answers-to-absurd-hypothetical-questions"
    }, {
        name: "Tiago M B Pereira",
        email: "tiagombp@kth.se",
        work: ["Data handling & processing", "Frontend development", "User test"],
        book: "Jonathan Strange & Mr. Norrell",
        url: "https://www.goodreads.com/book/show/14201.Jonathan_Strange_Mr_Norrell"
    }, {
        name: "Rurik Högberg",
        email: "rurikho@kth.se",
        work: ["Data handling & processing", "UI / UX design", "User test"],
        book: "Confessions of an Heiress",
        url: "https://www.goodreads.com/book/show/87564.Confessions_of_an_Heiress"
    }, {
        name: "Wanqing Zhou",
        email: "wanqingz@kth.se",
        work: ["Data handling & processing", "Art", "UI / UX design"],
        book: "The Romance of the Three Kingdoms",
        url: "https://www.goodreads.com/book/show/42634134-the-romance-of-the-three-kingdoms"
    }];
}
