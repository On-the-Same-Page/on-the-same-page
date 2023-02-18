import {D3Axis} from "./d3-compat.interface";
import {Nullable} from "./generic.interface";

export enum AxisType {
    X = "x",
    Y = "y",
}

export type AxisMap = {
    [name in AxisType]: Nullable<D3Axis>;
};
