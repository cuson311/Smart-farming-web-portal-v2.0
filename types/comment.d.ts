export type UpdateHistory = {
    _id: string;
    updatedAt: string; // ISO string, can convert to Date if needed
    changes: string[];
};

export type ScriptComment = {
    _id: string;
    content: string;
    script_id: string;
    owner_id: {
        _id: string;
        username: string;
        profile_image: string;
    };
    sub_comment_id: string | null;
    updateHistory: UpdateHistory[];
    createdAt: string;
    updatedAt: string;
    __v: number;
};