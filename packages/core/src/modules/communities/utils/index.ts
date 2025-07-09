import { ROLES } from "../types";

export type CommunityRole = (typeof ROLES)[keyof typeof ROLES]; // "owner" | "member" | ...
export type CommunityType = "Topic" | "Journal" | "Council";

/**
 * Determine community type based on its `name` or `type_id`
 */
export function getCommunityType(name: string, type_id: number): CommunityType {
    if (name.startsWith("hive-3") || type_id === 3) return "Council";
    if (name.startsWith("hive-2") || type_id === 2) return "Journal";
    return "Topic";
}

/**
 * Compute permissions for a given user role in a community
 */
export function getCommunityPermissions({
    communityType,
    userRole,
    subscribed,
}: {
    communityType: CommunityType;
    userRole: CommunityRole;
    subscribed: boolean;
}) {
    const canPost = (() => {
        if (userRole === ROLES.MUTED) return false;

        if (communityType === "Topic") return true;

        // Journal & Council
        return [ROLES.OWNER, ROLES.ADMIN, ROLES.MOD, ROLES.MEMBER].includes(userRole);
    })();

    const canComment = (() => {
        if (userRole === ROLES.MUTED) return false;

        switch (communityType) {
            case "Topic":
                return true;
            case "Journal":
                return userRole !== ROLES.GUEST || subscribed;
            case "Council":
                return canPost;
        }
    })();

    const isModerator = [ROLES.OWNER, ROLES.ADMIN, ROLES.MOD].includes(userRole);

    return {
        canPost,
        canComment,
        isModerator,
    };
}
