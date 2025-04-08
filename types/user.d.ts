type UserLink = {
    type: string;
    link: string;
};

export type UserProfile = {
    _id: string;
    username: string;
    links: UserLink[];
    profile_image: string;
    follower?: number;
    following?: number;
    bio?: string
};

export type UserActivity = {
    [month: string]: {
        create_script?: {
            _id: string;
            name: string;
        }[];
        create_model?: {
            _id: string;
            name: string;
        }[];
        create_comment?: {
            _id: string;
            content: string;
            script_id: {
                _id: string;
                name: string;
            };
        }[];
    };
};

export type UserNotify = {
    _id: string;
    type: string;
    from: {
        _id: string;
        username: string;
        profile_image: string;
    };
    to: string;
    script_id: {
        _id: string;
        name: string;
    } | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
