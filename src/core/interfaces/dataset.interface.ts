/**
 * The list of filterable genres.
 */
export enum Genre {
    FANTASY = "Fantasy",
    ROMANCE = "Romance",
    HISTORICAL_FICTION = "Historical Fiction",
    MYSTERY = "Mystery",
    SCIENCE_FICTION = "Science Fiction",
    THRILLER = "Thriller",
    NONFICTION = "Nonfiction",
    OTHER = "Other",
}

export type RawDataSet = any; // TODO: TYPE!
export type RawDataPoint = any;

export type PositionedDataPoint = {
    bookData: RawDataPoint;
    x: number;
    y: number;
};
