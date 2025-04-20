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

export type NotiInfo = {
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

export type UserNotify = {
    data: NotiInfo[];
    total: number,
    page: string,
    totalPages: number,
}

export type NotificationQueryParams = {
    notifyId?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
}

export type UserScriptRate = {
    _id: string,
    user_id: string,
    script_id: string,
    rate: number,
    __v: number
}