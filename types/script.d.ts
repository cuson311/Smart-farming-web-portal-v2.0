export interface Script {
    _id: string;
    name: string;
    description: string;
    privacy: "public" | "private";
    owner_id: string;
    version: number[];
    model_id?: string;
    share_id?: string[];
    favorite: number;
    location: string[];
    plant_type: string[];
    rating: {
        avg: number,
        count: number,
        _id: string
    },
    createdAt: string,
    updatedAt: string,
    isFavorite: boolean;
};
export interface NewScriptData {
    name: string;
    description: string;
    privacy: "public" | "private";
    share_id: string[];
}

export type ScriptsListOptions = {
    limit?: string;
    page?: string;
    locations?: string[];
    plant_types?: string[];
    sortBy?: string;
    order?: 'asc' | 'desc';
};
