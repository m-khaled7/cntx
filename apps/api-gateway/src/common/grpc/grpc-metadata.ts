import { Metadata } from '@grpc/grpc-js';

import { USER_ID_METADATA_KEY } from '../auth/auth.constants.js';

export function createUserIdMetadata(userId: string): Metadata {
    const metadata = new Metadata();
    metadata.add(USER_ID_METADATA_KEY, userId);
    return metadata;
}

