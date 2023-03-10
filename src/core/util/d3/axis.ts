import {Chart} from "./chart";
import {D3Axis, D3Selection, Nullable} from "../../interfaces";
import * as d3 from "d3";
import {AxisMap} from "../../interfaces/axis.interface";

export class Axis {

    axes: AxisMap = {
        x: null,
        y: null
    };

    el_x: Nullable<D3Selection> = null;
    el_y: Nullable<D3Selection> = null;

    constructor() {
    }

    set(chart: Chart) {
        this.axes.x = d3.axisBottom(chart.scales.x);
        this.axes.y = d3.axisLeft(chart.scales.y);
    }

    build(chart: Chart) {
        this.set(chart);

        this.el_x = chart.svg.append("g")
            .classed("axis", true)
            .classed("axis-x", true)
            .attr("transform", `translate(0,${chart.scalesParams.ranges.y[0]})`)
            .call(this.axes.x as D3Axis);

        this.el_y = chart.svg.append("g")
            .classed("axis", true)
            .classed("axis-y", true)
            .attr("transform", `translate(${chart.margin_l}, 0)`)
            .call(this.axes.y as D3Axis);
    }

    update(chart: Chart) {
        this.set(chart);
        this.el_x?.transition().duration(500).call(this.axes.x as D3Axis);
        this.el_y?.transition().duration(500).call(this.axes.y as D3Axis);
    }
}
