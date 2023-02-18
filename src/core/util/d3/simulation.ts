import {RawDataSet} from "../../interfaces";
import {Chart} from "./chart";

import * as d3 from "d3";

export class Simulation {

    sim: d3.Simulation<any, any>;
    force_is_on = false;
    strength = 0.06;

    constructor(data: RawDataSet, chart: Chart) {

        /*this.button_el = document.querySelector(button_ref) as HTMLElement;
        this.button_monitor();*/


        this.sim = d3.forceSimulation();
        this.sim.nodes(data);
        this.applySimulation(chart);

    }

    applySimulation(chart: Chart) {
        this.sim
            .velocityDecay(0.2)
            .force("x", d3.forceX().strength(this.strength / 2).x(chart.w / 2))
            .force("y", d3.forceY().strength(this.strength / 2).y(chart.h / 2))
            .force("collision", d3.forceCollide().strength(this.strength * 4).radius(chart.r))
            .alphaMin(0.25)//.alphaMin(0.05)
            .on("tick", this.update)
            .on("end", this.savePositions)
            .stop();
    }

    private savePositions() {

    }

    private update() {
        d3.selectAll(".book")
            .attr("transform", (d: any) => `translate(${d.x}, ${d.y})`);
    }

    restart() {
        this.sim.alpha(1).restart();
    }

    stop() {
        this.sim.stop();
    }

    /*
    button_monitor() {

        this.button_el.addEventListener("click", e => this.button_handler(e, this));

    }

    button_handler(e) {

        this.button_el.classList.toggle("clicked");
        this.force_is_on = !this.force_is_on;
        state.force = !state.force;
        render(this.chart_ref, state.ref_to_axis, state.y_variable, state.x_variable, state.force);

    }
     */

}
