type UserLink = {
    type: string;
    link: string;
};

export type UserProfile = {
    _id: string;
    username: string;
    links: UserLink[];
    profile_image: string;
};
