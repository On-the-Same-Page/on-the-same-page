import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from "@angular/core";

import * as d3 from "d3";

/**
 * @deprecated
 */
@Component({
    selector: "otsp-genre-scatterplot",
    templateUrl: "./genre-scatterplot.component.html",
    styleUrls: ["./genre-scatterplot.component.scss"]
})
export class GenreScatterplotComponent implements OnChanges {
    @ViewChild("mainChart", {static: true})
    mainChart!: ElementRef<SVGSVGElement>;

    @Input() rawDataSet!: any | null;

    ngOnChanges(changes: SimpleChanges): void {
        // If we have changes in the data and most importantly, data present, we go on to update the rendered chart.
        if (changes["rawDataSet"] && this.rawDataSet) {
            this.updateChart();
        }
    }

    private updateChart(): void {
        const filteredData = this.rawDataSet.filter((a: any) => a.year_publication >= 1900);

        const computedStyle = window.getComputedStyle(this.mainChart.nativeElement);
        const width = parseInt(computedStyle.width.slice(0, -2), 10);
        const height = parseInt(computedStyle.height.slice(0, -2), 10);
        const margin = 50;

        const a1 = "year_publication";
        const a2 = "numPages";
        const a3 = "avgRating";

        const scaleX = d3.scaleLinear()
            .range([margin, width - margin])
            .domain(d3.extent(filteredData, (d: any) => d[a1]) as any);

        const scaleY = d3.scaleLinear()
            .range([height - margin, margin])
            .domain(d3.extent(filteredData, (d: any) => d[a2]) as any);

        const scaleColor = d3.scaleSequential()
            .interpolator(d3.interpolateMagma)
            .domain(d3.extent(filteredData, (d: any) => d[a3]) as any);



        const axisX = d3.axisBottom(scaleX);
        const axisY = d3.axisLeft(scaleY);

        d3.select(this.mainChart.nativeElement)
            .append("g")
            .classed("axis", true)
            .attr("transform", `translate(0, ${height - margin})`)
            .call(axisX);

        d3.select(this.mainChart.nativeElement)
            .append("g")
            .classed("axis", true)
            .attr("transform", `translate(${margin})`)
            .call(axisY)    ;

        d3.select(this.mainChart.nativeElement)
            .selectAll("circle.book")
            .data(filteredData)
            .join("circle")
            .classed("book", true)
            .attr("cx", (d: any) => scaleX(d[a1]))
            .attr("cy", (d: any) => scaleY(d[a2]))
            .attr("fill", (d: any) => scaleColor(d[a3]))
            .attr("r", 5);
    }
}
