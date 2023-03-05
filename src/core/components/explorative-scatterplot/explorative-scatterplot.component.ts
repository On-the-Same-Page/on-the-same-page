import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from "@angular/core";
import {Genre, Nullable, PositionedDataPoint, RawDataSet} from "../../interfaces";
import {Chart} from "../../util/d3/chart";
import {Simulation} from "../../util/d3/simulation";
import {Axis} from "../../util/d3/axis";

import * as d3 from "d3";
import {BehaviorSubject, debounceTime, merge} from "rxjs";

@Component({
    selector: "otsp-explorative-scatterplot",
    templateUrl: "./explorative-scatterplot.component.html",
    styleUrls: ["./explorative-scatterplot.component.scss"]
})
export class ExplorativeScatterplotComponent implements OnChanges, OnInit {
    readonly GENRE_LIST: Genre[] = Object.values(Genre);

    @ViewChild("mainChart", {static: true})
    mainChart!: ElementRef<SVGSVGElement>;

    @Input() rawDataSet: Nullable<RawDataSet> = null;

    xAxisVariable: string = "initial";
    yAxisVariable: string = "initial";
    forceEnabled: boolean = false;

    chart: Nullable<Chart> = null;
    simulation: Nullable<Simulation> = null;
    axis: Nullable<Axis> = null;

    never_rendered: boolean = true;

    tooltipBook$ = new BehaviorSubject<Nullable<PositionedDataPoint>>(null);
    tooltipBookDetailed$ = new BehaviorSubject<Nullable<PositionedDataPoint>>(null);

    yearUpperBound: number = 0;
    yearLowerBound: number = 0;

    ratingsCountUpperBound: number= 0;
    ratingsCountLowerBound: number= 0;

    numPagesUpperBound: number= 0;
    numPagesLowerBound: number= 0;

    avgRatingUpperBound: number= 0;
    avgRatingLowerBound: number= 0;

    yearMax$ = new BehaviorSubject<number>(0);
    yearMin$ = new BehaviorSubject<number>(0);

    ratingsCountMax$ = new BehaviorSubject<number>(0);
    ratingsCountMin$ = new BehaviorSubject<number>(0);

    numPagesMax$ = new BehaviorSubject<number>(0);
    numPagesMin$ = new BehaviorSubject<number>(0);

    avgRatingMax$ = new BehaviorSubject<number>(0);
    avgRatingMin$ = new BehaviorSubject<number>(0);

    genreFilter: Nullable<Genre> = null;

    ngOnInit(): void {
        merge(this.yearMax$,this.yearMin$, this.ratingsCountMax$, this.ratingsCountMin$, this.numPagesMax$, this.numPagesMin$, this.avgRatingMax$, this.avgRatingMin$).pipe(
            debounceTime(100)
        ).subscribe(() => this.render());
    }

    ngOnChanges(changes: SimpleChanges): void {
        // If we have changes in the data and most importantly, data present, we go on to update the rendered chart.
        if (changes["rawDataSet"] && this.rawDataSet) {
            this.calculateDataBounds();
            this.updateChart();
        }
    }

    public toggleGenre(genre: Genre) {
        if (this.genreFilter === genre) {
            this.genreFilter = null;
        } else {
            this.genreFilter = genre;
        }
        this.chart?.updateGenreFilter(this.genreFilter);
    }

    private calculateDataBounds() {
        const [yearLowerBound, yearUpperBound] = d3.extent(this.rawDataSet, (d: any) => d.year_publication);
        this.yearLowerBound = yearLowerBound as unknown as number;
        this.yearUpperBound = yearUpperBound as unknown as number;
        this.yearMin$.next(yearLowerBound as unknown as number);
        this.yearMax$.next(yearUpperBound as unknown as number);

        const [ratingsCountLowerBound, ratingsCountUpperBound] = d3.extent(this.rawDataSet, (d: any) => d.ratingsCount);
        this.ratingsCountLowerBound = ratingsCountLowerBound as unknown as number;
        this.ratingsCountUpperBound = ratingsCountUpperBound as unknown as number;
        this.ratingsCountMin$.next(ratingsCountLowerBound as unknown as number);
        this.ratingsCountMax$.next(ratingsCountUpperBound as unknown as number);

        const [numPagesLowerBound, numPagesUpperBound] = d3.extent(this.rawDataSet, (d: any) => d.numPages);
        this.numPagesLowerBound = numPagesLowerBound as unknown as number;
        this.numPagesUpperBound = numPagesUpperBound as unknown as number;
        this.numPagesMin$.next(numPagesLowerBound as unknown as number);
        this.numPagesMax$.next(numPagesUpperBound as unknown as number);


        const [avgRatingLowerBound, avgRatingUpperBound] = d3.extent(this.rawDataSet, (d: any) => d.avgRating);
        this.avgRatingLowerBound = avgRatingLowerBound as unknown as number;
        this.avgRatingUpperBound = avgRatingUpperBound as unknown as number;
        this.avgRatingMin$.next(avgRatingLowerBound as unknown as number);
        this.avgRatingMax$.next(avgRatingUpperBound as unknown as number);
    }

    private updateChart(): void {
        if (!this.chart) {
            this.chart = new Chart(this.mainChart.nativeElement, this.rawDataSet);
            this.simulation = new Simulation(this.rawDataSet, this.chart);
            this.axis = new Axis();
            //this.simulation.restart();

            // TODO: add takeUntil for destroyed$
            this.chart.hoveredOverBook$.subscribe(c => this.tooltipBook$.next(c));
            this.chart.clickedOverBook$.subscribe(c => this.tooltipBookDetailed$.next(c));
        }
    }

    private render() {
        if (!this.chart || !this.axis || !this.simulation || this.xAxisVariable == "initial" || this.yAxisVariable == "initial") {
            return;
        }

        const filteredData = (this.rawDataSet as any[])
            .filter(dp => dp.year_publication >= this.yearMin$.value && dp.year_publication <= this.yearMax$.value)
            .filter(dp => dp.ratingsCount >= this.ratingsCountMin$.value && dp.ratingsCount <= this.ratingsCountMax$.value)
            .filter(dp => dp.numPages >= this.numPagesMin$.value && dp.numPages <= this.numPagesMax$.value)
            .filter(dp => dp.avgRating >= this.avgRatingMin$.value && dp.avgRating <= this.avgRatingMax$.value);
        this.chart.updateData(filteredData);

        // include test to avoid setting up and updating even when the axis are unchanged?
        this.chart.scales.set(this.chart, this.xAxisVariable, "x");
        this.chart.scales.set(this.chart, this.yAxisVariable, "y");

        //
        if(this.never_rendered) {
            document.querySelector("h1")?.classList.remove("no-show");
            this.never_rendered = false;
        }

        if (!this.axis.el_x && !this.axis.el_y) {
            this.axis.build(this.chart);
        } else {
            this.axis.update(this.chart);
        }

        if (!this.forceEnabled) {
            this.simulation.stop();

            this.chart.marks?.classed("no-force", true)
                .attr("transform", (d: any) => {

                    // updating d.x and d.y so that there's no jump when alternating between
                    // force movement and transition movement

                    d.x = (this.chart as any).scales["x"](d[this.xAxisVariable]);
                    d.y = (this.chart as any).scales["y"](d[this.yAxisVariable]);

                    return `translate(${d.x}, ${d.y})`;
                });
        } else {
            this.chart.marks?.classed("no-force", false);

            const strength = this.simulation.strength;

            this.simulation.sim
                .force("x", d3.forceX().strength(strength / 2).x((d: any) => (this.chart as Chart).scales.x(d[this.xAxisVariable])))
                .force("y", d3.forceY().strength(strength / 2).y((d: any) => (this.chart as Chart).scales.y(d[this.yAxisVariable])));

            this.simulation.restart();
        }
    }

    public yAxisVariableChanged(newValue: string) {
        this.yAxisVariable = newValue;
        this.render();
    }

    public xAxisVariableChanged(newValue: string) {
        this.xAxisVariable = newValue;
        this.render();
    }

    toggleForce() {
        this.forceEnabled = !this.forceEnabled;
        this.render();
    }

    changeYearMin(lowerBound: number) {
        this.yearMin$.next(lowerBound);
    }

    changeYearMax(upperBound: number) {
        this.yearMax$.next(upperBound);
    }

    changeRatingsCountMin(lowerBound: number) {
        this.ratingsCountMin$.next(lowerBound);
    }

    changeRatingsCountMax(upperBound: number) {
        this.ratingsCountMax$.next(upperBound);
    }

    changeNumPagesMax(upperBound: number) {
        this.numPagesMax$.next(upperBound);
    }

    changeNumPagesMin(lowerBound: number) {
        this.numPagesMin$.next(lowerBound);
    }

    changeAvgRatingMax(upperBound: number) {
        this.avgRatingMax$.next(upperBound);
    }

    changeAvgRatingMin(lowerBound: number) {
        this.avgRatingMin$.next(lowerBound);
    }
}
