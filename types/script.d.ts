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
    isFavorite: boolean;
};
export interface NewScriptData {
    name: string;
    description: string;
    privacy: "public" | "private";
    share_id: string[];
}