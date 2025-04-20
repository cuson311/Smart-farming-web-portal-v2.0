import { vietnamProvinces, plantTypes } from "@/lib/constants";

export type locationType = (typeof vietnamProvinces)[number];
export type plantType = (typeof plantTypes)[number];
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
    location: locationType[];
    plant_type: plantType[];
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
    location?: locationType[];
    plant_type?: plantType[];
}

export type ScriptsListOptions = {
    limit?: string;
    page?: string;
    locations?: locationType[];
    plant_types?: plantType[];
    sortBy?: string;
    order?: 'asc' | 'desc';
    privacy?: string
};

export interface ScriptsResponse {
    data: Script[];
    total: number;
    page: number;
    totalPages: number;
}