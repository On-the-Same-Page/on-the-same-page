import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from "@angular/core";
import {Nullable, PositionedDataPoint, RawDataSet} from "../../interfaces";
import {Chart} from "../../util/d3/chart";
import {Simulation} from "../../util/d3/simulation";
import {Axis} from "../../util/d3/axis";

import * as d3 from "d3";
import {BehaviorSubject} from "rxjs";

@Component({
    selector: "otsp-explorative-scatterplot",
    templateUrl: "./explorative-scatterplot.component.html",
    styleUrls: ["./explorative-scatterplot.component.scss"]
})
export class ExplorativeScatterplotComponent implements OnChanges {
    @ViewChild("mainChart", {static: true})
    mainChart!: ElementRef<SVGSVGElement>;

    @Input() rawDataSet: Nullable<RawDataSet> = null;

    xAxisVariable: string = "initial";
    yAxisVariable: string = "initial";
    forceEnabled: boolean = false;


    chart: Nullable<Chart> = null;
    simulation: Nullable<Simulation> = null;
    axis: Nullable<Axis> = null;

    tooltipBook$ = new BehaviorSubject<Nullable<PositionedDataPoint>>(null);
    tooltipBookDetailed$ = new BehaviorSubject<Nullable<PositionedDataPoint>>(null);

    ngOnChanges(changes: SimpleChanges): void {
        // If we have changes in the data and most importantly, data present, we go on to update the rendered chart.
        if (changes["rawDataSet"] && this.rawDataSet) {
            this.updateChart();
        }
    }

    private updateChart(): void {
        if (!this.chart) {
            this.chart = new Chart(this.mainChart.nativeElement, this.rawDataSet);
            this.simulation = new Simulation(this.rawDataSet, this.chart);
            this.axis = new Axis();
            this.simulation.restart();

            // TODO: add takeUntil for destroyed$
            this.chart.hoveredOverBook$.subscribe(c => this.tooltipBook$.next(c));
            this.chart.clickedOverBook$.subscribe(c => this.tooltipBookDetailed$.next(c));
        }
    }

    private render() {
        if (!this.chart || !this.axis || !this.simulation) {
            return;
        }

        // include test to avoid setting up and updating even when the axis are unchanged?
        this.chart.scales.set(this.chart, this.xAxisVariable, "x");
        this.chart.scales.set(this.chart, this.yAxisVariable, "y");

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
}
