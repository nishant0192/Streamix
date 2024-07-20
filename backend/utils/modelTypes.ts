import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';

export class Channels extends Model {
    public id!: string;
    public name!: string;
    public channelId!: string;
    public userId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class ChannelStats extends Model {
    public channelId!: string;
    public views!: bigint;
    public likes!: bigint;
    public dislikes!: bigint;
    public shares!: bigint;
    public hoursWatched!: bigint;
    public subscribers!: bigint;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class ChannelSubscribers extends Model {
    public id!: string;
    public channelId!: string;
    public subscriberUserIds!: string[];
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class Comments extends Model {
    public id!: string;
    public videoId!: string;
    public userId!: string;
    public content!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}


export class Dislikes extends Model {
    public id!: string;
    public videoId!: string;
    public userId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class Likes extends Model {
    public id!: string;
    public videoId!: string;
    public userId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class Shares extends Model {
    public id!: string;
    public videoId!: string;
    public userId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class Users extends Model {
    public id!: string;
    public username!: string;
    public email!: string;
    public passwordHash!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class UserStatus extends Model {
    public userId!: string;
    public status!: string | null;
    public lastLoginAt!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}


export class VideoStats extends Model {
    public videoId!: string;
    public views!: bigint;
    public likes!: bigint;
    public dislikes!: bigint;
    public shares!: bigint;
    public hoursWatched!: bigint;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class VideoSubscribers extends Model {
    public id!: string;
    public videoId!: string;
    public subscriberUserIds!: string[];
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class Videos extends Model {
    public id!: string;
    public title!: string;
    public description!: string | null;
    public fileId!: string;
    public extension!: string;
    public channelId!: string;
    public videoPrivacy!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class VideoMetadata extends Model {
    public id!: string;
    public videoId!: string;
    public views!: bigint;
    public likes!: bigint;
    public dislikes!: bigint;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
