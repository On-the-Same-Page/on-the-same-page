/**
 * The list of filterable genres.
 */
export enum Genre {
    SCIENCE_FICTION = "Science Fiction",
    HISTORICAL_FICTION = "Historical Fiction",
    NOVELS = "Novels",
    THRILLER = "Thriller",
    MYSTERY = "Mystery",
    ROMANCE = "Romance",
    FANTASY = "Fantasy",
    NONFICTION = "Nonfiction",
}

export type RawDataSet = any; // TODO: TYPE!
export type RawDataPoint = any;

export type PositionedDataPoint = {
    bookData: RawDataPoint;
    x: number;
    y: number;
};
