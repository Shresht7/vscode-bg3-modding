// -------------------------
// META.LSX TYPE DEFINITIONS
// -------------------------

export type Meta = {
    save: {
        version: Version,
        region: {
            id: "Config",
            node: NodeRoot
        }
    }
};

export type Version = {
    major: number,
    minor: number,
    revision: number,
    build: number
};

type Node<T extends string = string> = {
    id: T,
    attribute?: NodeAttribute | NodeAttribute[]
    children?: {
        node: Node | Node[]
    }
};

type NodeAttributeType =
    | 'LSString'
    | 'LSWString'
    | 'FixedString'
    | 'uint8'
    | 'int64'
    ;

type NodeAttribute = {
    id: string,
    type: NodeAttributeType,
    value: string
} & {
    type: 'uint8',
    value: number
};

type NodeRoot = {
    id: 'root',
    children: {
        node: [
            NodeDependencies,
            NodeModuleInfo,
        ]
    }
};

export type NodeDependencies = {
    id: 'Dependencies',
    children?: {
        node: NodeDependency[]
    }
};

export type NodeDependency = {
    id: "ModuleShortDesc",
    attribute: NodeDependencyAttribute<NodeDependencyAttributeID>[]
};

export type NodeDependencyAttributeID =
    | 'Folder'
    | 'MD5'
    | 'Name'
    | 'UUID'
    | 'Version64'
    ;

export type NodeDependencyAttribute<T extends NodeDependencyAttributeID> = { id: T, type: NodeAttributeType, value: string } & (
    | { id: 'Folder', type: 'LSString', value: string }
    | { id: 'MD5', type: 'LSString', value: string }
    | { id: 'Name', type: 'LSString', value: string }
    | { id: 'UUID', type: 'FixedString', value: string }
    | { id: 'Version64', type: 'int64', value: string }
);

export type NodeModuleInfo = {
    id: 'ModuleInfo',
    attribute: ModuleInfoAttribute<ModuleInfoAttributeID>[],
    children: {
        node: ModuleInfoChildren[],
    },
};

export type ModuleInfoAttributeID =
    | 'Author'
    | 'CharacterCreationLevelName'
    | 'Description'
    | 'Folder'
    | 'GMTemplate'
    | 'LobbyLevelName'
    | 'MD5'
    | 'MainMenuBackgroundVideo'
    | 'MenuLevelName'
    | 'Name'
    | 'NumPlayers'
    | 'PhotoBooth'
    | 'StartupLevelName'
    | 'Tags'
    | 'Type'
    | 'UUID'
    | 'Version64'
    ;

export type ModuleInfoAttribute<T extends ModuleInfoAttributeID> = { id: T, type: NodeAttributeType, value: string | number } & (
    | { id: 'Author', type: 'LSWString', value: string }
    | { id: 'CharacterCreationLevelName', type: 'FixedString', value: string }
    | { id: 'Description', type: 'LSWString', value: string }
    | { id: 'Folder', type: 'LSWString', value: string }
    | { id: 'GMTemplate', type: 'FixedString', value: string }
    | { id: 'LobbyLevelName', type: 'FixedString', value: string }
    | { id: 'MD5', type: 'LSString', value: string }
    | { id: 'MainMenuBackgroundVideo', type: 'FixedString', value: string }
    | { id: 'MenuLevelName', type: 'FixedString', value: string }
    | { id: 'Name', type: 'FixedString', value: string }
    | { id: 'NumPlayers', type: 'uint8', value: number }
    | { id: 'PhotoBooth', type: 'FixedString', value: string }
    | { id: 'StartupLevelName', type: 'FixedString', value: string }
    | { id: 'Tags', type: 'LSWString', value: string }
    | { id: 'Type', type: 'FixedString', value: 'Adventure' | 'Add-on' }
    | { id: 'UUID', type: 'FixedString', value: string }
    | { id: 'Version64', type: 'int64', value: string }
);

type ModuleInfoChildren =
    | NodePublishVersion
    | NodeScripts
    | NodeTargetModes
    ;

type NodePublishVersion = {
    id: 'PublishVersion',
    attribute: {
        id: 'Version64',
        type: 'int64',
        value: string
    }
};

type NodeScripts = {
    id: 'Scripts'
};

type NodeTargetModes = {
    id: 'TargetModes',
    children: {
        node: {
            id: 'Target',
            attribute: {
                id: 'Object',
                type: 'FixedString',
                value: 'Story'
            }
        }
    }
};
