export type Script = {
    _id: string;
    name: string;
    description: string;
    privacy: "public" | "private";
    favorite: number;
    location: string[];
    plant_type: string[];
    isFavorite: boolean;
};
