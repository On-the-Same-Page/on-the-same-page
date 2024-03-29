import {D3Selection, Genre, Nullable, PositionedDataPoint, RawDataPoint, RawDataSet} from "../../interfaces";

import * as d3 from "d3";
import {BehaviorSubject, Observable} from "rxjs";

export class Chart {
    svg: D3Selection;

    w: number;
    h: number;
    r: number = 4;

    margin_l: number = 80;
    margin_r: number = 40;
    margin_v: number = 40;

    grid_x0: number = 0;
    grid_y0: number = 0;
    grid_ni: number = 0;
    grid_nj: number = 0;

    min_w: number = 0;
    min_h: number = 0;

    viewBox_h: number = 0;
    viewBox_w: number = 0;

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

        if (window.innerWidth > 1600) {
            this.r = 5;
            this.margin_l = 150;
            this.margin_r = 60;
            this.margin_v = 60;
        }

        this.prepare_grid();

        svg.attr("viewBox", `0 0 ${this.viewBox_w} ${this.viewBox_h}`);

        this.scalesParams = this.generateScaleParameters();

        this.createMarks();
        this.makeOpeningTitle();

        this.monitorHover();
        this.monitorClick();
    }

    prepare_grid() {

        this.grid_ni = Math.max(...this.data.map((d: any) => d.pos1_i)) + 1;
        this.grid_nj = Math.max(...this.data.map((d: any) => d.pos2_j)) + 1;

        this.min_w = this.r * (1 + 2 * this.grid_ni) + 20;
        this.min_h = this.r * (1 + 2 * this.grid_nj) + 20;

        const aspect_ratio = this.min_w / this.min_h;
        let ratio;

        this.viewBox_w = this.w;
        this.viewBox_h = this.h;

        if (this.w < this.min_w) {

            this.viewBox_w = this.min_w;
            ratio = this.min_w / this.w;

            this.viewBox_h = this.h * ratio < this.min_h ? this.min_h : this.h * ratio;

        }
        //this.viewBox_w =  ? this.min_w : this.w;
        //this.viewBox_h = (this.h < this.min_h) ? this.min_h : this.h;


        this.grid_x0 = (this.viewBox_w - this.grid_ni * 2 * this.r) / 2;
        this.grid_y0 = (this.viewBox_h - this.grid_nj * 2 * this.r) / 2;

        console.log(this.grid_ni, this.grid_nj, this.grid_x0, this.grid_y0, this.h);

    }

    createMarks() {
        this.marks = this.svg
            .selectAll("circle.book")
            .data(this.data, (d: any) => d.url)
            .join("circle")
            .classed("book", true)
            .classed("no-force", true)
            .classed("during-animation", true)
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", this.r)
            .attr("transform", (d: any) => {
                d.x = Math.random() * this.viewBox_w;
                d.y = Math.random() * this.viewBox_h;
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
            .attr("transform", (d: any) => `translate(${d.x}, ${d.y})`)
        ;

        this.monitorClick();
        this.monitorHover();

    }

    makeOpeningTitle() {

        this.marks
            ?.classed("no-force", false) // to let D3 handle this first transition
            ?.transition()
            .duration(2000)
            ?.attr("transform", (d: any) => {
                d.x = this.grid_x0 + this.r * (1 + 2 * d.pos1_i);
                d.y = this.grid_y0 + this.r * (1 + 2 * d.pos1_j);
                return `translate(${d.x}, ${d.y})`;
            })
        ;

        this.marks
            ?.transition()
            .delay(4000)
            .duration(2000)
            ?.attr("transform", (d: any) => {
                d.x = this.grid_x0 + this.r * (1 + 2 * d.pos2_i);
                d.y = this.grid_y0 + this.r * (1 + 2 * d.pos2_j);
                return `translate(${d.x}, ${d.y})`;
            })
        ;

        setTimeout(
            () => {
                this.marks?.classed("no-force", true);
                d3.selectAll("select")
                    .classed("mostly-no-show", false)
                    .classed("click-me", true)
                ;
                d3.selectAll(".search-input, .genre-buttons-container, .awards-button-container").classed("mostly-no-show", false);

            }, 6000
        );

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

    updateGenreFilter(genre: Nullable<Genre>, boolAwardHighlight: boolean) {
        if (!genre) {

            if (!boolAwardHighlight) {

                this.marks?.classed("dimmed", false);
                return;

            } else {

                this.marks?.classed("dimmed", d => !d['any_award']);

            }

        } else {

            if (!boolAwardHighlight) {

                this.marks?.classed("dimmed", d => !d[genre]);

            }

            else this.marks?.classed("dimmed", d => !( d[genre] && d['any_award']));

        }

        
    }

    highlightOnTextSearch(term: string): number {

        term = term.trim().toLowerCase();
        let amount = 0;

        this.marks?.classed("searched", (d: any) => {
            if (!term.length) return false;

            const fields = ["title", "single_author"];
            const contains_term = fields
                .map(field => !!(d[field]?.toLowerCase().includes(term)))
                .reduce( (ac, cv) => ac || cv);

            if (contains_term) {
                amount++;
            }

            return contains_term;
        });
        return amount;
    };

    protected generateScaleParameters() {
        return {
            ranges: {
                x: [this.margin_l, this.viewBox_w - this.margin_r],
                y: [this.viewBox_h - this.margin_v, this.margin_v]
            },
            domains: {
                numPages: d3.extent(this.data, (d: any) => d.numPages),//[0, Math.max(...this.data.map((d: any) => d.numPages))],
                avgRating: d3.extent(this.data, (d: any) => d.avgRating),
                ratingsCount: d3.extent(this.data, (d: any) => d.ratingsCount),//[0, Math.max(...this.data.map((d: any) => d.ratingsCount))],
                year_publication: d3.extent(this.data, (d: any) => d.year_publication)
            },
            variables: {
                numPages: "Page count",
                avgRating: "Average rating",
                ratingsCount: "Number of ratings",
                year_publication: "Publication year"
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
