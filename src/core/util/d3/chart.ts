import {D3Selection, Nullable, PositionedDataPoint, RawDataPoint, RawDataSet} from "../../interfaces";

import * as d3 from "d3";
import {BehaviorSubject, Observable} from "rxjs";

export class Chart {
    svg: D3Selection;

    w: number;
    h: number;
    r: number = 4;

    margin: number = 100;
    margin_v: number = 20;

    data: RawDataSet;

    marks: Nullable<D3Selection> = null;

    scalesParams: any; // TODO: Type

    private _hoveredOver$ = new BehaviorSubject<Nullable<PositionedDataPoint>>(null);

    private _clickedOver$ = new BehaviorSubject<Nullable<PositionedDataPoint>>(null);

    constructor(svgElement: SVGSVGElement, data: RawDataSet) {

        this.data = data;

        const svg = d3.select(svgElement);
        this.svg = svg;

        this.w = parseInt(window.getComputedStyle(svgElement).width.slice(0, -2), 10);
        this.h = parseInt(window.getComputedStyle(svgElement).height.slice(0, -2), 10);

        svg.attr("viewBox", `0 0 ${this.w} ${this.h}`);

        this.scalesParams = this.generateScaleParameters();

        this.createMarks();

        this.monitorHover();
        this.monitorClick();
    }

    createMarks() {
        this.marks = this.svg
            .selectAll("circle.book")
            .data(this.data, (d: any) => d.url)
            .join("circle")
            .classed("book", true)
            .classed("no-force", true)
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", this.r)
            .attr("transform", (d: any) => {
                d.x = Math.random() * this.w;
                d.y = Math.random() * this.h;
                return `translate(${d.x}, ${d.y})`;
            });
    }

    updateMarks(new_data: RawDataSet) {

        this.marks = this.svg
            .selectAll("circle.book")
            .data(new_data, (d: any) => d.url)
            .join("circle")
            .classed("book", true)
            .classed("no-force", true)
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", this.r)
            .attr("transform", (d: any) =>`translate(${d.x}, ${d.y})`)
        ;

    }

    updateData(data: RawDataSet) {
        this.data = data;
        this.scalesParams = this.generateScaleParameters();
        this.updateMarks(data);
    }

    monitorHover() {
        this.marks?.on("mouseover", (e) => this.showTooltip(e))
            .on("mouseout", (e) => this.hideTooltip(e));
    }

    monitorClick() {
        this.marks?.on("click", (e) => this.showTooltipDetailed(e));

    }

    hideTooltip(e: any) {
        this._hoveredOver$.next(null);
    }

    showTooltip(e: any) {
        const x = e.x;
        const y = e.y;
        const data = e.target.__data__ as RawDataPoint;
        this._hoveredOver$.next({
            x, y, bookData: data
        });
    }

    showTooltipDetailed(e: any) {
        const x = e.x;
        const y = e.y;
        const data = e.target.__data__ as RawDataPoint;
        this._clickedOver$.next({
            x, y, bookData: data
        });
    }

    protected generateScaleParameters() {
        return {
            ranges: {
                x: [this.margin, this.w - this.margin],
                y: [this.h - this.margin_v, this.margin_v]
            },
            domains: {
                numPages: [0, Math.max(...this.data.map((d: any) => d.numPages))],
                avgRating: [0, 5],
                ratingsCount: [0, Math.max(...this.data.map((d: any) => d.ratingsCount))],
                year_publication: d3.extent(this.data, (d: any) => d.year_publication)
            },
            variables: {
                numPages: "Page count",
                avgRating: "Average rating",
                ratingsCount: "Number of ratings",
                year_publication: "Publication Year"
            },
        };
    }

    public get hoveredOverBook$(): Observable<Nullable<PositionedDataPoint>> {
        return this._hoveredOver$.asObservable();
    }

    public get clickedOverBook$(): Observable<Nullable<PositionedDataPoint>> {
        return this._clickedOver$.asObservable();
    }

    // TODO: Convert this to more conventional class usage
    scales = {
        x: d3.scaleLinear(),
        y: d3.scaleLinear(),
        set(ref: Chart, variable: string, dimension: "x" | "y") {
            ref.scales[dimension]
                .range(ref.scalesParams.ranges[dimension])
                .domain(ref.scalesParams.domains[variable]);
        }
    };
}
